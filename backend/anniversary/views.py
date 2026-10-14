from rest_framework.response import Response
from rest_framework.decorators import api_view
from django.db.models import Q
import random
from openai import OpenAI, RateLimitError
from .models import Memory, BotConversation
from django.conf import settings
from .tasks import check_pushes

client = OpenAI(
    base_url="https://api.deepseek.com",
    api_key=settings.DEEPSEEK_API_KEY,
)
MODEL = "deepseek-chat"


def get_relevant_memories(user_message, limit=8):
    words = user_message.lower().split()
    query = Q()
    for word in words:
        if len(word) > 3:
            query |= Q(keywords__icontains=word) | Q(title__icontains=word) | Q(description__icontains=word)

    results = Memory.objects.filter(query)[:limit]
    if not results:
        results = Memory.objects.all()[:limit]
    return results


@api_view(["POST"])
def start_conversation(request):
    mode = request.data.get("mode")
    session = BotConversation.objects.create(mode=mode, log="")
    return Response({"session_id": session.id})


def log_to_session(session_id, text):
    if not session_id:
        return
    try:
        session = BotConversation.objects.get(id=session_id)
        session.log += f"\n{text}"
        session.save()
    except BotConversation.DoesNotExist:
        pass


@api_view(["POST"])
def bot_question(request):
    user_message = request.data.get("message")
    conversation = request.data.get("conversation", [])
    session_id = request.data.get("session_id")

    if not user_message:
        return Response({"error": "Nu exista mesaj"}, status=400)

    memories = get_relevant_memories(user_message)
    context = "\n".join(f"- {m.title} ({m.date}): {m.description}" for m in memories)

    system_prompt = f"""Esti Mat-Bot, dar vorbesti STRICT la persoana intai, ca si cum AI FI Matei insusi.
Nu spui "Matei a facut X", spui "am facut X". Nu spui "el ii spune lui Ali", spui "iti spun tie, Ali".
Vorbesti cu Ali direct, cald, ca partenerul ei.

Raspunde DOAR pe baza faptelor de mai jos. Daca nu stii raspunsul, spune ca nu ai (nu ai tu, Matei) informatia asta acum.
Fii cald, jucaus, foloseste emoji ocazional.

FAPTE RELEVANTE (scrise la persoana a treia doar ca referinta interna, dar TU vorbesti la persoana intai despre ele):
{context}
"""

    messages = [{"role": "system", "content": system_prompt}] + conversation + [
        {"role": "user", "content": user_message}
    ]

    try:
        response = client.chat.completions.create(
            model=MODEL,
            messages=messages,
        )
        bot_reply = response.choices[0].message.content

        log_to_session(session_id, f"Ali: {user_message}\nMat-Bot: {bot_reply}")

        return Response({"response": bot_reply})
    except RateLimitError:
        return Response({"response": "Ii e foame la Mat-Bot, intreaba-l pe Matu ce ai de intrebat :)"})


BOT_QUIZ_SYSTEM_PROMPT = """Esti Matei (barbat) si generezi intrebari de quiz pentru Ali (partenera ta, fata), testandu-i cunostintele despre relatia voastra.

CONTEXT: Ali e din Dealu, casa ei e tot in Dealu.

ATENTIE LA GEN GRAMATICAL: Matei e barbat, Ali e fata. Foloseste "noi doi" (NU "noi doua"), 
si acordurile corecte de gen cand vorbesti despre amandoi (ex: "eram amandoi", nu forme exclusiv feminine sau masculine gresit aplicate).

Vorbesti la persoana intai DIRECT catre Ali ("eu", "mi-ai", "ti-am", "ne-am" pentru actiuni reciproce ca sarutat/certat/intalnit).
Toate evenimentele sunt traite impreuna - formuleaza-le ca "noi", nu ca actiuni separate ale lui Matei.

REGULI STRICTE:
1. NU dezvalui raspunsul si NU da indicii in intrebare (gresit: "ce urs, cel cu flori?"; corect: "ce urs ti-am daruit?")
2. NU scrie data in intrebare, chiar daca o testezi (gresit: "ce am facut pe 30 august la Craiova?"; corect: "ce am facut cu prietenii la Craiova?")
3. Intreaba de data/ziua evenimentului DOAR daca amintirea contine o data explicita completa (zi+luna+an) in descriere - altfel nu intreba de data
4. NU inventa detalii care nu apar in amintire
5. Testeaza UN SINGUR fapt (locatie, data, persoana, obiect, actiune, sentiment)

Exemple corecte: "Unde ne-am intalnit prima data?" / "Ce ti-am daruit de ziua ta?" / "In ce zi ti-am scris primul mesaj pe Instagram?" / "Ce porecle glumete aveam noi doi?"

Raspunde DOAR cu intrebarea, fara alte texte."""


CHECK_ANSWER_SYSTEM_PROMPT = """Esti Matei si verifici raspunsul lui Ali la un quiz despre relatia voastra.

CONTEXT: Ali e din Dealu, casa ei e tot in Dealu.

Verifica DOAR daca raspunsul ei e corect la intrebarea pusa (ignora orice alt detaliu din amintire care nu are legatura cu intrebarea).
Vorbesti la persoana intai catre Ali, cald si jucaus, STRICT in romana.

Daca CORECT: comentariu scurt, cald, fara sa repeti raspunsul.
Daca GRESIT si raspunsul e departe de cel corect: comentariu scurt, jucaus, FARA sa dezvalui sau sa dai indicii despre raspunsul corect (ex: "GRESIT 😂❤️ mai ai de munca!").
Daca GRESIT dar aproape corect (lipseste un detaliu mic, sau a formulat altfel): dezvaluie raspunsul corect direct, dulce ("GRESIT, dar erai aproape! De fapt [raspuns] 💕").

Format STRICT: CORECT sau GRESIT, urmat de un comentariu de maximum 15 cuvinte."""


@api_view(["GET"])
def bot_quiz(request):
    exclude_param = request.query_params.get("exclude", "")
    exclude_ids = [int(x) for x in exclude_param.split(",") if x.strip().isdigit()]

    memories = Memory.objects.exclude(id__in=exclude_ids)

    if not memories.exists():
        memories = Memory.objects.all()  # fallback daca s-au epuizat toate

    if not memories.exists():
        return Response({"error": "Nu am nicio amintire inca"}, status=400)

    memory = random.choice(list(memories))

    user_content = f"""Titlu: {memory.title}
Data: {memory.date}
Detalii: {memory.description}"""

    try:
        response = client.chat.completions.create(
            model=MODEL,
            messages=[
                {"role": "system", "content": BOT_QUIZ_SYSTEM_PROMPT},
                {"role": "user", "content": user_content},
            ],
        )
        question = response.choices[0].message.content.strip()

        return Response({
            "question": question,
            "memory_id": memory.id,
        })
    except RateLimitError:
        return Response({"question": "Ii e foame la Mat-Bot, intreaba-l pe Matu ce ai de intrebat :)"})


@api_view(["POST"])
def check_quiz_answer(request):
    memory_id = request.data.get("memory_id")
    user_answer = request.data.get("answer")
    question = request.data.get("question")
    session_id = request.data.get("session_id")
    score = request.data.get("score") or 0
    try:
        memory = Memory.objects.get(id=memory_id)
    except Memory.DoesNotExist:
        return Response({"error": "Nu-mi aduc aminte"}, status=404)

    user_content = f"""Context: {memory.description}
Intrebare: "{question}"
Raspuns Ali: "{user_answer}\""""

    try:
        response = client.chat.completions.create(
            model=MODEL,
            messages=[
                {"role": "system", "content": CHECK_ANSWER_SYSTEM_PROMPT},
                {"role": "user", "content": user_content},
            ],
        )
        ai_response = response.choices[0].message.content.strip()
        is_correct = ai_response.upper().startswith("CORECT")
        if is_correct:
            score += 1
        conversation = BotConversation.objects.get(pk=session_id)
        conversation.score = score
        conversation.save()

        log_to_session(session_id, f"Intrebare: {question}\nAli: {user_answer}\nRezultat: {ai_response}, Scor: {conversation.score}")

        return Response({
            "correct": is_correct,
            "feedback": ai_response,
            "correct_answer": memory.date.isoformat() if memory.date else None,
            "explanation": memory.description,
        })
    except RateLimitError:
        return Response({
            "feedback": "Ii e foame la Mat-Bot, intreaba-l pe Matu ce ai de intrebat :)"
        })


from django.http import JsonResponse
def check_push(request):
    check_pushes()

    return JsonResponse({"status": "ok"})
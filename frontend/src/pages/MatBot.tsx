import { useState, useRef, useEffect } from "react";
import { startConversation, askBotQuestion, getQuizQuestion, checkQuizAnswer } from "./botLogic";
import "./MatBot.css"
import type { Message } from "./botLogic";  

type Step = "greeting" | "category" | "intrebare" | "quiz" | "quiz_finished";

const TOTAL_QUIZ_QUESTIONS = 10;

function MatBot() {
  const [step, setStep] = useState<Step>("greeting");
  const [messages, setMessages] = useState<Message[]>([
    { role: "bot", content: "Salut, sunt Mat-Bot, mare si smecher! 😄" },
  ]);
  const [conversation, setConversation] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [usedMemoryIds, setUsedMemoryIds] = useState<number[]>([]);
  const [sessionId, setSessionId] = useState<number | null>(null);
  const [quizData, setQuizData] = useState<{ question: string; memory_id: number } | null>(null);
  const [score, setScore] = useState(0);
  const [questionCount, setQuestionCount] = useState(0);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const addBotMessage = (text: string) => setMessages(prev => [...prev, { role: "bot", content: text }]);
  const addUserMessage = (text: string) => setMessages(prev => [...prev, { role: "user", content: text }]);

  const chooseCategory = async (mode: "intrebare" | "quiz") => {
    const session = await startConversation(mode);
    setSessionId(session.session_id);
    setStep(mode);

    if (mode === "quiz") {
      setScore(0);
      setQuestionCount(0);
      setUsedMemoryIds([]);

      const questionPromise = getQuizQuestion([]);

      // tut
      addBotMessage("Bun venit la quiz iubire 🦷");

      setTimeout(() => {
        addBotMessage("Premiile sunt următoarele: 🏆");
      }, 3000);

      setTimeout(() => {
        addBotMessage("10 puncte: O să-ți zic șefa mea 1 zi 👑");
      }, 6000);

      setTimeout(() => {
        addBotMessage("8-9 puncte: Îți zic șefa mea 3 ore 😌");
      }, 9000);

      setTimeout(() => {
        addBotMessage("5-7p: Te pup de 20 de ori 💋");
      }, 12000);

      setTimeout(() => {
        addBotMessage(
          "Dacă iei sub 5p te bat și îmi și zici șefu' meu 2 zile 😈"
        );
      }, 15000);

      // after tut
      setTimeout(async () => {
        const q = await questionPromise;

        setQuizData(q);
        setUsedMemoryIds([q.memory_id]);
        setQuestionCount(1);

        addBotMessage(
          `Intrebarea 1/${TOTAL_QUIZ_QUESTIONS}: ${q.question}`
        );
      }, 18000);
    } else {
      addBotMessage("Intreaba-ma orice despre noi! 💬");
    }
  };

  const handleSend = async () => {
    const message = input.trim();
    if (!message) return;

    addUserMessage(message);
    setInput("");

    if (step === "intrebare") {
      const data = await askBotQuestion(message, conversation, sessionId);
      addBotMessage(data.response);
      setConversation(prev => [...prev, { role: "user", content: message }, { role: "assistant", content: data.response }]);
    } else if (step === "quiz" && quizData) {
      const data = await checkQuizAnswer(quizData.memory_id, quizData.question, message, sessionId, score);
      addBotMessage(data.feedback);

      const newScore = data.correct ? score + 1 : score;
      setScore(newScore);

      if (questionCount >= TOTAL_QUIZ_QUESTIONS) {
        addBotMessage(`🎉 Quiz terminat! Ai obtinut ${newScore}/${TOTAL_QUIZ_QUESTIONS} puncte!`);
        setStep("quiz_finished");
      } else {
        const nextQ = await getQuizQuestion(usedMemoryIds); // exclude toate memoriile deja folosite
        setQuizData(nextQ);
        setUsedMemoryIds(prev => [...prev, nextQ.memory_id]);
        const nextCount = questionCount + 1;
        setQuestionCount(nextCount);
        addBotMessage(`Intrebarea ${nextCount}/${TOTAL_QUIZ_QUESTIONS}: ${nextQ.question}`);
      }
    }
  };

  const restartQuiz = () => {
    setStep("category");
    setScore(0);
    setQuestionCount(0);
    setQuizData(null);
    setUsedMemoryIds([]);
  };

  return (
    <>
      <div className="chat-messages">
      {messages.map((m, i) => (
        <div key={i} className={m.role === "user" ? "user-message" : "bot-message"}>
          <div className="message-content">{m.content}</div>
        </div>
      ))}
      <div ref={messagesEndRef} />
      </div>

      {step === "greeting" && (
        <div className="chat-options">
          <button onClick={() => setStep("category")}>Continua</button>
        </div>
      )}

      {step === "category" && (
        <div className="chat-options">
          <button onClick={() => chooseCategory("intrebare")}>❓ Intrebare</button>
          <button onClick={() => chooseCategory("quiz")}>🎯 Quiz</button>
        </div>
      )}

      {(step === "intrebare" || step === "quiz") && (
        <div className="type-part">
          <input
            type="text"
            placeholder="Scrie un mesaj..."
            autoComplete="off"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
          />
          <button onClick={handleSend}>
            <i className="bi bi-send-fill"></i>
          </button>
        </div>
      )}

      {step === "quiz_finished" && (
        <div className="chat-options">
          <button onClick={restartQuiz}>🔄 Joaca din nou</button>
        </div>
      )}
    </>
  );
}

export default MatBot;
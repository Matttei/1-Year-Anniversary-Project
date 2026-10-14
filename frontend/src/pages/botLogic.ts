const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:8000'

export interface Message {
  role: "user" | "assistant" | "bot";
  content: string;
}

function getCsrfToken(): string {
  const match = document.cookie.match(/csrftoken=([^;]+)/);
  return match ? match[1] : "";
}

export async function startConversation(mode: "intrebare" | "quiz") {
  const res = await fetch(`${API_URL}/api/chatbot/start/`, {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json", "X-CSRFToken": getCsrfToken() },
    body: JSON.stringify({ mode }),
  });
  return res.json();
}

export async function askBotQuestion(message: string, conversation: Message[], sessionId: number | null) {
  const res = await fetch(`${API_URL}/api/chatbot/question/`, {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json", "X-CSRFToken": getCsrfToken() },
    body: JSON.stringify({ message, conversation, session_id: sessionId }),
  });
  return res.json();
}

export async function getQuizQuestion(excludeIds: number[] = []) {
  const url = excludeIds.length > 0
    ? `${API_URL}/api/chatbot/quiz/?exclude=${excludeIds.join(",")}`
    : `${API_URL}/api/chatbot/quiz/`;
  const res = await fetch(url, { credentials: "include" });
  return res.json();
}

export async function checkQuizAnswer(memoryId: number, question: string, answer: string, sessionId: number | null, score: number | 0) {
  const res = await fetch(`${API_URL}/api/chatbot/quiz/check/`, {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json", "X-CSRFToken": getCsrfToken() },
    body: JSON.stringify({ memory_id: memoryId, question, answer, session_id: sessionId, score }),
  });
  return res.json();
}
const VAPID_PUBLIC_KEY = import.meta.env.VITE_VAPID_PUBLIC_KEY;


const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:8000';

function urlBase64ToUint8Array(base64String: string) {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding)
    .replace(/-/g, "+")
    .replace(/_/g, "/");

  const rawData = window.atob(base64);

  return Uint8Array.from(
    [...rawData].map((c) => c.charCodeAt(0))
  );
}
const key = urlBase64ToUint8Array(VAPID_PUBLIC_KEY);

console.log("KEY LENGTH:", key.length);
console.log("FIRST BYTE:", key[0]);

export async function setupPushNotifications() {
  if (!("serviceWorker" in navigator) || !("PushManager" in window)) {
    console.warn("Push notifications nu sunt suportate pe acest browser.");
    return;
  }

  // 1. 
  const permission = await Notification.requestPermission();
  if (permission !== "granted") {
    console.log("Utilizatorul a refuzat notificările.");
    return;
  }

  // 2.
  const registration = await navigator.serviceWorker.register("/sw.js");

  await navigator.serviceWorker.ready;

  // 3.
  let subscription = await registration.pushManager.getSubscription();

  if (!subscription) {
    subscription = await registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: key,
    });
  }

  // 4. 
  const response = await fetch(`${API_URL}/api/subscribe/`, {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
  },
  body: JSON.stringify(subscription),
});

console.log("SUBSCRIBE STATUS:", response.status);
console.log("SUBSCRIBE RESPONSE:", await response.text());
}
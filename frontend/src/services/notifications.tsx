import { useEffect, useState } from "react";
import { setupPushNotifications } from "../pushNotifications";
import "./notifications.css";

function NotificationButton() {
  const [permission, setPermission] = useState<NotificationPermission>("default");
  const [isSubscribed, setIsSubscribed] = useState(false);

  useEffect(() => {
    if ("Notification" in window) {
      setPermission(Notification.permission);
    }

    const checkSubscription = async () => {
      if (!("serviceWorker" in navigator)) return;

      const registration = await navigator.serviceWorker.getRegistration();
      const subscription = await registration?.pushManager.getSubscription();

      setIsSubscribed(!!subscription);
    };

    checkSubscription();
  }, []);

  const handleEnableClick = async () => {
    await setupPushNotifications();

    setPermission(Notification.permission);
    setIsSubscribed(Notification.permission === "granted");
  };

  if (isSubscribed) return null;

  if (permission === "denied") {
    return (
      <p className="notification-hint">
        🔕 Ai blocat notificările. Le poți activa din setările browserului.
      </p>
    );
  }

  return (
    <div className="notification-card">
      <div className="notification-icon">🔔</div>

      <div className="notification-content">
        <h3>Nu rata momentele noastre 💕</h3>
        <p>
          Primește o notificare când mai trece o săptămână sau o lună împreună.
        </p>

        <button
          className="notification-button"
          onClick={handleEnableClick}
        >
          Activează notificările
        </button>
      </div>
    </div>
  );
}

export default NotificationButton;
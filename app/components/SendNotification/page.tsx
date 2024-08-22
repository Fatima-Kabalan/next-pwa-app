"use client";

import { useEffect, useState } from "react";

const base64ToUint8Array = (base64: string) => {
  const padding = "=".repeat((4 - (base64.length % 4)) % 4);
  const b64 = (base64 + padding).replace(/-/g, "+").replace(/_/g, "/");
  const rawData = window.atob(b64);
  const outputArray = new Uint8Array(rawData.length);
  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
};

export default function SendNotification() {
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [subscription, setSubscription] = useState<PushSubscription | null>(
    null
  );
  const [registration, setRegistration] =
    useState<ServiceWorkerRegistration | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined" && "serviceWorker" in navigator) {
      navigator.serviceWorker
        .register("/sw.js")
        .then((reg) => {
          console.log("Service Worker registered with scope:", reg.scope);
          setRegistration(reg);

          // Check if already subscribed to push notifications
          reg.pushManager.getSubscription().then((sub) => {
            if (
              sub &&
              !(
                sub.expirationTime &&
                Date.now() > sub.expirationTime - 5 * 60 * 1000
              )
            ) {
              setSubscription(sub);
              setIsSubscribed(true);
            }
          });
        })
        .catch((error) => {
          console.error("Service Worker registration failed:", error);
        });
    }
  }, []);

  const subscribeButtonOnClick = async (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    event.preventDefault();
    if (!process.env.NEXT_PUBLIC_WEB_PUSH_PUBLIC_KEY) {
      throw new Error("Environment variables supplied not sufficient.");
    }
    if (!registration) {
      console.error("No SW registration available.");
      return;
    }
    const sub = await registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: base64ToUint8Array(
        process.env.NEXT_PUBLIC_WEB_PUSH_PUBLIC_KEY
      ),
    });
    setSubscription(sub);
    setIsSubscribed(true);
    console.log("Web push subscribed!");
  };

  const unsubscribeButtonOnClick = async (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    event.preventDefault();
    if (!subscription) {
      console.error("Web push not subscribed");
      return;
    }
    await subscription.unsubscribe();
    setSubscription(null);
    setIsSubscribed(false);
    console.log("Web push unsubscribed!");
  };

  const sendNotificationButtonOnClick = async (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    event.preventDefault();
    if (!subscription) {
      console.error("Web push not subscribed");
      return;
    }
    try {
      const response = await fetch("/api/notification", {
        method: "POST",
        headers: {
          "Content-type": "application/json",
        },
        body: JSON.stringify({ subscription }),
      });
      if (!response.ok) {
        console.error("Failed to send notification:", response.statusText);
      } else {
        console.log("Notification sent successfully");
      }
    } catch (error) {
      console.error("Error sending notification:", error);
    }
  };

  return (
    <div className="flex flex-col items-center space-y-4 p-4">
      <h1 className="text-2xl font-bold mb-4">Push Notification Demo</h1>
      <div className="flex  gap-2">
        <button
          type="button"
          onClick={subscribeButtonOnClick}
          disabled={isSubscribed}
          className={`px-4 py-2 text-white rounded ${
            isSubscribed ? "bg-gray-400" : "bg-blue-500"
          } hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50`}
        >
          Subscribe
        </button>
        <button
          type="button"
          onClick={unsubscribeButtonOnClick}
          disabled={!isSubscribed}
          className={`px-4 py-2 text-white rounded ${
            !isSubscribed ? "bg-gray-400" : "bg-red-500"
          } hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50`}
        >
          Unsubscribe
        </button>
        <button
          type="button"
          onClick={sendNotificationButtonOnClick}
          disabled={!isSubscribed}
          className={`px-4 py-2 text-white rounded ${
            !isSubscribed ? "bg-gray-400" : "bg-green-500"
          } hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50`}
        >
          Send Notification
        </button>
      </div>
    </div>
  );
}

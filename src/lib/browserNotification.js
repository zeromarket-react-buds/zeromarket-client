// utils/browserNotification.js
export async function requestNotificationPermission() {
  if (!("Notification" in window)) {
    alert("이 브라우저는 알림을 지원하지 않습니다.");
    return false;
  }

  if (Notification.permission === "granted") return true;

  if (Notification.permission === "denied") return false;

  const permission = await Notification.requestPermission();
  return permission === "granted";
}
export function showBrowserNotification({ title, body, onClick }) {
  if (Notification.permission !== "granted") return;

  const notification = new Notification(title, {
    body,
    icon: "/zm_logo.svg", // public 폴더 기준
    // badge: "/badge.png", // 선택
    silent: false,
  });

  notification.onclick = () => {
    window.focus();
    onClick?.();
    notification.close();
  };
}

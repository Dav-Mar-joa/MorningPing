export async function subscribeUser() {
  if (!('serviceWorker' in navigator) || !('PushManager' in window)) return;

  try {
    const register = await navigator.serviceWorker.register('/sw.js');
    await navigator.serviceWorker.ready;

    const subscription = await register.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: 'BAsqhQPsfonVsL1vUwgYMtrH8KQoUpy2YeDjp46iZaAPAA86cDlUZPaFuLs_wE_HfIDvja0lQJ5crkxaWyF-YOs'
    });

    const API_URL = window.location.hostname === "localhost"
      ? "http://localhost:4000"
      : "https://morningping.onrender.com";

    const token = localStorage.getItem('token'); // ← JWT

    await fetch(`${API_URL}/subscribe`, {
      method: 'POST',
      body: JSON.stringify(subscription),
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}` // ← plus de credentials
      },
    });

    localStorage.setItem('notif-enabled', 'true');
  } catch (err) {
    console.error('Erreur notifications:', err);
  }
}
// src/utils/subscribeUser.js
// export async function subscribeUser() {
//   if ('serviceWorker' in navigator && 'PushManager' in window) {
//     try {
//       const register = await navigator.serviceWorker.register('/sw.js');

//       const subscription = await register.pushManager.subscribe({
//         userVisibleOnly: true,
//         applicationServerKey: 'BAsqhQPsfonVsL1vUwgYMtrH8KQoUpy2YeDjp46iZaAPAA86cDlUZPaFuLs_wE_HfIDvja0lQJ5crkxaWyF-YOs'
//       });

//       await fetch('https://morningping.onrender.com/subscribe', {
//         method: 'POST',
//         body: JSON.stringify(subscription),
//         headers: { 'Content-Type': 'application/json' },
//         credentials: 'include'
//       });

//       alert('✅ Notifications activées');
//       localStorage.setItem('notif-enabled', 'true');
//       document.getElementById('notif-button')?.remove();
//     } catch (err) {
//       console.error('Erreur lors de l\'activation des notifications :', err);
//       alert('❌ Impossible d\'activer les notifications');
//     }
//   } else {
//     alert('❌ Notifications non supportées sur ce navigateur');
//   }
// }

export async function subscribeUser() {
  if (!('serviceWorker' in navigator) || !('PushManager' in window)) return;

  try {
    const register = await navigator.serviceWorker.register('/sw.js');
    await navigator.serviceWorker.ready; // ← Attendre que le SW soit actif

    const subscription = await register.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: 'BAsqhQPsfonVsL1vUwgYMtrH8KQoUpy2YeDjp46iZaAPAA86cDlUZPaFuLs_wE_HfIDvja0lQJ5crkxaWyF-YOs'
    });

    const API_URL = window.location.hostname === "localhost"
      ? "http://localhost:4000"
      : "https://morningping.onrender.com";

    await fetch(`${API_URL}/subscribe`, {
      method: 'POST',
      body: JSON.stringify(subscription),
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include'
    });

    localStorage.setItem('notif-enabled', 'true');
  } catch (err) {
    console.error('Erreur notifications:', err);
  }
}
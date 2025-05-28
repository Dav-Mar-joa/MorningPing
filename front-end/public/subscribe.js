async function subscribeUser() {
  if ('serviceWorker' in navigator && 'PushManager' in window) {
    const register = await navigator.serviceWorker.register('/sw.js');

    const subscription = await register.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: 'BAsqhQPsfonVsL1vUwgYMtrH8KQoUpy2YeDjp46iZaAPAA86cDlUZPaFuLs_wE_HfIDvja0lQJ5crkxaWyF-YOs'
    });

    await fetch('/subscribe', {
      method: 'POST',
      body: JSON.stringify(subscription),
      headers: { 'Content-Type': 'application/json' }
    });

    alert('✅ Notifications activées');
    localStorage.setItem('notif-enabled', 'true');
    document.getElementById('notif-button').style.display = 'none';
    document.body.style.display = 'block';
  } else {
    alert('❌ Notifications non supportées');
  }
}

window.addEventListener('DOMContentLoaded', () => {
  if (localStorage.getItem('notif-enabled') === 'true') {
    document.getElementById('notif-button')?.remove();
    document.body.style.display = 'block';
  }
});

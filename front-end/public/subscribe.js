function urlBase64ToUint8Array(base64String) {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding)
    .replace(/\-/g, '+')
    .replace(/_/g, '/');

  const rawData = atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}
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
      headers: {
        'Content-Type': 'application/json'
      }
    });

    alert('✅ Notifications activées');
    document.getElementById('notif-button').style.display = 'none';
  } else {
    alert('❌ Notifications no supportées par votre navigateur');
  }
}
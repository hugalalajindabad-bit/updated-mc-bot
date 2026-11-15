(() => {
  const messagesEl = document.getElementById('messages');
  const input = document.getElementById('messageInput');
  const form = document.getElementById('chatForm');
  const statusEl = document.getElementById('serverStatus');
  const pill = document.getElementById('connection');
  let lastSignature = '';
  function node(tag, className, text) { const el = document.createElement(tag); if (className) el.className = className; if (text !== undefined) el.textContent = text; return el; }
  async function loadMessages() {
    try {
      const response = await fetch('/api/chat/messages'); if (!response.ok) return;
      const data = await response.json();
      const signature = data.map(item => item.id).join('|'); if (signature === lastSignature) return; lastSignature = signature;
      const atBottom = messagesEl.scrollHeight - messagesEl.scrollTop - messagesEl.clientHeight < 80;
      messagesEl.replaceChildren();
      for (const item of data) { const row = node('div', `message ${item.source === 'dashboard' ? 'dashboard' : ''}`); row.append(node('span','time',`[${item.time}]`), document.createTextNode(item.text)); messagesEl.append(row); }
      if (atBottom) messagesEl.scrollTop = messagesEl.scrollHeight;
    } catch {}
  }
  async function loadStatus() {
    try {
      const response = await fetch('/api/chat/status'); const data = await response.json();
      pill.textContent = data.online ? '● Connected' : data.connecting ? '◌ Connecting' : '● Disconnected';
      pill.className = `pill ${data.online ? 'online' : 'offline'}`;
      statusEl.replaceChildren();
      const title = node('strong','',data.online ? '🟢 Bot connected' : data.connecting ? '🟡 Bot connecting' : '🔴 Bot disconnected');
      const info = node('div','',`Bot: ${data.username} · Version: ${data.version} · Ping: ${data.ping ?? 'N/A'} ms`);
      const vitals = node('div','',`❤️ Health: ${data.health ?? 'N/A'}/20 · 🍖 Hunger: ${data.food ?? 'N/A'}/20`);
      const players = node('div','',`Players (${data.playersOnline}): ${data.players.join(', ') || 'None'}`);
      const location = node('div','',`Dimension: ${data.dimension}${data.position ? ` · Position: ${data.position.x}, ${data.position.y}, ${data.position.z}` : ''}`);
      statusEl.append(title,info,vitals,players,location);
    } catch { pill.textContent = 'Status unavailable'; pill.className = 'pill offline'; }
  }
  form.addEventListener('submit', async event => {
    event.preventDefault(); const message = input.value.trim(); if (!message) return;
    input.disabled = true;
    try {
      const response = await fetch('/api/chat/send',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({message})});
      const result = await response.json(); if (!response.ok) { alert(result.error || result.message || 'Command failed'); return; }
      input.value = ''; await loadMessages();
    } catch { alert('Could not connect to dashboard.'); }
    finally { input.disabled = false; input.focus(); }
  });
  loadMessages(); loadStatus(); setInterval(loadMessages,1200); setInterval(loadStatus,4000);
})();

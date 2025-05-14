const chatWindow = document.getElementById('chat-window');
const chatForm = document.getElementById('chat-form');
const messageInput = document.getElementById('message-input');
const modeSelect = document.getElementById('mode');

function appendMessage(text, sender) {
    const msgDiv = document.createElement('div');
    msgDiv.classList.add('message', sender);
    const bubble = document.createElement('div');
    bubble.classList.add('bubble', sender);
    bubble.innerHTML = text;
    msgDiv.appendChild(bubble);
    chatWindow.appendChild(msgDiv);
    chatWindow.scrollTop = chatWindow.scrollHeight;
}

chatForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const message = messageInput.value.trim();
    if (!message) return;
    appendMessage(message, 'user');
    messageInput.value = '';
    appendMessage('...', 'bot');
    try {
        const res = await fetch('/message', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ message, mode: modeSelect.value })
        });
        const data = await res.json();
        chatWindow.removeChild(chatWindow.lastChild); // Remove '...'
        if (data.reply) {
            appendMessage(data.reply, 'bot');
        } else {
            appendMessage('No response.', 'bot');
        }
    } catch (err) {
        chatWindow.removeChild(chatWindow.lastChild);
        appendMessage('Error contacting server.', 'bot');
    }
});

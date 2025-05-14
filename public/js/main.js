// Enhanced Chat Interface JavaScript
document.addEventListener('DOMContentLoaded', () => {
    const chatWindow = document.getElementById('chat-window');
    const chatForm = document.getElementById('chat-form');
    const messageInput = document.getElementById('message-input');
    const modeSelect = document.getElementById('mode');
    
    // Function to append a message to the chat window
    function appendMessage(text, sender) {
        const msgDiv = document.createElement('div');
        msgDiv.classList.add('message', sender);
        
        const bubble = document.createElement('div');
        bubble.classList.add('bubble', sender);
        bubble.innerHTML = text;
        
        msgDiv.appendChild(bubble);
        
        // Add timestamp for enhanced UI
        const timestamp = document.createElement('div');
        timestamp.className = 'message-time';
        timestamp.textContent = getCurrentTime();
        msgDiv.appendChild(timestamp);
        
        chatWindow.appendChild(msgDiv);
        
        // Apply entrance animation
        setTimeout(() => {
            bubble.classList.add('pulse');
            setTimeout(() => bubble.classList.remove('pulse'), 300);
        }, 10);
        
        // Scroll to bottom
        chatWindow.scrollTop = chatWindow.scrollHeight;
        
        return msgDiv;
    }
    
    // Helper function to get current time
    function getCurrentTime() {
        const now = new Date();
        return now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }
    
    // Form submission handler
    chatForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const message = messageInput.value.trim();
        if (!message) return;
        
        // Add user message
        appendMessage(message, 'user');
        
        // Clear input field
        messageInput.value = '';
        
        // Add "..." loading message
        const loadingMsg = appendMessage('<div class="typing-indicator"><span></span><span></span><span></span></div>', 'bot');
        
        try {
            // Send message to server
            const res = await fetch('/message', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ message, mode: modeSelect.value })
            });
            
            const data = await res.json();
            
            // Remove loading message
            chatWindow.removeChild(loadingMsg);
            
            // Add bot response
            if (data.reply) {
                // Format code blocks and simple markdown
                let formattedReply = data.reply;
                
                // Only apply formatting if it's a bot message
                // Handle code blocks
                formattedReply = formattedReply.replace(/```([\s\S]*?)```/g, '<pre><code>$1</code></pre>');
                
                // Handle inline code
                formattedReply = formattedReply.replace(/`([^`]+)`/g, '<code>$1</code>');
                
                // Handle bold text
                formattedReply = formattedReply.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
                
                // Handle italic text
                formattedReply = formattedReply.replace(/\*(.*?)\*/g, '<em>$1</em>');
                
                appendMessage(formattedReply, 'bot');
            } else {
                appendMessage('No response.', 'bot');
            }
        } catch (err) {
            // Remove loading message
            chatWindow.removeChild(loadingMsg);
            
            // Show error message
            appendMessage('Error contacting server.', 'bot');
        }
    });
    
    // Focus input on page load
    messageInput.focus();
    
    // Add input animation
    messageInput.addEventListener('focus', () => {
        messageInput.classList.add('active');
    });
    
    messageInput.addEventListener('blur', () => {
        messageInput.classList.remove('active');
    });
});
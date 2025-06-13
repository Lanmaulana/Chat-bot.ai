document.addEventListener('DOMContentLoaded', () => {
    const chatMessages = document.getElementById('chat-messages');
    const userInput = document.getElementById('user-input');
    const sendButton = document.getElementById('send-button');

    function createRain() {
        const rainContainer = document.getElementById('rain-container');
        if (!rainContainer) return;

        const numberOfDrops = 150;

        for (let i = 0; i < numberOfDrops; i++) {
            const drop = document.createElement('div');
            drop.classList.add('raindrop');

            drop.style.left = `${Math.random() * 100}vw`;
            drop.style.height = `${Math.random() * 120 + 20}px`;
            drop.style.opacity = `${Math.random() * 0.4 + 0.2}`;
            drop.style.animationDuration = `${Math.random() * 1 + 0.5}s`;
            drop.style.animationDelay = `${Math.random() * 5}s`;

            rainContainer.appendChild(drop);
        }
    }

    function addMessage(sender, text) {
        const messageDiv = document.createElement('div');
        messageDiv.classList.add('message', `${sender}-message`);

        const contentDiv = document.createElement('div');
        contentDiv.classList.add('message-content');
        contentDiv.textContent = text;

        messageDiv.appendChild(contentDiv);
        chatMessages.appendChild(messageDiv);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    function addTypingIndicator() {
        const typingDiv = document.createElement('div');
        typingDiv.className = 'message bot-message typing-indicator';
        typingDiv.id = 'typing';
        typingDiv.innerHTML = '<span></span><span></span><span></span>';
        chatMessages.appendChild(typingDiv);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    function removeTypingIndicator() {
        const typingDiv = document.getElementById('typing');
        if (typingDiv) typingDiv.remove();
    }

    function sendMessage() {
        const messageText = userInput.value.trim();
        if (messageText === '') return;

        addMessage('user', messageText);
        userInput.value = '';

        addTypingIndicator();

        fetch('/api/gemini', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ message: messageText })
        })
        .then(res => res.json())
        .then(data => {
            removeTypingIndicator();
            addMessage('bot', data.reply);
        })
        .catch(() => {
            removeTypingIndicator();
            addMessage('bot', '⚠️ Terjadi kesalahan server.');
        });
    }

    sendButton.addEventListener('click', sendMessage);
    userInput.addEventListener('keypress', (event) => {
        if (event.key === 'Enter') {
            sendMessage();
        }
    });

    createRain();
    addMessage('bot', 'Halo! Saya Maulana AI. Silakan ketik pesan Anda.');
});

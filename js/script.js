document.addEventListener('DOMContentLoaded', () => {
    const API_KEY = 'ISI_API_KEY_KAMU_DI_SINI'; // <-- ganti dengan API key dari Google AI Studio
    const chatBox = document.getElementById('chatMessages');
    const input = document.getElementById('userInput');
    const sendButton = document.getElementById('sendButton');

    async function handleSendMessage() {
        const text = input.value.trim();
        if (!text) return;
        appendMessage('user', text);
        input.value = '';

        const typingIndicator = appendMessage('bot', 'Mengetik...');

        try {
            const res = await fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=' + API_KEY, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    contents: [{ parts: [{ text }] }]
                })
            });

            typingIndicator.remove();
            const data = await res.json();

            const reply = data?.candidates?.[0]?.content?.parts?.[0]?.text || 'Tidak ada respon.';
            appendFormattedBotMessage(reply);
        } catch (error) {
            typingIndicator.remove();
            console.error(error);
            appendMessage('bot', 'Maaf, terjadi kesalahan koneksi.');
        }
    }

    function appendMessage(sender, text) {
        const msgDiv = document.createElement('div');
        msgDiv.className = `message ${sender}`;
        msgDiv.innerText = text;
        chatBox.appendChild(msgDiv);
        chatBox.scrollTop = chatBox.scrollHeight;
        return msgDiv;
    }

    function appendFormattedBotMessage(text) {
        const msgDiv = document.createElement('div');
        msgDiv.className = 'message bot';
        let formattedText = text.replace(/\*/g, '').replace(/\n/g, '<br>');
        const parts = formattedText.split(/(```[\s\S]*?```)/g).filter(Boolean);

        parts.forEach(part => {
            if (part.startsWith('```')) {
                const code = part.replace(/```/g, '').trim().replace(/^[a-z]+\n/, '');
                const block = document.createElement('div');
                block.className = 'code-block';
                block.innerText = code;

                const btn = document.createElement('button');
                btn.className = 'copy-btn';
                btn.innerText = 'Salin';
                btn.onclick = () => {
                    navigator.clipboard.writeText(code);
                    btn.innerText = 'Disalin!';
                    setTimeout(() => { btn.innerText = 'Salin'; }, 2000);
                };

                block.appendChild(btn);
                msgDiv.appendChild(block);
            } else {
                const textNode = document.createElement('p');
                textNode.style.margin = '0';
                textNode.innerHTML = part.trim();
                msgDiv.appendChild(textNode);
            }
        });

        chatBox.appendChild(msgDiv);
        chatBox.scrollTop = chatBox.scrollHeight;
    }

    sendButton.addEventListener('click', handleSendMessage);
    input.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            handleSendMessage();
        }
    });

    function createRain() {
        const rainContainer = document.querySelector('.rain');
        if (!rainContainer) return;
        for (let i = 0; i < 80; i++) {
            const drop = document.createElement('div');
            drop.classList.add('raindrop');
            drop.style.left = `${Math.random() * 100}vw`;
            drop.style.animationDuration = `${Math.random() * 1 + 0.5}s`;
            drop.style.animationDelay = `${Math.random() * 5}s`;
            rainContainer.appendChild(drop);
        }
    }

    function init() {
        appendMessage('bot', 'Hai, aku Maulana Developer! Ada yang bisa dibantu?');
        createRain();
    }

    init();
});
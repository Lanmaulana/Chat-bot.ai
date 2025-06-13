document.addEventListener('DOMContentLoaded', () => {
    // --- Inisialisasi Elemen Penting ---
    const chatForm = document.getElementById('chat-form');
    const userInput = document.getElementById('user-input');
    const chatBox = document.getElementById('chat-box');
    const sendBtn = document.getElementById('send-btn');

    // --- Logika untuk Tombol Kirim & Auto-Resize Textarea ---
    userInput.addEventListener('input', () => {
        sendBtn.disabled = userInput.value.trim() === '';
        userInput.style.height = 'auto';
        userInput.style.height = (userInput.scrollHeight) + 'px';
    });

    // --- Event Listener Utama Saat Form Dikirim ---
    chatForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const message = userInput.value.trim();
        if (!message) return;
        appendUserMessage(message);
        userInput.value = '';
        userInput.style.height = 'auto';
        sendBtn.disabled = true;
        showTypingIndicator();
        try {
            const aiReply = await getAIResponse(message);
            removeTypingIndicator();
            appendAndAnimateBotMessage(aiReply);
        } catch (error) {
            console.error("Error:", error);
            removeTypingIndicator();
            appendAndAnimateBotMessage("Maaf, terjadi kesalahan pada sistem.");
        }
    });

    // --- Fungsi untuk Menampilkan Pesan Pengguna ---
    function appendUserMessage(message) {
        const messageWrapper = document.createElement('div');
        messageWrapper.className = 'message-wrapper user';
        messageWrapper.innerHTML = `<div class="message-icon"><i class="fa-solid fa-user"></i></div><div class="message-content"></div>`;
        messageWrapper.querySelector('.message-content').textContent = message;
        chatBox.appendChild(messageWrapper);
        chatBox.scrollTop = chatBox.scrollHeight;
    }

    // --- [OTAK UTAMA] Fungsi Canggih untuk Menampilkan Pesan Bot ---
    async function appendAndAnimateBotMessage(text) {
        const messageWrapper = document.createElement('div');
        messageWrapper.className = 'message-wrapper bot';
        messageWrapper.innerHTML = `<div class="message-icon"><i class="fa-solid fa-star-of-life"></i></div><div class="message-content"></div>`;
        const messageDiv = messageWrapper.querySelector('.message-content');
        chatBox.appendChild(messageWrapper);

        // ===== PERUBAHAN UTAMA ADA DI SINI =====
        // Format semua jenis Markdown bintang sebelum diproses
        let formattedText = text
            .replace(/\*\*(.*?)\*\*/g, '<b>$1</b>')  // Mengubah **teks** menjadi tebal
            .replace(/\*(.*?)\*/g, '<i>$1</i>')      // Mengubah *teks* menjadi miring
            .replace(/^\s*\*\s/gm, '• ');         // Mengubah "* " di awal baris menjadi simbol bullet '•'

        // Pecah respons menjadi bagian teks biasa & kode
        const parts = formattedText.split(/(```[\s\S]*?```)/g).filter(Boolean);

        for (const part of parts) {
            if (part.startsWith('```')) {
                const codeElement = createCodeBlockElement(part);
                messageDiv.appendChild(codeElement);
            } else if (part.trim() !== '') {
                const textElement = document.createElement('p');
                messageDiv.appendChild(textElement);
                for (let i = 0; i < part.length; i++) {
                    textElement.innerHTML += part[i] === '\n' ? '<br>' : part[i];
                    chatBox.scrollTop = chatBox.scrollHeight;
                    await new Promise(r => setTimeout(r, 10));
                }
            }
        }
        chatBox.scrollTop = chatBox.scrollHeight;
    }

    // --- Fungsi untuk Membuat Elemen Blok Kode ---
    function createCodeBlockElement(codeBlockText) {
        const code = codeBlockText.replace(/```/g, '').trim();
        const langMatch = code.match(/^[a-z_]+/);
        const language = langMatch ? langMatch[0] : 'code';
        const finalCode = langMatch ? code.substring(langMatch[0].length).trim() : code;
        const codeContainer = document.createElement('div');
        codeContainer.className = 'code-block';
        codeContainer.innerHTML = `<div class="code-header"><button class="copy-btn"><i class="fa-solid fa-copy"></i> Salin Kode</button></div><pre><code></code></pre>`;
        codeContainer.querySelector('code').textContent = finalCode;
        const copyButton = codeContainer.querySelector('.copy-btn');
        copyButton.addEventListener('click', () => {
            navigator.clipboard.writeText(finalCode).then(() => {
                copyButton.innerHTML = `<i class="fa-solid fa-check"></i> Disalin!`;
                setTimeout(() => { copyButton.innerHTML = `<i class="fa-solid fa-copy"></i> Salin Kode`; }, 2000);
            });
        });
        return codeContainer;
    }

    // --- Fungsi Simulasi Panggilan API ---
    async function getAIResponse(userMessage) {
        await new Promise(resolve => setTimeout(resolve, 1500));
        if (userMessage.toLowerCase().includes("jelaskan")) {
          return `Tentu, saya akan jelaskan.\n\nBerikut adalah beberapa poin penting:\n* Ini adalah poin pertama.\n* Ini adalah poin kedua yang *penting*.\n* Dan ini adalah poin **terakhir**.`
        }
        if (userMessage.toLowerCase().includes("html")) {
          return `Tentu, ini adalah contoh **struktur dasar** untuk halaman HTML5.\n\n\`\`\`html\n<!DOCTYPE html>\n<html lang="en">\n<head>\n  <title>Judul Halaman</title>\n</head>\n<body>\n  <p>Konten Anda di sini.</p>\n</body>\n</html>\n\`\`\``;
        }
        return "Halo! Saya Maulana AI. Apa yang bisa saya bantu? Coba tanyakan 'jelaskan sesuatu'.";
    }
    
    // --- Fungsi Utilitas Lainnya (disederhanakan untuk UI baru) ---
    function showTypingIndicator() {}
    function removeTypingIndicator() {}
    
    // --- Inisialisasi Saat Halaman Dimuat ---
    function init() {
        appendAndAnimateBotMessage("Halo! Saya Maulana AI. Apa yang bisa saya bantu?");
    }
    init();
});

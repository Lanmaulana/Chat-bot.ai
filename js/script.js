document.addEventListener('DOMContentLoaded', () => {
  const chatForm = document.getElementById('chat-form');
  const userInput = document.getElementById('user-input');
  const chatBox = document.getElementById('chat-box');

  // --- Event Listener Utama ---
  chatForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const message = userInput.value.trim();
    if (!message) return;

    appendUserMessage(message);
    userInput.value = '';
    userInput.style.height = 'auto';

    showTypingIndicator();

    try {
      const aiReply = await getAIResponse(message);
      removeTypingIndicator();

      // --- LOGIKA BARU YANG LEBIH PINTAR ---
      // 1. Pecah respons menjadi beberapa bagian (teks dan kode)
      const parts = aiReply.split(/(```[\s\S]*?```)/g).filter(Boolean);

      // 2. Tampilkan setiap bagian satu per satu
      for (const part of parts) {
        if (part.startsWith('```')) {
          // Jika bagian ini adalah kode, gunakan fungsi khusus untuk kode
          appendBotCodeMessage(part);
        } else {
          // Jika bagian ini adalah teks, gunakan fungsi khusus untuk teks
          await appendBotTextMessage(part);
        }
      }

    } catch (error) {
      console.error("Error:", error);
      removeTypingIndicator();
      await appendBotTextMessage("Maaf, terjadi kesalahan. Silakan coba lagi.");
    }
  });

  // --- Fungsi untuk Menampilkan Pesan Pengguna ---
  function appendUserMessage(message) {
    const messageWrapper = document.createElement('div');
    messageWrapper.className = 'message-wrapper user';
    messageWrapper.innerHTML = `
      <div class="message-icon"><i class="fa-solid fa-user"></i></div>
      <div class="user-message"></div>
    `;
    messageWrapper.querySelector('.user-message').textContent = message;
    chatBox.appendChild(messageWrapper);
    chatBox.scrollTop = chatBox.scrollHeight;
  }

  // --- [FUNGSI BARU] Khusus untuk menampilkan BUBBLE TEKS dari Bot ---
  async function appendBotTextMessage(text) {
    if (text.trim() === '') return; // Jangan buat bubble jika hanya spasi

    const messageWrapper = document.createElement('div');
    messageWrapper.className = 'message-wrapper bot';
    messageWrapper.innerHTML = `
      <div class="message-icon"><i class="fa-solid fa-robot"></i></div>
      <div class="bot-message"></div>
    `;
    const messageDiv = messageWrapper.querySelector('.bot-message');
    chatBox.appendChild(messageWrapper);

    // Efek mengetik huruf per huruf
    for (let i = 0; i < text.length; i++) {
      messageDiv.innerHTML += text[i] === '\n' ? '<br>' : text[i];
      chatBox.scrollTop = chatBox.scrollHeight;
      await new Promise(r => setTimeout(r, 20));
    }
  }

  // --- [FUNGSI BARU] Khusus untuk menampilkan BUBBLE KODE dari Bot ---
  function appendBotCodeMessage(codeBlockText) {
    const code = codeBlockText.replace(/```/g, '').trim();
    const langMatch = code.match(/^[a-z_]+/);
    const language = langMatch ? langMatch[0] : 'code';
    const finalCode = langMatch ? code.substring(langMatch[0].length).trim() : code;

    const messageWrapper = document.createElement('div');
    messageWrapper.className = 'message-wrapper bot';
    messageWrapper.innerHTML = `
      <div class="message-icon"><i class="fa-solid fa-robot"></i></div>
      <div class="bot-message">
        <div class="code-block">
          <div class="code-header">
            <span>${language}</span>
            <button class="copy-btn"><i class="fa-solid fa-copy"></i> Salin</button>
          </div>
          <pre><code></code></pre>
        </div>
      </div>
    `;
    messageWrapper.querySelector('code').textContent = finalCode;

    const copyButton = messageWrapper.querySelector('.copy-btn');
    copyButton.addEventListener('click', () => {
      navigator.clipboard.writeText(finalCode).then(() => {
        copyButton.innerHTML = `<i class="fa-solid fa-check"></i> Disalin!`;
        setTimeout(() => { copyButton.innerHTML = `<i class="fa-solid fa-copy"></i> Salin`; }, 2000);
      });
    });
    
    chatBox.appendChild(messageWrapper);
    chatBox.scrollTop = chatBox.scrollHeight;
  }

  // --- Fungsi untuk memanggil API Anda ---
  async function getAIResponse(userMessage) {
    await new Promise(resolve => setTimeout(resolve, 1500));
    if (userMessage.toLowerCase().includes("coding html sederhana")) {
      return `Tentu, ini adalah contoh kode HTML dasar:\n\`\`\`html\n<!DOCTYPE html>\n<html>\n<head>\n  <title>Contoh</title>\n</head>\n<body>\n  <h1>Halo, Maulana!</h1>\n</body>\n</html>\n\`\`\`\nSemoga ini membantu!`;
    }
    return "Halo! Ada yang bisa saya bantu? Coba tanyakan 'coding html sederhana'.";
  }

  // --- Fungsi utilitas lainnya (tidak berubah) ---
  function showTypingIndicator() {
    const typingHTML = `<div class="message-wrapper bot typing-indicator"><div class="message-icon"><i class="fa-solid fa-robot"></i></div><div class="bot-message"><span></span><span></span><span></span></div></div>`;
    chatBox.insertAdjacentHTML('beforeend', typingHTML);
    chatBox.scrollTop = chatBox.scrollHeight;
  }
  function removeTypingIndicator() {
    const indicator = chatBox.querySelector('.typing-indicator');
    if (indicator) indicator.remove();
  }
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

  // --- Inisialisasi Saat Halaman Dimuat ---
  function init() {
    appendBotTextMessage("Halo! Saya Maulana AI, apa yang bisa saya bantu?");
    createRain();
    // Logika musik tidak diubah
  }

  init();
});

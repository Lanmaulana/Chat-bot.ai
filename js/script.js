// --- KODE UTAMA DENGAN LOGIKA YANG DISEMPURNAKAN ---

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
      // Gunakan fungsi yang sudah disempurnakan
      appendAndAnimateBotMessage(aiReply);
    } catch (error) {
      console.error("Error:", error);
      removeTypingIndicator();
      appendAndAnimateBotMessage("Maaf, terjadi kesalahan. Silakan coba lagi.");
    }
  });

  // --- Fungsi untuk Menampilkan Pesan Pengguna (Tetap Sama) ---
  function appendUserMessage(message) {
    const messageWrapper = document.createElement('div');
    messageWrapper.className = 'message-wrapper user';
    messageWrapper.innerHTML = `<div class="message-icon"><i class="fa-solid fa-user"></i></div><div class="user-message"></div>`;
    messageWrapper.querySelector('.user-message').textContent = message;
    chatBox.appendChild(messageWrapper);
    chatBox.scrollTop = chatBox.scrollHeight;
  }

  // --- [VERSI TERBAIK] Fungsi Canggih untuk Menampilkan Pesan Bot ---
  async function appendAndAnimateBotMessage(text) {
    // 1. Buat bubble chat kosong untuk bot
    const messageWrapper = document.createElement('div');
    messageWrapper.className = 'message-wrapper bot';
    messageWrapper.innerHTML = `<div class="message-icon"><i class="fa-solid fa-robot"></i></div><div class="bot-message"></div>`;
    const messageDiv = messageWrapper.querySelector('.bot-message');
    chatBox.appendChild(messageWrapper);

    // 2. Format Markdown (bold, dll) dan pecah teks menjadi bagian teks biasa & kode
    let formattedText = text.replace(/\*\*(.*?)\*\*/g, '<b>$1</b>'); // Ganti **teks** jadi <b>teks</b>
    const parts = formattedText.split(/(```[\s\S]*?```)/g).filter(Boolean);

    // 3. Tampilkan setiap bagian satu per satu
    for (const part of parts) {
      if (part.startsWith('```')) {
        // Jika bagian ini adalah kode, buat elemen blok kode khusus
        const codeElement = createCodeBlockElement(part);
        messageDiv.appendChild(codeElement);
      } else if (part.trim() !== '') {
        // Jika ini teks biasa, tampilkan dengan efek mengetik
        const textElement = document.createElement('span');
        messageDiv.appendChild(textElement);
        for (let i = 0; i < part.length; i++) {
          textElement.innerHTML += part[i] === '\n' ? '<br>' : part[i];
          chatBox.scrollTop = chatBox.scrollHeight;
          await new Promise(r => setTimeout(r, 15)); // Kecepatan ketik
        }
      }
    }
    chatBox.scrollTop = chatBox.scrollHeight;
  }

  // --- Fungsi untuk Membuat Elemen Blok Kode dengan Border & Tombol Salin ---
  function createCodeBlockElement(codeBlockText) {
    const code = codeBlockText.replace(/```/g, '').trim();
    const langMatch = code.match(/^[a-z_]+/);
    const language = langMatch ? langMatch[0] : 'code';
    const finalCode = langMatch ? code.substring(langMatch[0].length).trim() : code;

    const codeContainer = document.createElement('div');
    codeContainer.className = 'code-block';
    codeContainer.innerHTML = `
      <div class="code-header">
        <span>${language}</span>
        <button class="copy-btn"><i class="fa-solid fa-copy"></i> Salin</button>
      </div>
      <pre><code></code></pre>
    `;
    codeContainer.querySelector('code').textContent = finalCode;

    const copyButton = codeContainer.querySelector('.copy-btn');
    copyButton.addEventListener('click', () => {
      navigator.clipboard.writeText(finalCode).then(() => {
        copyButton.innerHTML = `<i class="fa-solid fa-check"></i> Disalin!`;
        setTimeout(() => { copyButton.innerHTML = `<i class="fa-solid fa-copy"></i> Salin`; }, 2000);
      });
    });
    return codeContainer;
  }
  
  // --- Fungsi untuk memanggil API Anda ---
  async function getAIResponse(userMessage) {
    try {
      const response = await fetch("./api/gemini.js", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userMessage }),
      });
      const data = await response.json();
      return data.reply || "Tidak ada jawaban.";
    } catch (error) {
      console.error("Error:", error);
      return "Terjadi kesalahan saat menghubungi server.";
    }
  }

  // --- Fungsi utilitas lainnya (Typing Indicator & Rain Animation) ---
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
    const introElement = document.getElementById("intro-message");
    if(introElement) {
        // Gunakan fungsi utama untuk menampilkan pesan pembuka agar formatnya juga benar
        appendAndAnimateBotMessage("Halo! Saya Maulana AI. Apa yang bisa saya bantu? Coba tanyakan 'coding html'.");
        introElement.parentElement.remove(); // Hapus bubble pembuka yang statis
    }
    createRain();
    const music = document.getElementById("bg-music");
    if (music) {
      music.volume = 0.2;
      music.play().catch(() => {
        document.body.addEventListener("click", () => music.play(), { once: true });
      });
    }
  }

  init();
});

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
      appendBotMessage(aiReply);
    } catch (error) {
      console.error("Error:", error);
      removeTypingIndicator();
      appendBotMessage("Maaf, terjadi kesalahan. Silakan coba lagi.");
    }
  });

  // --- Fungsi untuk Menampilkan Pesan Pengguna ---
  function appendUserMessage(message) {
    const messageHTML = `
      <div class="message-wrapper user">
        <div class="message-icon"><i class="fa-solid fa-user"></i></div>
        <div class="user-message">${message}</div>
      </div>
    `;
    chatBox.insertAdjacentHTML('beforeend', messageHTML);
    chatBox.scrollTop = chatBox.scrollHeight;
  }

  // --- [LOGIKA BARU] Fungsi Canggih untuk Menampilkan Pesan Bot ---
  async function appendBotMessage(text) {
    const messageWrapper = document.createElement('div');
    messageWrapper.className = 'message-wrapper bot';
    messageWrapper.innerHTML = `
      <div class="message-icon"><i class="fa-solid fa-robot"></i></div>
      <div class="message"></div>
    `;
    const messageDiv = messageWrapper.querySelector('.message');
    chatBox.appendChild(messageWrapper);
    chatBox.scrollTop = chatBox.scrollHeight;

    // Pisahkan teks biasa dengan blok kode
    const parts = text.split(/(```[\s\S]*?```)/g);

    for (const part of parts) {
      if (part.startsWith('```')) {
        // Jika ini adalah blok kode, buat elemen khusus
        const codeElement = createCodeBlockElement(part);
        messageDiv.appendChild(codeElement);
      } else {
        // Jika ini teks biasa, tampilkan dengan efek mengetik
        for (let i = 0; i < part.length; i++) {
          messageDiv.innerHTML += part.charAt(i) === '\n' ? '<br>' : part.charAt(i);
          chatBox.scrollTop = chatBox.scrollHeight;
          await new Promise(r => setTimeout(r, 15));
        }
      }
    }
    chatBox.scrollTop = chatBox.scrollHeight;
  }

  // --- [LOGIKA BARU] Fungsi untuk Membuat Elemen Blok Kode ---
  function createCodeBlockElement(codeBlockText) {
    const code = codeBlockText.replace(/```/g, '').trim();
    const langMatch = code.match(/^[a-z]+/);
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
    // Mengisi kode menggunakan textContent agar aman dari injeksi HTML
    codeContainer.querySelector('code').textContent = finalCode;

    const copyButton = codeContainer.querySelector('.copy-btn');
    copyButton.addEventListener('click', () => {
      navigator.clipboard.writeText(finalCode).then(() => {
        copyButton.innerHTML = '<i class="fa-solid fa-check"></i> Disalin!';
        setTimeout(() => {
          copyButton.innerHTML = '<i class="fa-solid fa-copy"></i> Salin';
        }, 2000);
      });
    });
    return codeContainer;
  }

  // --- Fungsi untuk memanggil API (tidak diubah) ---
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

  // --- Fungsi utilitas lainnya ---
  function showTypingIndicator() {
    const typingHTML = `
      <div class="message-wrapper bot typing-indicator">
        <div class="message-icon"><i class="fa-solid fa-robot"></i></div>
        <div class="bot-message">
          <span></span><span></span><span></span>
        </div>
      </div>
    `;
    chatBox.insertAdjacentHTML('beforeend', typingHTML);
    chatBox.scrollTop = chatBox.scrollHeight;
  }

  function removeTypingIndicator() {
    const indicator = chatBox.querySelector('.typing-indicator');
    if (indicator) indicator.remove();
  }

  async function typeIntroMessage(text, element) {
    if (!element) return;
    for (let i = 0; i < text.length; i++) {
      element.textContent += text[i];
      await new Promise(r => setTimeout(r, 40));
    }
  }

  // --- [LOGIKA HUJAN] Fungsi & pemanggilan untuk animasi hujan ---
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
  window.addEventListener("load", () => {
    const introElement = document.getElementById("intro-message");
    typeIntroMessage("Halo! Saya Maulana AI, apa yang bisa saya bantu?", introElement);
    
    createRain();

    const music = document.getElementById("bg-music");
    if (music) {
      music.volume = 0.2;
      music.play().catch(() => {
        document.body.addEventListener("click", () => music.play(), { once: true });
      });
    }
  });
});

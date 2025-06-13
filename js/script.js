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
    userInput.style.height = 'auto'; // Reset tinggi textarea

    showTypingIndicator();

    try {
      const aiReply = await getAIResponse(message);
      removeTypingIndicator();
      // Gunakan fungsi canggih yang bisa membedakan teks dan kode
      appendAndAnimateBotMessage(aiReply);
    } catch (error) {
      console.error("Error:", error);
      removeTypingIndicator();
      appendAndAnimateBotMessage("Maaf, terjadi kesalahan. Silakan coba lagi.");
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
    // Menggunakan textContent untuk pesan pengguna demi keamanan
    messageWrapper.querySelector('.user-message').textContent = message;
    chatBox.appendChild(messageWrapper);
    chatBox.scrollTop = chatBox.scrollHeight;
  }

  // --- [OTAK UTAMA] Fungsi Canggih untuk Menampilkan Pesan Bot ---
  async function appendAndAnimateBotMessage(text) {
    const messageWrapper = document.createElement('div');
    messageWrapper.className = 'message-wrapper bot';
    messageWrapper.innerHTML = `
      <div class="message-icon"><i class="fa-solid fa-robot"></i></div>
      <div class="message"></div>
    `;
    const messageDiv = messageWrapper.querySelector('.message');
    chatBox.appendChild(messageWrapper);

    // Pisahkan teks biasa dengan blok kode menggunakan regex.
    // .filter(Boolean) untuk menghapus elemen kosong dari hasil split.
    const parts = text.split(/(```[\s\S]*?```)/g).filter(Boolean);

    for (const part of parts) {
      // Jika bagian ini adalah blok kode
      if (part.startsWith('```')) {
        const codeElement = createCodeBlockElement(part);
        messageDiv.appendChild(codeElement);
      } 
      // Jika ini teks biasa dan bukan hanya spasi kosong
      else if (part.trim() !== '') { 
        const textElement = document.createElement('span');
        messageDiv.appendChild(textElement);
        // Tampilkan teks biasa dengan efek mengetik huruf per huruf
        for (let i = 0; i < part.length; i++) {
          // Ganti newline (\n) dengan tag <br> agar format rapi
          textElement.innerHTML += part[i] === '\n' ? '<br>' : part[i];
          chatBox.scrollTop = chatBox.scrollHeight;
          await new Promise(r => setTimeout(r, 20)); // Kecepatan mengetik
        }
      }
    }
    chatBox.scrollTop = chatBox.scrollHeight;
  }

  // --- Fungsi untuk Membuat Elemen Blok Kode ---
  function createCodeBlockElement(codeBlockText) {
    // Hapus ``` dan deteksi bahasa
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
    // Mengisi kode menggunakan textContent agar aman & format terjaga
    codeContainer.querySelector('code').textContent = finalCode;

    const copyButton = codeContainer.querySelector('.copy-btn');
    copyButton.addEventListener('click', () => {
      navigator.clipboard.writeText(finalCode).then(() => {
        copyButton.innerHTML = `<i class="fa-solid fa-check"></i> Disalin!`;
        setTimeout(() => {
          copyButton.innerHTML = `<i class="fa-solid fa-copy"></i> Salin`;
        }, 2000);
      });
    });
    return codeContainer;
  }

  // --- Fungsi untuk memanggil API Anda (Gantilah dengan fetch asli Anda) ---
  async function getAIResponse(userMessage) {
    // Ini hanya simulasi untuk testing. Ganti dengan logika fetch Anda ke ./api/gemini.js
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      if (userMessage.toLowerCase().includes("coding html")) {
        return `Tentu, ini adalah contoh kode HTML dasar:\n\`\`\`html\n<!DOCTYPE html>\n<html lang="en">\n<head>\n  <title>Contoh Halaman</title>\n</head>\n<body>\n  <h1>Halo, Maulana!</h1>\n</body>\n</html>\n\`\`\`\nSemoga ini membantu!`;
      }
      if (userMessage.toLowerCase().includes("jelaskan css")) {
        return `Tentu! CSS adalah bahasa untuk mendesain web.\n\nBerikut contoh penggunaan:\n\`\`\`css\nbody {\n  font-family: sans-serif;\n  background-color: #f0f0f0;\n}\n\`\`\``;
      }
      return "Halo! Ada yang bisa saya bantu? Coba tanyakan 'coding html' atau 'jelaskan css'.";

    } catch (error) {
      console.error("Error:", error);
      return "Terjadi kesalahan saat menghubungi server.";
    }
  }

  // --- Fungsi utilitas (Typing Indicator & Rain Animation) ---
  function showTypingIndicator() {
    const typingHTML = `<div class="message-wrapper bot typing-indicator"><div class="message-icon"><i class="fa-solid fa-robot"></i></div><div class="message"><span></span><span></span><span></span></div></div>`;
    chatBox.insertAdjacentHTML('beforeend', typingHTML);
    chatBox.scrollTop = chatBox.scrollHeight;
  }
  function removeTypingIndicator() {
    const indicator = chatBox.querySelector('.typing-indicator');
    if (indicator) indicator.remove();
  }
  
  // --- Fungsi untuk Animasi Hujan ---
  function createRain() {
    const rainContainer = document.getElementById('rain-container');
    if (!rainContainer) return; // Pengaman jika elemen tidak ada
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
    // Tampilkan pesan pembuka dengan animasi
    appendAndAnimateBotMessage("Halo! Saya Maulana AI. Apa yang bisa saya bantu?");
    // Buat animasi hujan
    createRain();

    // Logika untuk musik (opsional)
    const music = document.getElementById("bg-music");
    if (music) {
      music.volume = 0.2;
      music.play().catch(() => {
        document.body.addEventListener("click", () => music.play(), { once: true });
      });
    }
  }

  // Jalankan semuanya saat halaman siap
  init();
});

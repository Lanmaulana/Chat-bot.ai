// --- KODE UTAMA ANDA (TIDAK DIUBAH) ---

const chatForm = document.getElementById('chat-form');
const userInput = document.getElementById('user-input');
const chatBox = document.getElementById('chat-box');

chatForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const message = userInput.value.trim();
  if (!message) return;

  appendMessage('user', message);
  userInput.value = '';

  const typingDiv = createTypingIndicator();
  chatBox.appendChild(typingDiv);
  chatBox.scrollTop = chatBox.scrollHeight;

  const aiReply = await getAIResponse(message);
  typingDiv.remove();
  await typeEffect(aiReply);
});

function appendMessage(sender, message) {
  const div = document.createElement('div');
  div.className = sender === 'user' ? 'user-message' : 'bot-message';
  div.textContent = message;
  chatBox.appendChild(div);
  chatBox.scrollTop = chatBox.scrollHeight;
}

async function typeEffect(text) {
  const div = document.createElement('div');
  div.className = 'bot-message';
  chatBox.appendChild(div);
  chatBox.scrollTop = chatBox.scrollHeight;

  const formatted = formatAIResponse(text); // pakai formatter
  let i = 0;
  const typingSpeed = 2; // kecepatan ketik

  function typeChar() {
    if (i <= formatted.length) {
      div.innerHTML = formatted.substring(0, i);
      chatBox.scrollTop = chatBox.scrollHeight;
      i++;
      setTimeout(typeChar, typingSpeed);
    }
  }

  typeChar();
}

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

function createTypingIndicator() {
  const div = document.createElement('div');
  div.className = 'typing-indicator';
  div.innerHTML = '<span></span><span></span><span></span>';
  return div;
}

async function typeIntroMessage(text, elementId) {
  const element = document.getElementById(elementId);
  // Hapus pengecekan 'if (!element) return;' karena struktur HTML sekarang pasti
  for (let i = 0; i < text.length; i++) {
    element.textContent += text[i];
    await new Promise(r => setTimeout(r, 40));
  }
}

// --- FUNGSI UNTUK MEMBUAT HUJAN (DITAMBAHKAN) ---
function createRain() {
    const rainContainer = document.getElementById('rain-container');
    if (!rainContainer) return; // Pengaman jika elemen tidak ada
    const numberOfDrops = 150; 
    
    for (let i = 0; i < numberOfDrops; i++) {
        const drop = document.createElement('div');
        drop.classList.add('raindrop');
        
        // Atur properti acak untuk setiap tetesan
        drop.style.left = `${Math.random() * 100}vw`;
        drop.style.height = `${Math.random() * 120 + 20}px`;
        drop.style.opacity = `${Math.random() * 0.4 + 0.2}`;
        drop.style.animationDuration = `${Math.random() * 1 + 0.5}s`;
        drop.style.animationDelay = `${Math.random() * 5}s`;
        
        rainContainer.appendChild(drop);
    }
}


window.addEventListener("load", () => {
  typeIntroMessage("Halo! Saya Maulana AI, apa yang bisa saya bantu?", "intro-message");

  // --- PANGGIL ANIMASI HUJAN DI SINI (DITAMBAHKAN) ---
  createRain();

  const music = document.getElementById("bg-music");
  if (music) { // Pengaman jika elemen musik tidak ada
    music.volume = 0.2;
    music.play().catch(() => {
        document.body.addEventListener("click", () => {
            music.play();
        }, { once: true });
    });
  }
});
/* Tambahkan di berkas JavaScript utama */

/* Formatter jawaban AI */
function formatAIResponse(rawText) {
  let formatted = rawText
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/\*\*(.*?)\*\*/g, '$1')
    .replace(/\*(.*?)\*/g, '$1')
    .replace(/__(.*?)__/g, '$1')
    .replace(/_(.*?)_/g, '$1');

  // blok ``` ... ```
  formatted = formatted.replace(/```([\s\S]*?)```/g, (_, codeContent) => {
    const id = `code-${Math.random().toString(36).slice(2)}`;
    return `
      <div style="position:relative;">
        <code id="${id}">${codeContent.trim()}</code>
        <button class="copy-btn" onclick="copyCode('${id}')">Salin kode</button>
      </div>
    `;
  });

  return formatted
    .replace(/\n{2,}/g, '<br><br>')
    .replace(/\n/g, '<br>');
}

/* Fungsi salin kode */
function copyCode(id) {
  const el = document.getElementById(id);
  if (!el) return;
  navigator.clipboard.writeText(el.textContent).then(() => {
    const btn = el.nextElementSibling;
    if (btn) {
      btn.textContent = 'Tersalin!';
      setTimeout(() => (btn.textContent = 'Salin kode'), 1500);
    }
  });
}

/* Ganti appendMessage supaya blok kode dirender */
function appendMessage(sender, message) {
  const div = document.createElement('div');
  div.className = sender === 'user' ? 'user-message' : 'bot-message';
  if (sender === 'bot') {
    div.innerHTML = message;      // render HTML hasil formatter
  } else {
    div.textContent = message;    // teks biasa dari user
  }
  chatBox.appendChild(div);
  chatBox.scrollTop = chatBox.scrollHeight;
}

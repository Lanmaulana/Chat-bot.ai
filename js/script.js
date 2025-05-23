const chatForm = document.getElementById('chat-form');
const userInput = document.getElementById('user-input');
const chatBox = document.getElementById('chat-box');

// Ganti dengan API Key kamu
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

  for (let i = 0; i < text.length; i++) {
    div.textContent += text[i];
    chatBox.scrollTop = chatBox.scrollHeight;
    await new Promise(r => setTimeout(r, 15));
  }
}

async function getAIResponse(userMessage) {
  try {
    const response = await fetch(
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=MASUKAN_API_KEY_GOOGLE_GIMINI_KALIANDI_SINI",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [
            {
              parts: [{ text: userMessage }],
            },
          ],
        }),
      }
    );

    const data = await response.json();
    return data.candidates?.[0]?.content?.parts?.[0]?.text || "Tidak ada balasan dari Gemini.";
  } catch (error) {
    console.error("Error:", error);
    return "Terjadi kesalahan saat menghubungi Gemini.";
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
  for (let i = 0; i < text.length; i++) {
    element.textContent += text[i];
    await new Promise(r => setTimeout(r, 40));
  }
}

window.addEventListener("load", () => {
  typeIntroMessage("Halo! Saya Maulana AI, apa yang bisa saya bantu?", "intro-message");

  const music = document.getElementById("bg-music");
  music.volume = 0.2;
  music.play().catch(() => {
    document.body.addEventListener("click", () => {
      music.play();
    }, { once: true });
  });
});
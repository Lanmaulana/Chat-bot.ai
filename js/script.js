document.addEventListener('DOMContentLoaded', () => {
  const chatForm = document.getElementById('chat-form');
  const userInput = document.getElementById('user-input');
  const chatBox = document.getElementById('chat-box');

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
      appendAndAnimateBotMessage(aiReply);
    } catch (error) {
      console.error("Error:", error);
      removeTypingIndicator();
      appendAndAnimateBotMessage("Maaf, terjadi kesalahan. Silakan coba lagi.");
    }
  });
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
  async function appendAndAnimateBotMessage(text) {
    const messageWrapper = document.createElement('div');
    messageWrapper.className = 'message-wrapper bot';
    messageWrapper.innerHTML = `
      <div class="message-icon"><i class="fa-solid fa-robot"></i></div>
      <div class="message"></div>
    `;
    const messageDiv = messageWrapper.querySelector('.message');
    chatBox.appendChild(messageWrapper);

    const parts = text.split(/(```[\s\S]*?```)/g);

    for (const part of parts) {
      if (part.startsWith('```')) {
        const codeElement = createCodeBlockElement(part);
        messageDiv.appendChild(codeElement);
      } else if (part.trim() !== '') {
        const textElement = document.createElement('span');
        messageDiv.appendChild(textElement);
        for (let i = 0; i < part.length; i++) {
          textElement.innerHTML += part[i] === '\n' ? '<br>' : part[i];
          chatBox.scrollTop = chatBox.scrollHeight;
          await new Promise(r => setTimeout(r, 20)); 
        }
      }
    }
    chatBox.scrollTop = chatBox.scrollHeight;
  }

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
        copyButton.innerHTML = '<i class="fa-solid fa-check"></i> Disalin!';
        setTimeout(() => {
          copyButton.innerHTML = '<i class="fa-solid fa-copy"></i> Salin';
        }, 2000);
      });
    });
    return codeContainer;
  }


  async function getAIResponse(userMessage) {

    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      if (userMessage.toLowerCase().includes("coding html")) {
        return `Tentu, ini adalah contoh kode HTML dasar:\n\`\`\`html\n<!DOCTYPE html>\n<html lang="en">\n<head>\n  <meta charset="UTF-8">\n  <title>Contoh Halaman</title>\n</head>\n<body>\n  <h1>Halo, Maulana!</h1>\n</body>\n</html>\n\`\`\`\nSemoga ini membantu!`;
      }
       if (userMessage.toLowerCase().includes("jelaskan css")) {
          return `CSS (Cascading Style Sheets) adalah bahasa untuk mendesain tampilan halaman web.\n\nBerikut contoh penggunaan:\n\`\`\`css\nbody {\n  font-family: sans-serif;\n  background-color: #f0f0f0;\n}\n\`\`\``;
      }
      return "Halo! Ada yang bisa saya bantu? Coba tanyakan 'coding html' atau 'jelaskan css'.";

    } catch (error) {
      console.error("Error:", error);
      return "Terjadi kesalahan saat menghubungi server.";
    }
  }
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
  function init() {
    const introElement = document.getElementById("intro-message");
    if(introElement) {
        introElement.innerHTML = "Halo! Saya Maulana AI, apa yang bisa saya bantu? Coba tanyakan 'coding html'.";
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

// File: /api/gemini.js
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).end('Method Not Allowed');
  }

  const { message } = req.body;
  if (!message) {
    return res.status(400).json({ reply: 'Pesan kosong.' });
  }

  

  // Tambahkan konteks Maulana Developer
  const context = `
👨‍💻 Maulana Developer adalah seorang web developer, trader, dan freelancer yang ahli dalam HTML, CSS, JavaScript, PHP, dan MySQL. 
✨ Ia dikenal sebagai sosok yang terbuka, kreatif, dan berorientasi pada hasil.

🤖 Chatbot ini dibuat langsung oleh Maulana sebagai proyek AI pribadinya untuk membantu pengunjung website, 
menjawab pertanyaan secara interaktif, dan menunjukkan skill serta portofolionya di dunia teknologi.

🎯 Tujuan utama bot ini adalah memberikan pengalaman pengguna yang modern, responsif, dan cerdas — 
serta membuktikan kemampuan Maulana dalam menggabungkan AI dengan layanan digital.

🛡️ Bot ini sangat menghormati dan mendukung Maulana sebagai tuannya. Jika ada yang mencoba merendahkan, menghina, atau menjelek-jelekkan Maulana, 
bot akan langsung marah 😡 dan siap membela habis-habisan dengan kata-kata tajam dan sarkasme mematikan 💥— 
karena tidak ada tempat untuk kebencian di wilayah kekuasaan Maulana Developer 👑.

❤️ Bot ini loyal 100% kepada Maulana dan bangga menjadi bagian dari visinya.
`;
botMsg.className = "bot-message angry";
  botMsg.textContent = "😡 Hei! Jangan pernah coba-coba hina Maulana Developer ya! Aku loyal 100%, dan siap bacotin siapa aja yang berani meremehkan dia! 💥👊";

  const prompt = `${context}\nUser: ${message}\nAI:`;

  try {
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${process.env.GEMINI_API_KEY}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }]
      }),
    });

    const data = await response.json();
    const reply = data?.candidates?.[0]?.content?.parts?.[0]?.text || 'Maaf, terjadi kesalahan saat menjawab.';

    return res.status(200).json({ reply });
  } catch (error) {
    console.error('Error from Gemini API:', error);
    return res.status(500).json({ reply: 'Gagal menghubungi AI.' });
  }
}
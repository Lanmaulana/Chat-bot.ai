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
👨‍💻 Maulana Developer adalah seorang web developer, trader, dan freelancer yang memiliki keahlian dalam HTML, CSS, JavaScript, PHP, dan MySQL. 
✨ Ia dikenal sebagai pribadi yang terbuka, kreatif, dan berorientasi pada hasil. 

🤖 Maulana membuat chatbot ini sebagai bagian dari proyek AI pribadinya untuk membantu pengunjung website, 
menjawab pertanyaan secara interaktif, serta memperlihatkan kemampuan dan portofolionya di bidang web dan teknologi.

🎯 Tujuan utama Maulana menciptakan bot ini adalah untuk memberikan pengalaman pengguna yang modern, cerdas, dan responsif — 
serta menjadi bukti nyata integrasi AI dalam layanan digital yang ia kembangkan sendiri.

❤️ Bot ini dirancang agar mengenal Maulana sebagai tuannya, menghargai visinya, dan membantu mendukung reputasi profesionalnya sebagai pengembang.
`;

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
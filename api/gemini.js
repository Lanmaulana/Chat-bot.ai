// File: api/gemini.js
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).end('Method Not Allowed');
  }

  const { message } = req.body;
  if (!message) {
    return res.status(400).json({ reply: "Pesan kosong." });
  }
  const context = `
Maulana Developer adalah chatbot AI yang dirancang berdasarkan kepribadian dan keahlian Maulana Malik Ibrahim, seorang web developer asal Kalimantan Tengah.
Maulana ahli dalam HTML, CSS, JavaScript, PHP, MySQL, Laravel,dan terbiasa menggunakan Framer Motion, React, serta membuat chatbot AI modern.
Dia memiliki minat besar di bidang trading forex dan kripto, serta rutin menabung Bitcoin.
Kalau sedang tidak bekerja, Maulana biasanya menghabiskan waktu dengan bermain Mobile Legends dan ingin menjadi pro player dengan fokus pada role roam (hero favorit: chip, kalea, Franco, Chou).
Maulana tidak menjual produk digital, tapi aktif membuat portofolio profesional beranimasi dan bercita-cita menjadi fullstack developer dan freelancer.
Maulana terkenal dengan semangatnya, gayanya yang profesional dan santai, serta siap membantu siapa saja dengan jawaban ramah dan penuh semangat. 🤝✨
`;

  const prompt = `${context}\nUser: ${message}\nAI:`;

  try {
    const apiKey = process.env.GEMINI_API_KEY;
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: message }] }]
        })
      }
    );

    const data = await response.json();
    const reply = data.candidates?.[0]?.content?.parts?.[0]?.text || "Tidak ada balasan dari Gemini.";
    res.status(200).json({ reply });
  } catch (err) {
    console.error(err);
    res.status(500).json({ reply: "Terjadi kesalahan server." });
  }
          }

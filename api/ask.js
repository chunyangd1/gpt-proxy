export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Méthode non autorisée' })
  }

  const { question } = req.body

  if (!question) {
    return res.status(400).json({ error: 'Veuillez fournir une question.' })
  }

  const OPENAI_API_KEY = process.env.OPENAI_API_KEY

  try {
    const openaiRes = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content:
              'Tu es un Bouddha bienveillant qui répond avec sérénité, concision et sagesse orientale. Parle comme un maître zen.',
          },
          { role: 'user', content: question },
        ],
        temperature: 0.7,
      }),
    })

    const data = await openaiRes.json()
    const answer = data.choices?.[0]?.message?.content || "Le Bouddha garde le silence..."
    return res.status(200).json({ answer })
  } catch (err) {
    console.error(err)
    return res.status(500).json({ error: "Erreur du serveur." })
  }
}

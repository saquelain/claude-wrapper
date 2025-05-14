import { marked } from 'marked';
import ClaudeAPI from './claudeWrapper.js';
import AdvancedClaudeAPI from './advancedClaudeWrapper.js';

const claude = new ClaudeAPI();
const advancedClaude = new AdvancedClaudeAPI();

function formatClaudeResponse(text) {
  return marked.parse(text || '');
}

export const sendClaudeMessage = async (message) => {
  const response = await claude.createMessage(message);
  if (response && response.content && response.content.length > 0) {
    return formatClaudeResponse(response.content[0].text);
  }
  return null;
};

export const sendAdvancedClaudeMessage = async (message) => {
  const response = await advancedClaude.sendMessage(message);
  if (response && response.content && response.content.length > 0) {
    return formatClaudeResponse(response.content[0].text);
  }
  return null;
};
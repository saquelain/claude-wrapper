// claudeWrapper.js
import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

export default class ClaudeAPI {
  constructor(apiKey = process.env.CLAUDE_API_KEY) {
    this.apiKey = apiKey;
    this.baseUrl = 'https://api.anthropic.com/v1';
    this.defaultModel = 'claude-3-7-sonnet-20250219';
    this.headers = {
      'x-api-key': this.apiKey,
      'anthropic-version': '2023-06-01',
      'content-type': 'application/json'
    };
    this.conversationHistory = [];
  }

  async createMessage(prompt, options = {}) {
    const {
      model = this.defaultModel,
      maxTokens = 1024,
      temperature = 0.7,
      useHistory = false
    } = options;

    // Add the user's message to history
    this.conversationHistory.push({ role: 'user', content: prompt });
    
    // Use conversation history or just current message
    const messages = useHistory ? [...this.conversationHistory] : [{ role: 'user', content: prompt }];
    
    try {
      const response = await axios.post(
        `${this.baseUrl}/messages`,
        {
          model,
          max_tokens: maxTokens,
          temperature,
          messages
        },
        { headers: this.headers }
      );
      
      // Add Claude's response to history for context in future exchanges
      if (response.data.content && response.data.content.length > 0) {
        this.conversationHistory.push({
          role: 'assistant',
          content: response.data.content[0].text
        });
      }
      
      return response.data;
    } catch (error) {
      console.error('Error calling Claude API:', error.response?.data || error.message);
      throw error;
    }
  }
  
  getResponseText(responseData) {
    return responseData.content[0].text;
  }
  
  clearHistory() {
    this.conversationHistory = [];
    return this;
  }
}
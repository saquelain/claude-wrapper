// advancedClaudeWrapper.js
import axios from 'axios';
import dotenv from 'dotenv';
import fs from 'fs/promises';

dotenv.config();

export default class AdvancedClaudeAPI {
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

  async sendMessage(prompt, options = {}) {
    const {
      model = this.defaultModel,
      maxTokens = 1024,
      temperature = 0.7,
      useHistory = false,
      systemPrompt = null
    } = options;

    // Add the current message to history
    this.conversationHistory.push({ role: 'user', content: prompt });
    
    // Use conversation history or just current message
    const messages = useHistory ? [...this.conversationHistory] : [{ role: 'user', content: prompt }];
    
    // Prepare request body
    const requestBody = {
      model,
      max_tokens: maxTokens,
      temperature,
      messages
    };
    
    // Add system prompt if provided
    if (systemPrompt) {
      requestBody.system = systemPrompt;
    }
    
    try {
      const response = await axios.post(
        `${this.baseUrl}/messages`,
        requestBody,
        { headers: this.headers }
      );
      
      // Store Claude's response in history
      if (response.data.content && response.data.content.length > 0) {
        this.conversationHistory.push({
          role: 'assistant',
          content: response.data.content[0].text
        });
      }
      
      return response.data;
    } catch (error) {
      if (error.response) {
        console.error('API Error:', {
          status: error.response.status,
          data: error.response.data
        });
      } else {
        console.error('Request Error:', error.message);
      }
      throw error;
    }
  }
  
  getText(responseData) {
    if (!responseData.content || responseData.content.length === 0) {
      return '';
    }
    return responseData.content[0].text;
  }
  
  clearHistory() {
    this.conversationHistory = [];
    return this;
  }
  
  async saveConversation(filepath) {
    try {
      await fs.writeFile(
        filepath, 
        JSON.stringify(this.conversationHistory, null, 2),
        'utf8'
      );
      return true;
    } catch (error) {
      console.error('Error saving conversation:', error);
      return false;
    }
  }
  
  async loadConversation(filepath) {
    try {
      const data = await fs.readFile(filepath, 'utf8');
      this.conversationHistory = JSON.parse(data);
      return true;
    } catch (error) {
      console.error('Error loading conversation:', error);
      return false;
    }
  }
}
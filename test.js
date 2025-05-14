// test.js
import ClaudeAPI from './claudeWrapper.js';

const runTest = async () => {
  const claude = new ClaudeAPI();
  
  try {
    // Single message
    console.log('Sending message to Claude...');
    const response = await claude.createMessage('Hello Claude! Tell me about yourself in one paragraph.');
    console.log('\nClaude response:');
    console.log(claude.getResponseText(response));
    
    // Follow-up with conversation history
    console.log('\nSending follow-up with conversation history...');
    const followUpResponse = await claude.createMessage(
      'Can you make that shorter?', 
      { useHistory: true }
    );
    console.log('\nClaude follow-up response:');
    console.log(claude.getResponseText(followUpResponse));
  } catch (error) {
    console.error('Test failed:', error);
  }
};

runTest();
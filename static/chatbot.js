// Function to create the chatbot interface
function createChatbotInterface() {
    // Create main container
    const container = document.getElementById('chatbot-container');
    if (!container) {
        container = document.createElement('div');
        container.id = 'chatbot-container';
        container.style.position = 'fixed';
        container.style.bottom = '20px';
        container.style.right = '20px';
        container.style.width = '300px';
        container.style.backgroundColor = '#fff';
        container.style.borderRadius = '10px';
        container.style.boxShadow = '0 0 10px rgba(0,0,0,0.1)';
        container.style.zIndex = '1000';
        document.body.appendChild(container);
    }

    // Create chat window
    const chatWindow = document.getElementById('chat-window');
    if (!chatWindow) {
        chatWindow = document.createElement('div');
        chatWindow.id = 'chat-window';
        chatWindow.style.height = '400px';
        chatWindow.style.overflowY = 'auto';
        chatWindow.style.padding = '15px';
        chatWindow.style.backgroundColor = '#f5f5f5';
        chatWindow.style.borderRadius = '10px 10px 0 0';
        container.appendChild(chatWindow);
    }

    // Create input container
    const inputContainer = document.getElementById('input-container');
    if (!inputContainer) {
        inputContainer = document.createElement('div');
        inputContainer.id = 'input-container';
        inputContainer.style.padding = '10px';
        inputContainer.style.borderTop = '1px solid #ddd';
        inputContainer.style.display = 'flex';
        inputContainer.style.backgroundColor = '#fff';
        inputContainer.style.borderRadius = '0 0 10px 10px';
        container.appendChild(inputContainer);
    }

    // Create input field
    const messageInput = document.getElementById('messageInput');
    if (!messageInput) {
        messageInput = document.createElement('input');
        messageInput.id = 'messageInput';
        messageInput.type = 'text';
        messageInput.placeholder = 'Type your message...';
        messageInput.style.flex = '1';
        messageInput.style.padding = '8px';
        messageInput.style.border = '1px solid #ddd';
        messageInput.style.borderRadius = '4px';
        messageInput.style.marginRight = '8px';
        inputContainer.appendChild(messageInput);
    }

    // Create send button
    const sendButton = document.getElementById('sendButton');
    if (!sendButton) {
        sendButton = document.createElement('button');
        sendButton.id = 'sendButton';
        sendButton.innerText = 'Send';
        sendButton.onclick = sendMessage;
        sendButton.style.padding = '8px 15px';
        sendButton.style.backgroundColor = '#004d2c';
        sendButton.style.color = '#fff';
        sendButton.style.border = 'none';
        sendButton.style.borderRadius = '4px';
        sendButton.style.cursor = 'pointer';
        inputContainer.appendChild(sendButton);
    }
}

// Function to send messages to the chatbot
async function sendMessage() {
    const messageInput = document.getElementById('messageInput');
    const userInput = messageInput.value;
    if (!userInput) return;

    try {
        // Show user message
        const chatMessages = document.getElementById('chat-messages');
        const userMessageDiv = document.createElement('div');
        userMessageDiv.className = 'message user-message';
        userMessageDiv.innerHTML = `<p>${userInput}</p>`;
        chatMessages.appendChild(userMessageDiv);

        // Scroll to bottom
        chatMessages.scrollTop = chatMessages.scrollHeight;

        // Clear input
        messageInput.value = '';

        // Send to server
        const response = await fetch('/chat', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ message: userInput })
        });

        const data = await response.json();
        console.log('Response data:', data); // Debug log

        // Show bot response
        if (data.error) {
            appendBotMessage('Error: ' + data.error);
        } else if (data.reply) {
            appendBotMessage(data.reply);
        } else {
            appendBotMessage('No response received');
        }

    } catch (error) {
        console.error('Error:', error);
        appendBotMessage('Error communicating with the server');
    }
}

// Function to append bot messages
function appendBotMessage(content) {
    const chatMessages = document.getElementById('chat-messages');
    const botMessageDiv = document.createElement('div');
    botMessageDiv.className = 'message bot-message';
    botMessageDiv.innerHTML = `<p>${content}</p>`;
    chatMessages.appendChild(botMessageDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

// Add event listener for Enter key
document.addEventListener('DOMContentLoaded', function() {
    const messageInput = document.getElementById('messageInput');
    if (messageInput) {
        messageInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                sendMessage();
            }
        });
    }
});

// Initialize the chatbot interface when the page loads
window.onload = createChatbotInterface;

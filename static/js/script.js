const socket = io.connect('http://127.0.0.1:5000');
let currentMessageContainer = null;
let currentMessageContent = null;
let currentRole = null;

socket.on('new_message', function (msg) {
    if (msg.role === 'system') {
        createSystemMessage(msg.content);
        if (msg.content === 'Conversation ended') {
            currentMessageContainer = null;
            currentMessageContent = null;
            currentRole = null;
        }
    }
    else {
        if (currentRole !== msg.role || !currentMessageContainer) {
            currentMessageContainer = createChatStructure(msg.role, msg.content);
            currentRole = msg.role;
        } else {
            appendMessageToCurrentContainer(msg.content);
        }

        // Scroll to the bottom
        let chat = document.getElementById('chat');
        chat.scrollTop = chat.scrollHeight;
    }
});

function startConversation() {
    document.getElementById('chat').innerHTML = '';
    let input = document.getElementById('topic_input');
    let topic = input.value;
    socket.emit('start_conversation', { topic: topic });
    input.value = '';
}

// function nextMessage() {
//     let input = document.getElementById('topic_input');
//     let topic = currentMessageContent.innerHTML;
//     console.log("Next message topic:", topic); // Log the topic for debugging
//     socket.emit('next_message', { message: topic });
//     input.value = '';
// }

function createChatStructure(name, content) {
    let chat = document.getElementById('chat');

    let messageContainer = document.createElement('div');
    messageContainer.className = 'messageContainer';
    messageContainer.classList.add('border');
    messageContainer.classList.add('p-2');
    messageContainer.classList.add('mb-2');

    let messageRow = document.createElement('div');
    messageRow.className = 'messageRow';
    messageRow.classList.add('d-flex');
    messageRow.classList.add('align-items-center');

    let messageImg = document.createElement('img');
    switch (name) {
        case 'Nerd':
            messageImg.src = '../static/images/nerd.webp';
            break;
        case 'Old Man':
            messageImg.src = '../static/images/oldman.png';
            break;
        case 'Bold Influencer':
            messageImg.src = '../static/images/gigachad.png';
            break;
        case 'Farmer Joe':
            messageImg.src = '../static/images/farmer.png';
            break;
        default:
            messageImg.src = '../static/images/nerd.webp';
            break;
    }
    messageImg.classList.add('messageImg');
    messageImg.classList.add('rounded-circle');

    let messageSpan = document.createElement('span');
    messageSpan.className = 'messageName';
    messageSpan.classList.add('mx-2');
    messageSpan.classList.add('h5');
    messageSpan.textContent = name;

    messageRow.appendChild(messageImg);
    messageRow.appendChild(messageSpan);

    messageContainer.appendChild(messageRow);

    currentMessageContent = document.createElement('p');
    currentMessageContent.className = 'messageContent';
    currentMessageContent.classList.add('mx-4');
    currentMessageContent.classList.add('mt-1');
    currentMessageContent.textContent = content;

    messageContainer.appendChild(currentMessageContent);
    chat.appendChild(messageContainer);

    return messageContainer;
}

function appendMessageToCurrentContainer(content) {
    if (currentMessageContent) {
        currentMessageContent.textContent = content;
    }
}

function createSystemMessage(content) {
    let chat = document.getElementById('chat');

    let systemMessageDiv = document.createElement('div');
    systemMessageDiv.className = 'systemMessage';
    systemMessageDiv.classList.add('alert');
    systemMessageDiv.classList.add('alert-info');
    systemMessageDiv.textContent = `${content}`;

    chat.insertBefore(systemMessageDiv, chat.firstChild);
}

// Chat System - Modular SDK
import { app, auth, db } from "./firebase-config.js";
import {
    onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import {
    doc,
    getDoc,
    collection,
    addDoc,
    query,
    where,
    orderBy,
    onSnapshot,
    serverTimestamp,
    getDocs
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

// DOM Elements
const chatList = document.getElementById('chatList');
const chatMain = document.getElementById('chatMain');
const chatMessages = document.getElementById('chatMessages');
const chatInput = document.getElementById('chatInput');
const chatSendBtn = document.getElementById('chatSendBtn');
const chatHeaderName = document.getElementById('chatHeaderName');
const chatHeaderType = document.getElementById('chatHeaderType');
const chatHeaderAvatar = document.getElementById('chatHeaderAvatar');
const backToProfile = document.getElementById('backToProfile');
const broadcastBtn = document.getElementById('broadcastBtn');
const broadcastModal = document.getElementById('broadcastModal');
const broadcastModalClose = document.getElementById('broadcastModalClose');
const broadcastSendBtn = document.getElementById('broadcastSendBtn');
const broadcastTarget = document.getElementById('broadcastTarget');
const broadcastMessage = document.getElementById('broadcastMessage');
const chatTabs = document.querySelectorAll('.chat-tab');

// State
let currentUser = null;
let userData = null;
let currentChat = null;
let currentTab = 'direct';
let unsubscribeMessages = null;
let teamMembers = [];

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    checkAuth();
    setupEventListeners();
});

// Check Authentication
function checkAuth() {
    onAuthStateChanged(auth, (user) => {
        if (!user) {
            window.location.href = 'login.html';
            return;
        }
        currentUser = user;
        loadUserData();
    });
}

// Load User Data
async function loadUserData() {
    try {
        const userDoc = await getDoc(doc(db, 'users', currentUser.uid));
        if (userDoc.exists()) {
            userData = userDoc.data();
            setupBroadcastButton();
            loadTeamMembers();
            loadChatList();
        } else {
            window.location.href = 'complete-profile.html';
        }
    } catch (error) {
        console.error('Error loading user data:', error);
    }
}

// Setup Broadcast Button
function setupBroadcastButton() {
    if (!userData) return;

    const canBroadcast = ['captain', 'vice-captain', 'lead'].includes(userData.role);
    if (canBroadcast) {
        broadcastBtn.classList.remove('hidden');
    }
}

// Load Team Members
async function loadTeamMembers() {
    try {
        const usersQuery = query(
            collection(db, 'users'),
            where('profileCompleted', '==', true)
        );

        const querySnapshot = await getDocs(usersQuery);
        teamMembers = [];
        querySnapshot.forEach((doc) => {
            teamMembers.push({ id: doc.id, ...doc.data() });
        });
    } catch (error) {
        console.error('Error loading team members:', error);
    }
}

// Setup Event Listeners
function setupEventListeners() {
    // Chat tabs
    chatTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            chatTabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            currentTab = tab.dataset.tab;
            loadChatList();
        });
    });

    // Send message
    chatSendBtn.addEventListener('click', sendMessage);
    chatInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') sendMessage();
    });

    // Back to profile
    backToProfile.addEventListener('click', () => {
        window.location.href = 'profile.html';
    });

    // Broadcast
    broadcastBtn.addEventListener('click', () => {
        broadcastModal.classList.add('active');
    });

    broadcastModalClose.addEventListener('click', () => {
        broadcastModal.classList.remove('active');
    });

    broadcastSendBtn.addEventListener('click', sendBroadcast);
}

// Load Chat List
async function loadChatList() {
    chatList.innerHTML = '';

    if (currentTab === 'direct') {
        loadDirectChats();
    } else if (currentTab === 'group') {
        loadGroupChats();
    } else if (currentTab === 'department') {
        loadDepartmentChats();
    }
}

// Load Direct Chats
function loadDirectChats() {
    teamMembers.forEach(member => {
        if (member.id === currentUser.uid) return;

        const chatItem = createChatItem({
            type: 'direct',
            id: member.id,
            name: member.name || 'Unknown',
            photoURL: member.photoURL,
            role: member.role,
            department: member.department
        });

        chatList.appendChild(chatItem);
    });
}

// Load Group Chats
function loadGroupChats() {
    const groupChat = createChatItem({
        type: 'group',
        id: 'all',
        name: 'All Members',
        photoURL: null,
        role: 'group',
        department: 'all'
    });

    chatList.appendChild(groupChat);
}

// Load Department Chats
function loadDepartmentChats() {
    if (!userData) return;

    const departments = ['Mechanical', 'Electrical', 'Software', 'Design', 'Management'];
    departments.forEach(dept => {
        const deptChat = createChatItem({
            type: 'department',
            id: dept.toLowerCase(),
            name: `${dept} Department`,
            photoURL: null,
            role: 'department',
            department: dept
        });

        chatList.appendChild(deptChat);
    });
}

// Create Chat Item
function createChatItem(chat) {
    const item = document.createElement('div');
    item.className = 'chat-item';
    item.dataset.chatId = chat.id;
    item.dataset.chatType = chat.type;

    const avatarHTML = chat.photoURL
        ? `<img src="${chat.photoURL}" alt="${chat.name}">`
        : '<i class="fas fa-user"></i>';

    item.innerHTML = `
        <div class="chat-item-header">
            <div class="chat-item-avatar">
                ${avatarHTML}
            </div>
            <div class="chat-item-name">${chat.name}</div>
        </div>
        <div class="chat-item-preview">Click to start chatting</div>
    `;

    item.addEventListener('click', () => openChat(chat));

    return item;
}

// Open Chat
function openChat(chat) {
    currentChat = chat;

    // Update UI
    document.querySelectorAll('.chat-item').forEach(item => {
        item.classList.remove('active');
        if (item.dataset.chatId === chat.id && item.dataset.chatType === chat.type) {
            item.classList.add('active');
        }
    });

    // Update header
    const avatarHTML = chat.photoURL
        ? `<img src="${chat.photoURL}" alt="${chat.name}">`
        : '<i class="fas fa-users"></i>';

    chatHeaderAvatar.innerHTML = avatarHTML;
    chatHeaderName.textContent = chat.name;
    chatHeaderType.textContent = chat.type === 'direct' ? 'Direct Message' : chat.type === 'group' ? 'Group Chat' : 'Department Chat';

    // Show main chat area
    chatMain.classList.add('active');

    // Load messages
    loadMessages();
}

// Load Messages
function loadMessages() {
    if (unsubscribeMessages) {
        unsubscribeMessages();
    }

    let messagesQuery;
    const chatId = getChatId();

    if (currentChat.type === 'direct') {
        messagesQuery = query(
            collection(db, 'chats', chatId, 'messages'),
            orderBy('timestamp', 'asc')
        );
    } else if (currentChat.type === 'group') {
        messagesQuery = query(
            collection(db, 'broadcasts'),
            where('target', '==', 'all'),
            orderBy('timestamp', 'desc')
        );
    } else if (currentChat.type === 'department') {
        messagesQuery = query(
            collection(db, 'broadcasts'),
            where('target', '==', currentChat.id),
            orderBy('timestamp', 'desc')
        );
    }

    unsubscribeMessages = onSnapshot(messagesQuery, (snapshot) => {
        displayMessages(snapshot.docs);
    }, (error) => {
        console.error('Error loading messages:', error);
    });
}

// Get Chat ID
function getChatId() {
    if (currentChat.type === 'direct') {
        const uids = [currentUser.uid, currentChat.id].sort();
        return uids.join('_');
    }
    return currentChat.id;
}

// Display Messages
function displayMessages(messages) {
    chatMessages.innerHTML = '';

    if (currentChat.type === 'group' || currentChat.type === 'department') {
        messages.forEach(doc => {
            const message = doc.data();
            const messageEl = createBroadcastMessage(message);
            chatMessages.appendChild(messageEl);
        });
    } else {
        messages.forEach(doc => {
            const message = doc.data();
            const messageEl = createMessage(message);
            chatMessages.appendChild(messageEl);
        });
    }

    // Scroll to bottom
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

// Create Message Element
function createMessage(message) {
    const messageEl = document.createElement('div');
    const isSent = message.senderId === currentUser.uid;

    messageEl.className = `message ${isSent ? 'sent' : 'received'}`;

    const time = message.timestamp ? new Date(message.timestamp.toDate()).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '';

    messageEl.innerHTML = `
        <div class="message-content">${message.content}</div>
        <div class="message-time">${time}</div>
    `;

    return messageEl;
}

// Create Broadcast Message Element
function createBroadcastMessage(message) {
    const messageEl = document.createElement('div');
    messageEl.className = 'message broadcast';

    const time = message.timestamp ? new Date(message.timestamp.toDate()).toLocaleString() : '';

    messageEl.innerHTML = `
        <div class="message-sender">${message.senderName || 'Announcement'}</div>
        <div class="message-content">${message.content}</div>
        <div class="message-time">${time}</div>
    `;

    return messageEl;
}

// Send Message
async function sendMessage() {
    const content = chatInput.value.trim();
    if (!content || !currentChat) return;

    if (currentChat.type === 'direct') {
        await sendDirectMessage(content);
    } else {
        // For group/department, use broadcast
        await sendBroadcastMessage(content, currentChat.id);
    }

    chatInput.value = '';
}

// Send Direct Message
async function sendDirectMessage(content) {
    try {
        const chatId = getChatId();

        await addDoc(collection(db, 'chats', chatId, 'messages'), {
            senderId: currentUser.uid,
            senderName: userData.name,
            content: content,
            timestamp: serverTimestamp()
        });
    } catch (error) {
        console.error('Error sending message:', error);
    }
}

// Send Broadcast
async function sendBroadcast() {
    const content = broadcastMessage.value.trim();
    const target = broadcastTarget.value;

    if (!content) return;

    await sendBroadcastMessage(content, target);

    broadcastMessage.value = '';
    broadcastModal.classList.remove('active');
}

// Send Broadcast Message
async function sendBroadcastMessage(content, target) {
    try {
        await addDoc(collection(db, 'broadcasts'), {
            senderId: currentUser.uid,
            senderName: userData.name,
            content: content,
            target: target,
            timestamp: serverTimestamp()
        });
    } catch (error) {
        console.error('Error sending broadcast:', error);
    }
}

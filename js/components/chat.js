// Chat Component - Updated with 24-hour structured chat and guided prompts

const Chat = {
    currentChat: null,
    messages: [],
    currentPromptIndex: 0,

    init() {
        this.loadMockMessages();
    },

    loadMockMessages() {
        this.messages = [
            {
                id: 'chat-1',
                participant: {
                    id: 'user-2',
                    name: 'Sarah Johnson',
                    photo: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=face'
                },
                messages: [
                    { id: 'm1', from: 'system', text: '🎉 24-hour chat started! Use the guided prompts below to break the ice.', time: 'Just now', isSystem: true },
                    { id: 'm2', from: 'system', text: '📝 Prompt 1: What brings you to this project?', time: 'Just now', isPrompt: true, promptId: 1 }
                ],
                unread: 2,
                project: 'AI Task Manager',
                expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
                status: 'active' // 'active', 'expired', 'continued'
            },
            {
                id: 'chat-2',
                participant: {
                    id: 'user-3',
                    name: 'Michael Park',
                    photo: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=face'
                },
                messages: [
                    { id: 'm1', from: 'system', text: '🎉 24-hour chat started! Use the guided prompts below to break the ice.', time: 'Just now', isSystem: true },
                    { id: 'm2', from: 'them', text: 'Hey! Thanks for connecting. I saw you\'re interested in the sustainable e-commerce project.', time: '5h ago' },
                    { id: 'm3', from: 'me', text: 'Yes! I love the mission. I have experience in marketing.', time: '4h ago' }
                ],
                unread: 0,
                project: 'Sustainable E-commerce',
                expiresAt: new Date(Date.now() + 12 * 60 * 60 * 1000).toISOString(),
                status: 'active'
            }
        ];
    },

    showChatList() {
        const main = document.querySelector('main');
        
        let html = `
            <section class="fixed inset-0 top-16 bottom-20 overflow-y-auto px-4 py-6">
                <div class="flex items-center justify-between mb-6 max-w-md mx-auto">
                    <h2 class="text-2xl font-bold text-gray-800">Chats</h2>
                </div>
                
                <!-- 24-hour notice -->
                <div class="bg-amber-50 border border-amber-200 rounded-xl p-3 mb-4 max-w-md mx-auto">
                    <div class="flex items-start gap-2">
                        <i class="ph ph-clock text-amber-600 mt-0.5"></i>
                        <div>
                            <p class="text-sm text-amber-800 font-medium">24-Hour Decision Window</p>
                            <p class="text-xs text-amber-600">Chats auto-delete after 24 hours unless both agree to continue</p>
                        </div>
                    </div>
                </div>
                
                <div class="space-y-2 max-w-md mx-auto">
        `;

        this.messages.forEach(chat => {
            const lastMessage = chat.messages[chat.messages.length - 1];
            const isUnread = chat.unread > 0;
            const hoursLeft = this.getHoursLeft(chat.expiresAt);
            const isExpiring = hoursLeft < 6;
            
            html += `
                <div onclick="Chat.openChat('${chat.id}')" class="bg-white rounded-xl p-4 shadow-sm flex items-center gap-4 cursor-pointer hover:shadow-md transition ${isUnread ? 'border-l-4 border-indigo-500' : ''} ${isExpiring ? 'border-l-4 border-amber-500' : ''}">
                    <div class="relative">
                        <img src="${chat.participant.photo}" alt="${chat.participant.name}" class="w-14 h-14 rounded-full object-cover">
                        ${isExpiring ? 
                            `<span class="absolute -top-1 -right-1 w-5 h-5 bg-amber-500 rounded-full border-2 border-white flex items-center justify-center"><i class="ph ph-clock text-white text-xs"></i></span>` :
                            `<span class="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></span>`
                        }
                    </div>
                    <div class="flex-1 min-w-0">
                        <div class="flex items-center justify-between">
                            <h3 class="font-semibold text-gray-800 ${isUnread ? '' : 'font-normal'}">${chat.participant.name}</h3>
                            <span class="text-xs ${isExpiring ? 'text-amber-600 font-medium' : 'text-gray-400'}">${hoursLeft}h left</span>
                        </div>
                        <p class="text-xs text-indigo-600 font-medium">${chat.project}</p>
                        <p class="text-sm text-gray-600 truncate">${lastMessage.text}</p>
                    </div>
                    ${isUnread ? `<span class="w-5 h-5 bg-indigo-600 text-white text-xs rounded-full flex items-center justify-center">${chat.unread}</span>` : ''}
                </div>
            `;
        });

        html += `
                </div>
            </section>
        `;
        
        main.innerHTML = html;
    },

    getHoursLeft(expiresAt) {
        const now = new Date();
        const expires = new Date(expiresAt);
        const diff = expires - now;
        return Math.max(0, Math.floor(diff / (1000 * 60 * 60)));
    },

    openChat(chatId) {
        const chat = this.messages.find(c => c.id === chatId);
        if (!chat) return;
        
        this.currentChat = chat;
        chat.unread = 0;
        
        const main = document.querySelector('main');
        
        const messagesHTML = chat.messages.map(msg => {
            if (msg.isSystem) {
                return `
                    <div class="flex justify-center my-3">
                        <div class="bg-gray-100 rounded-xl px-4 py-2 max-w-[80%]">
                            <p class="text-xs text-gray-500 text-center">${msg.text}</p>
                        </div>
                    </div>
                `;
            }
            if (msg.isPrompt) {
                const prompts = ChatPrompts.getPrompts();
                const prompt = prompts.find(p => p.id === msg.promptId);
                return `
                    <div class="flex justify-center my-3">
                        <div class="bg-indigo-50 border border-indigo-200 rounded-xl px-4 py-3 max-w-[85%]">
                            <div class="flex items-center gap-2 mb-2">
                                <i class="ph ph-lightbulb text-indigo-600"></i>
                                <span class="text-xs font-semibold text-indigo-600">${prompt?.title || 'Prompt'}</span>
                            </div>
                            <p class="text-sm text-gray-700">${msg.text}</p>
                        </div>
                    </div>
                `;
            }
            return `
                <div class="flex ${msg.from === 'me' ? 'justify-end' : 'justify-start'}">
                    <div class="max-w-[75%] ${msg.from === 'me' ? 'bg-indigo-600 text-white' : 'bg-gray-100 text-gray-800'} rounded-2xl px-4 py-2 ${msg.from === 'me' ? 'rounded-br-sm' : 'rounded-bl-sm'}">
                        <p class="text-sm">${msg.text}</p>
                        <p class="text-xs ${msg.from === 'me' ? 'text-indigo-200' : 'text-gray-400'} mt-1">${msg.time}</p>
                    </div>
                </div>
            `;
        }).join('');

        const hoursLeft = this.getHoursLeft(chat.expiresAt);
        const isExpiring = hoursLeft < 6;

        html = `
            <section class="fixed inset-0 top-16 bottom-20 flex flex-col bg-gray-50">
                <!-- Timer Banner -->
                <div class="bg-${isExpiring ? 'amber' : 'indigo'}-600 text-white px-4 py-2 flex items-center justify-center gap-2">
                    <i class="ph ph-clock"></i>
                    <span class="text-sm font-medium">${hoursLeft}h remaining to decide</span>
                </div>
                
                <!-- Chat Header -->
                <div class="bg-white border-b px-4 py-3 flex items-center gap-3 flex-shrink-0">
                    <button onclick="Chat.showChatList()" class="text-gray-500 hover:text-gray-700">
                        <i class="ph ph-arrow-left text-xl"></i>
                    </button>
                    <div class="relative">
                        <img src="${chat.participant.photo}" alt="${chat.participant.name}" class="w-10 h-10 rounded-full object-cover">
                        <span class="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></span>
                    </div>
                    <div class="flex-1">
                        <h3 class="font-semibold text-gray-800">${chat.participant.name}</h3>
                        <p class="text-xs text-indigo-600">${chat.project}</p>
                    </div>
                </div>
                
                <!-- Messages -->
                <div id="chat-messages" class="flex-1 overflow-y-auto p-4 space-y-2">
                    ${messagesHTML}
                </div>
                
                <!-- Guided Prompts -->
                <div class="bg-white border-t p-3">
                    <p class="text-xs text-gray-500 mb-2">Quick responses:</p>
                    <div class="flex gap-2 overflow-x-auto pb-2">
                        <button onclick="Chat.sendPrompt(1)" class="flex-shrink-0 px-3 py-1.5 bg-indigo-50 text-indigo-700 text-xs rounded-full hover:bg-indigo-100 transition">
                            What brings you here?
                        </button>
                        <button onclick="Chat.sendPrompt(2)" class="flex-shrink-0 px-3 py-1.5 bg-indigo-50 text-indigo-700 text-xs rounded-full hover:bg-indigo-100 transition">
                            Work style?
                        </button>
                        <button onclick="Chat.sendPrompt(3)" class="flex-shrink-0 px-3 py-1.5 bg-indigo-50 text-indigo-700 text-xs rounded-full hover:bg-indigo-100 transition">
                            Handle disagreements?
                        </button>
                        <button onclick="Chat.sendPrompt(4)" class="flex-shrink-0 px-3 py-1.5 bg-green-50 text-green-700 text-xs rounded-full hover:bg-green-100 transition">
                            Continue together?
                        </button>
                    </div>
                </div>
                
                <!-- Input -->
                <div class="bg-white border-t p-3">
                    <div class="flex items-center gap-2">
                        <button class="text-gray-400 hover:text-gray-600 p-2">
                            <i class="ph ph-image text-xl"></i>
                        </button>
                        <input type="text" id="message-input" placeholder="Type a message..." 
                            class="flex-1 bg-gray-100 rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            onkeypress="if(event.key === 'Enter') Chat.sendMessage()">
                        <button onclick="Chat.sendMessage()" class="w-10 h-10 rounded-full bg-indigo-600 text-white flex items-center justify-center hover:bg-indigo-700 transition">
                            <i class="ph ph-paper-plane-right"></i>
                        </button>
                    </div>
                </div>
            </section>
        `;
        
        main.innerHTML = html;
        
        // Scroll to bottom
        const messagesContainer = document.getElementById('chat-messages');
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    },

    sendPrompt(promptId) {
        if (!this.currentChat) return;
        
        const prompts = ChatPrompts.getPrompts();
        const prompt = prompts.find(p => p.id === promptId);
        
        if (!prompt) return;
        
        // Add prompt as a special message
        const promptMessage = {
            id: 'm' + Date.now(),
            from: 'system',
            text: prompt.questions[0],
            time: 'Just now',
            isPrompt: true,
            promptId: promptId
        };
        
        this.currentChat.messages.push(promptMessage);
        
        // Add to UI
        const messagesContainer = document.getElementById('chat-messages');
        const messageHTML = `
            <div class="flex justify-center my-3">
                <div class="bg-indigo-50 border border-indigo-200 rounded-xl px-4 py-3 max-w-[85%]">
                    <div class="flex items-center gap-2 mb-2">
                        <i class="ph ph-lightbulb text-indigo-600"></i>
                        <span class="text-xs font-semibold text-indigo-600">${prompt.title}</span>
                    </div>
                    <p class="text-sm text-gray-700">${prompt.questions[0]}</p>
                </div>
            </div>
        `;
        
        messagesContainer.insertAdjacentHTML('beforeend', messageHTML);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    },

    sendMessage() {
        const input = document.getElementById('message-input');
        const text = input.value.trim();
        
        if (!text || !this.currentChat) return;
        
        const newMessage = {
            id: 'm' + Date.now(),
            from: 'me',
            text: text,
            time: 'Just now'
        };
        
        this.currentChat.messages.push(newMessage);
        
        // Add message to UI
        const messagesContainer = document.getElementById('chat-messages');
        const messageHTML = `
            <div class="flex justify-end">
                <div class="max-w-[75%] bg-indigo-600 text-white rounded-2xl px-4 py-2 rounded-br-sm">
                    <p class="text-sm">${text}</p>
                    <p class="text-xs text-indigo-200 mt-1">Just now</p>
                </div>
            </div>
        `;
        
        messagesContainer.insertAdjacentHTML('beforeend', messageHTML);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
        
        input.value = '';
        
        // Simulate reply after 2 seconds
        setTimeout(() => {
            this.simulateReply();
        }, 2000);
    },

    simulateReply() {
        if (!this.currentChat) return;
        
        const replies = [
            'That\'s a great point! I\'ve been thinking the same thing.',
            'Interesting! Tell me more about your approach.',
            'I agree. Let\'s figure out the best way forward.',
            'Thanks for sharing! This helps me understand better.',
            'Great question. Here\'s what I think...'
        ];
        
        const randomReply = replies[Math.floor(Math.random() * replies.length)];
        
        const newMessage = {
            id: 'm' + Date.now(),
            from: 'them',
            text: randomReply,
            time: 'Just now'
        };
        
        this.currentChat.messages.push(newMessage);
        
        const messagesContainer = document.getElementById('chat-messages');
        const messageHTML = `
            <div class="flex justify-start">
                <div class="max-w-[75%] bg-gray-100 text-gray-800 rounded-2xl px-4 py-2 rounded-bl-sm">
                    <p class="text-sm">${randomReply}</p>
                    <p class="text-xs text-gray-400 mt-1">Just now</p>
                </div>
            </div>
        `;
        
        messagesContainer.insertAdjacentHTML('beforeend', messageHTML);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }
};

// Initialize chat
Chat.init();

// Make Chat available globally
window.Chat = Chat;

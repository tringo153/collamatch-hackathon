// Chat Component - Updated with 24-hour structured chat and YES/NO decision

const Chat = {
    currentChat: null,
    messages: [],
    currentPromptIndex: 0,

    init() {
        // Load chats from AppData
        this.loadChats();
    },

    loadChats() {
        // Use AppData.chats if available, otherwise empty array
        this.messages = AppData.chats || [];
    },

    showChatList() {
        // Reload chats from AppData
        this.loadChats();
        
        const main = document.querySelector('main');
        
        if (this.messages.length === 0) {
            main.innerHTML = `
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
                    
                    <div class="text-center py-12 max-w-md mx-auto">
                        <i class="ph ph-chat-circle text-5xl text-gray-300 mb-4"></i>
                        <h3 class="text-lg font-semibold text-gray-600 mb-2">No Matches Yet</h3>
                        <p class="text-gray-400 mb-4">Start swiping to find your perfect matches!</p>
                        <button onclick="Browse.init()" class="px-6 py-2 bg-indigo-600 text-white rounded-full hover:bg-indigo-700 transition">
                            Discover Now
                        </button>
                    </div>
                </section>
            `;
            return;
        }
        
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
            const lastMessage = chat.messages && chat.messages.length > 0 ? chat.messages[chat.messages.length - 1] : null;
            const isUnread = chat.unread > 0;
            const hoursLeft = this.getHoursLeft(chat.expiresAt);
            const isExpiring = hoursLeft < 6;
            const lastMessageText = lastMessage ? lastMessage.text : 'No messages yet';
            
            // Skip rejected chats
            if (chat.status === 'rejected') return;
            
            html += `
                <div onclick="Chat.openChat('${chat.id}')" class="bg-white rounded-xl p-4 shadow-sm flex items-center gap-4 cursor-pointer hover:shadow-md transition ${isUnread ? 'border-l-4 border-indigo-500' : ''} ${isExpiring ? 'border-l-4 border-amber-500' : ''}">
                    <div class="relative">
                        <img src="${chat.participant.photo || 'https://ui-avatars.com/api/?name=' + encodeURIComponent(chat.participant.name || 'U') + '&background=6366f1&color=fff&size=128&font-size=0.4&length=1'}" alt="${chat.participant.name}" class="w-14 h-14 rounded-full object-cover">
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
                        <p class="text-xs text-indigo-600 font-medium">${chat.project ? chat.project.title : 'Match'}</p>
                        <p class="text-sm text-gray-600 truncate">${lastMessageText}</p>
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
            // Check if message is from current user
            const currentUserId = AppData.currentUser?.id;
            const currentUserIdAlt = AppData.currentUser?.originalId || (currentUserId === 'current' ? 'user-1' : currentUserId);
            const isMe = msg.senderId === currentUserId || msg.senderId === currentUserIdAlt || msg.from === 'me';
            
            return `
                <div class="flex ${isMe ? 'justify-end' : 'justify-start'}">
                    <div class="max-w-[75%] ${isMe ? 'bg-indigo-600 text-white' : 'bg-gray-100 text-gray-800'} rounded-2xl px-4 py-2 ${isMe ? 'rounded-br-sm' : 'rounded-bl-sm'}">
                        <p class="text-sm">${msg.text}</p>
                        <p class="text-xs ${isMe ? 'text-indigo-200' : 'text-gray-400'} mt-1">${msg.time}</p>
                    </div>
                </div>
            `;
        }).join('');

        const hoursLeft = this.getHoursLeft(chat.expiresAt);
        const isExpiring = hoursLeft < 6;
        
        // Decision buttons (only show if chat is still active)
        const decisionButtons = chat.status === 'active' ? `
            <div class="bg-white border-t p-3">
                <p class="text-xs text-gray-500 mb-2 text-center">Your decision:</p>
                <div class="flex gap-2">
                    <button onclick="Chat.rejectMatch('${chat.id}')" class="flex-1 py-3 border-2 border-gray-300 text-gray-600 font-semibold rounded-xl hover:bg-gray-50 transition flex items-center justify-center gap-2">
                        <i class="ph ph-x"></i> No Thanks
                    </button>
                    <button onclick="Chat.acceptMatch('${chat.id}')" class="flex-1 py-3 bg-gradient-to-r from-green-500 to-emerald-500 text-white font-semibold rounded-xl hover:shadow-lg transition flex items-center justify-center gap-2">
                        <i class="ph ph-heart"></i> Yes! Continue
                    </button>
                </div>
            </div>
        ` : '';
        
        // Contact exchange display (if continued)
        const contactDisplay = chat.status === 'continued' && chat.contactExchanged ? `
            <div class="bg-green-50 border-t p-3">
                <p class="text-sm font-medium text-green-800 mb-2"><i class="ph ph-check-circle"></i> Contact Info Shared!</p>
                <div class="text-xs text-green-700">
                    <p>Email: ${chat.contactExchanged.email || 'Not provided'}</p>
                    ${chat.contactExchanged.linkedin ? `<p>LinkedIn: ${chat.contactExchanged.linkedin}</p>` : ''}
                    ${chat.contactExchanged.twitter ? `<p>Twitter: ${chat.contactExchanged.twitter}</p>` : ''}
                </div>
            </div>
        ` : '';

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
                        <img src="${chat.participant.photo || 'https://ui-avatars.com/api/?name=' + encodeURIComponent(chat.participant.name || 'U') + '&background=6366f1&color=fff&size=100&font-size=0.4&length=1'}" alt="${chat.participant.name}" class="w-10 h-10 rounded-full object-cover">
                        <span class="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></span>
                    </div>
                    <div class="flex-1">
                        <h3 class="font-semibold text-gray-800">${chat.participant.name}</h3>
                        <p class="text-xs text-indigo-600">${chat.project ? chat.project.title : 'Match'}</p>
                    </div>
                </div>
                
                <!-- Messages -->
                <div id="chat-messages" class="flex-1 overflow-y-auto p-4 space-y-2">
                    ${messagesHTML}
                </div>
                
                <!-- Guided Prompts (hide if decision already made) -->
                ${chat.status !== 'continued' ? `
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
                ` : ''}
                
                <!-- Input (hide if decision made) -->
                ${chat.status !== 'continued' ? `
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
                ` : ''}
                
                <!-- Contact Exchange Display -->
                ${contactDisplay}
                
                <!-- Decision Buttons -->
                ${decisionButtons}
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

    async sendMessage() {
        const input = document.getElementById('message-input');
        const text = input.value.trim();
        
        if (!text || !this.currentChat) return;
        
        // Get current user ID - use originalId if available
        const currentUserId = AppData.currentUser?.id;
        const currentUserIdAlt = AppData.currentUser?.originalId || (currentUserId === 'current' ? 'user-1' : currentUserId);
        
        const newMessage = {
            id: 'm' + Date.now(),
            senderId: currentUserIdAlt || currentUserId,
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
        
        // Save chat to AppData and Database
        const chatIndex = this.messages.findIndex(c => c.id === this.currentChat.id);
        if (chatIndex >= 0) {
            this.messages[chatIndex] = this.currentChat;
        }
        
        // Save to database for persistence
        if (this.currentChat && this.currentChat.id) {
            await Database.add('chats', this.currentChat);
        }
    },
    
    // Accept match - exchange contacts and continue
    async acceptMatch(chatId) {
        const chat = this.messages.find(c => c.id === chatId);
        if (!chat) return;
        
        // Update chat status
        chat.status = 'continued';
        
        // Get current user's contact info
        const userContact = AppData.currentUser.contact || { email: '', linkedin: '', twitter: '' };
        
        // Simulate exchange (in real app, this would be mutual)
        chat.contactExchanged = {
            name: chat.participant.name,
            email: chat.participant.name.toLowerCase().replace(' ', '.') + '@example.com',
            linkedin: 'linkedin.com/in/' + chat.participant.name.toLowerCase().replace(' ', '-'),
            twitter: '@' + chat.participant.name.toLowerCase().replace(' ', '')
        };
        
        // Add system message
        chat.messages.push({
            id: 'm' + Date.now(),
            from: 'system',
            text: '🎉 Great decision! You decided to continue together. Contact info has been exchanged!',
            time: 'Just now',
            isSystem: true
        });
        
        // Add our contact info to the chat
        chat.messages.push({
            id: 'm' + Date.now(),
            from: 'system',
            text: `📧 Your contact info shared: ${userContact.email || 'No email'}`,
            time: 'Just now',
            isSystem: true
        });
        
        // Save to database
        await Database.saveChat(chat);
        
        // Re-render the chat
        this.openChat(chatId);
        
        // Show success message
        alert('🎉 You decided to continue! Contact info has been exchanged. You can now connect outside the app!');
    },
    
    // Reject match - delete chat
    async rejectMatch(chatId) {
        const chat = this.messages.find(c => c.id === chatId);
        if (!chat) return;
        
        // Confirm deletion
        if (!confirm('Are you sure? The chat will be deleted and you won\'t be able to reconnect through this app.')) {
            return;
        }
        
        // Update chat status
        chat.status = 'rejected';
        
        // Add system message before deleting
        chat.messages.push({
            id: 'm' + Date.now(),
            from: 'system',
            text: '👋 This chat has ended. Best of luck with your search!',
            time: 'Just now',
            isSystem: true
        });
        
        // Remove from AppData.chats (delete chat)
        AppData.chats = AppData.chats.filter(c => c.id !== chatId);
        
        // Delete from database
        await Database.deleteChat(chatId);
        
        // Show chat list
        this.showChatList();
    }
};

// Initialize chat
Chat.init();

// Make Chat available globally
window.Chat = Chat;

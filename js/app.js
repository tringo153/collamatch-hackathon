// Main Application Entry Point

const App = {
    init() {
        console.log('SynCo - Initializing...');
        
        // Initialize components
        Navbar.render();
        
        // Check if user has completed profile, otherwise show signup
        if (!AppData.currentUser.name || AppData.currentUser.name === 'Alex Chen') {
            // Show browse screen by default (it will work with default data)
            Browse.init();
        } else {
            // User has profile, show browse
            Browse.init();
        }
        
        // Setup bottom navigation
        this.setupNavigation();
        
        // Add animation to buttons
        this.setupButtonAnimations();
        
        console.log('SynCo - Ready!');
    },

    setupNavigation() {
        const navButtons = document.querySelectorAll('.nav-btn');
        
        navButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                const page = btn.dataset.page;
                
                // Update active state
                navButtons.forEach(b => b.classList.remove('active', 'text-indigo-600'));
                navButtons.forEach(b => b.classList.add('text-gray-400'));
                btn.classList.remove('text-gray-400');
                btn.classList.add('active', 'text-indigo-600');
                
                // Handle page navigation
                this.navigateTo(page);
            });
        });
    },

    navigateTo(page) {
        console.log('Navigating to:', page);
        
        // Reset main content padding
        const main = document.querySelector('main');
        main.className = 'pt-20 pb-24';
        
        switch(page) {
            case 'discover':
                // Show browse screen
                Browse.init();
                break;
            case 'matches':
                this.showMatchesPage();
                break;
            case 'chats':
                // Use Chat component for chats
                Chat.showChatList();
                break;
            case 'profile':
                Modal.showProfileModal(AppData.currentUser);
                break;
            case 'signup':
                Signup.show();
                break;
        }
    },

    showMatchesPage() {
        const main = document.querySelector('main');
        
        if (AppData.matches.length === 0) {
            main.innerHTML = `
                <section class="fixed inset-0 top-16 bottom-20 overflow-y-auto px-4 py-8">
                    <h2 class="text-2xl font-bold text-gray-800 mb-6 max-w-md mx-auto">Your Matches</h2>
                    <div class="empty-state max-w-md mx-auto">
                        <i class="ph ph-heart"></i>
                        <h3>No Matches Yet</h3>
                        <p>Start swiping to find your perfect project partners!</p>
                        <button onclick="location.reload()" class="mt-4 px-6 py-2 bg-indigo-600 text-white rounded-full hover:bg-indigo-700 transition">
                            Discover Now
                        </button>
                    </div>
                </section>
            `;
            return;
        }
        
        let html = `
            <section class="fixed inset-0 top-16 bottom-20 overflow-y-auto px-4 py-6">
                <h2 class="text-2xl font-bold text-gray-800 mb-6 max-w-md mx-auto">Your Matches (${AppData.matches.length})</h2>
                <div class="space-y-4 max-w-md mx-auto">
        `;
        
        AppData.matches.forEach(match => {
            html += `
                <div class="bg-white rounded-xl p-4 shadow-sm flex items-center gap-4 cursor-pointer hover:shadow-md transition">
                    <img src="${match.item.owner.avatar}" alt="${match.item.owner.name}" class="w-16 h-16 rounded-full object-cover">
                    <div class="flex-1">
                        <h3 class="font-semibold text-gray-800">${match.item.owner.name}</h3>
                        <p class="text-sm text-gray-600">${match.item.title}</p>
                        <p class="text-xs text-gray-400">Matched ${this.formatDate(match.matchedAt)}</p>
                    </div>
                    <button class="w-10 h-10 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center hover:bg-indigo-200 transition">
                        <i class="ph ph-chat-circle text-xl"></i>
                    </button>
                </div>
            `;
        });
        
        html += `
                </div>
            </section>
        `;
        
        main.innerHTML = html;
    },

    showMessagesPage() {
        const main = document.querySelector('main');
        
        const mockMessages = [
            { from: 'Sarah Johnson', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=face', message: 'Hey! I saw your profile and I think you\'d be great for our AI project!', time: '2h ago', unread: true },
            { from: 'Michael Park', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=face', message: 'Thanks for connecting! When are you available to chat?', time: '5h ago', unread: false },
            { from: 'Emily Davis', avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face', message: 'I\'d love to discuss the project details with you', time: '1d ago', unread: false }
        ];
        
        let html = `
            <section class="max-w-md mx-auto px-4 py-8">
                <h2 class="text-2xl font-bold text-gray-800 mb-6">Messages</h2>
                <div class="space-y-2">
        `;
        
        mockMessages.forEach(msg => {
            html += `
                <div class="bg-white rounded-xl p-4 shadow-sm flex items-center gap-4 cursor-pointer hover:shadow-md transition ${msg.unread ? 'border-l-4 border-indigo-500' : ''}">
                    <div class="relative">
                        <img src="${msg.avatar}" alt="${msg.from}" class="w-14 h-14 rounded-full object-cover">
                        ${msg.unread ? '<span class="absolute -top-1 -right-1 w-4 h-4 bg-indigo-600 rounded-full border-2 border-white"></span>' : ''}
                    </div>
                    <div class="flex-1 min-w-0">
                        <div class="flex items-center justify-between">
                            <h3 class="font-semibold text-gray-800 ${msg.unread ? '' : 'font-normal'}">${msg.from}</h3>
                            <span class="text-xs text-gray-400">${msg.time}</span>
                        </div>
                        <p class="text-sm text-gray-600 truncate">${msg.message}</p>
                    </div>
                </div>
            `;
        });
        
        html += `
                </div>
                <button onclick="location.reload()" class="mt-6 w-full py-3 bg-gray-100 text-gray-600 font-medium rounded-xl hover:bg-gray-200 transition">
                    Back to Discover
                </button>
            </section>
        `;
        
        main.innerHTML = html;
    },

    formatDate(dateString) {
        const date = new Date(dateString);
        const now = new Date();
        const diff = now - date;
        const minutes = Math.floor(diff / 60000);
        const hours = Math.floor(diff / 3600000);
        const days = Math.floor(diff / 86400000);
        
        if (minutes < 60) return `${minutes}m ago`;
        if (hours < 24) return `${hours}h ago`;
        return `${days}d ago`;
    },

    setupButtonAnimations() {
        // Add ripple effect to buttons
        const buttons = document.querySelectorAll('button');
        
        buttons.forEach(btn => {
            btn.addEventListener('click', function(e) {
                const rect = this.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                
                const ripple = document.createElement('span');
                ripple.style.cssText = `
                    position: absolute;
                    background: rgba(255, 255, 255, 0.3);
                    border-radius: 50%;
                    pointer-events: none;
                    width: 100px;
                    height: 100px;
                    left: ${x - 50}px;
                    top: ${y - 50}px;
                    transform: scale(0);
                    animation: ripple 0.6s linear;
                `;
                
                this.style.position = 'relative';
                this.style.overflow = 'hidden';
                this.appendChild(ripple);
                
                setTimeout(() => ripple.remove(), 600);
            });
        });
        
        // Add ripple keyframes
        const style = document.createElement('style');
        style.textContent = `
            @keyframes ripple {
                to {
                    transform: scale(4);
                    opacity: 0;
                }
            }
        `;
        document.head.appendChild(style);
    }
};

// Initialize app when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    App.init();
});

// Make App available globally
window.App = App;

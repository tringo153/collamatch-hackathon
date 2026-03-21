// Navbar Component

const Navbar = {
    render() {
        const navbar = document.getElementById('navbar');
        
        navbar.innerHTML = `
            <div class="max-w-md mx-auto px-4 h-16 flex items-center justify-between">
                <div class="flex items-center gap-2">
                    <div class="w-10 h-10 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl flex items-center justify-center">
                        <i class="ph ph-handshake text-white text-xl"></i>
                    </div>
                    <span class="text-xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">SynCo</span>
                </div>
                <div class="flex items-center gap-3">
                    <button id="btn-notifications" class="p-2 text-gray-500 hover:text-gray-700 transition relative">
                        <i class="ph ph-bell text-xl"></i>
                        <span class="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
                    </button>
                    <button id="btn-settings" class="p-2 text-gray-500 hover:text-gray-700 transition">
                        <i class="ph ph-gear text-xl"></i>
                    </button>
                    <button id="btn-profile" class="w-9 h-9 rounded-full overflow-hidden border-2 border-gray-200 hover:border-indigo-500 transition">
                        <img src="${AppData.currentUser.photo}" alt="Profile" class="w-full h-full object-cover">
                    </button>
                </div>
            </div>
        `;

        this.attachEventListeners();
    },

    attachEventListeners() {
        // Profile button click
        document.getElementById('btn-profile')?.addEventListener('click', () => {
            App.navigateTo('profile');
        });

        // Notifications button click
        document.getElementById('btn-notifications')?.addEventListener('click', () => {
            this.showNotifications();
        });
    },

    showNotifications() {
        const notifications = [
            { type: 'match', message: 'You matched with Sarah Johnson!', time: '2h ago' },
            { type: 'message', message: 'Michael Park sent you a message', time: '5h ago' },
            { type: 'like', message: 'Emily Davis liked your profile', time: '1d ago' }
        ];

        let html = `
            <div class="modal-overlay" onclick="event.target === this && Modal.close()">
                <div class="modal-content w-96 p-6">
                    <div class="flex items-center justify-between mb-6">
                        <h3 class="text-xl font-bold">Notifications</h3>
                        <button onclick="Modal.close()" class="text-gray-400 hover:text-gray-600">
                            <i class="ph ph-x text-xl"></i>
                        </button>
                    </div>
                    <div class="space-y-4">
        `;

        notifications.forEach(notif => {
            const icon = notif.type === 'match' ? 'ph-heart' : notif.type === 'message' ? 'ph-chat' : 'ph-star';
            const color = notif.type === 'match' ? 'text-red-500' : notif.type === 'message' ? 'text-blue-500' : 'text-yellow-500';
            
            html += `
                <div class="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 cursor-pointer">
                    <div class="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center ${color}">
                        <i class="ph ${icon} text-xl"></i>
                    </div>
                    <div class="flex-1">
                        <p class="text-sm text-gray-800">${notif.message}</p>
                        <p class="text-xs text-gray-500">${notif.time}</p>
                    </div>
                </div>
            `;
        });

        html += `
                    </div>
                </div>
            </div>
        `;

        const container = document.getElementById('modal-container');
        container.innerHTML = html;
    }
};

// Make Navbar available globally
window.Navbar = Navbar;

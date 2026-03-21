// Main Application Entry Point

const App = {
    async init() {
        console.log('CollaMatch - Initializing...');
        
        // Wait for database to be ready
        await new Promise(resolve => {
            const checkDB = setInterval(() => {
                if (Database.db) {
                    clearInterval(checkDB);
                    resolve();
                }
            }, 100);
        });
        
        // Load data from database
        await Database.loadToAppData();
        
        // Initialize components
        Navbar.render();
        Chat.init();
        
        // Show auth screen (login/signup tabs) first
        // After login/signup is complete, it will navigate to browse
        Auth.show();
        
        // Setup bottom navigation
        this.setupNavigation();
        
        // Add animation to buttons
        this.setupButtonAnimations();
        
        console.log('CollaMatch - Ready!');
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
                this.showProfilePage();
                break;
            case 'signup':
                Signup.show();
                break;
        }
    },

    showMatchesPage() {
        const main = document.querySelector('main');
        
        // Get current user ID
        const currentUserId = AppData.currentUser?.id;
        const currentUserIdAlt = AppData.currentUser?.originalId || (currentUserId === 'current' ? 'user-1' : currentUserId);
        
        // Get users who liked current user
        // Check both: 1) collaborators' likesSent (who liked current user), 2) current user's likesReceived
        const usersWhoLikedYou = [];
        const currentUserLikesSent = AppData.currentUser?.likesSent || [];
        const currentUserLikesReceived = AppData.currentUser?.likesReceived || [];
        
        AppData.collaborators.forEach(collab => {
            // Skip if this is the current user
            if (collab.id === currentUserId || collab.id === currentUserIdAlt) {
                return;
            }
            
            let liked = false;
            
            // Check 1: Does this collaborator's likesSent include current user?
            if (collab.likesSent && Array.isArray(collab.likesSent)) {
                liked = collab.likesSent.some(like => 
                    like.targetId === currentUserId || 
                    like.targetId === currentUserIdAlt ||
                    like.targetId === 'current'
                );
            }
            
            // Check 2: Does current user's likesReceived include this collaborator?
            if (!liked && currentUserLikesReceived.length > 0) {
                liked = currentUserLikesReceived.some(like => 
                    like.fromId === collab.id
                );
            }
            
            // Skip if already matched (current user already liked them back)
            if (liked) {
                const alreadyMatched = currentUserLikesSent.some(like => 
                    like.targetId === collab.id || 
                    like.targetId === collab.originalId
                );
                
                if (!alreadyMatched) {
                    usersWhoLikedYou.push({
                        id: collab.id,
                        name: collab.name,
                        photo: collab.photo,
                        bio: collab.bio,
                        skills: collab.skills,
                        location: collab.location
                    });
                }
            }
        });
        
        // Get current user's projects
        const myProjects = AppData.projects.filter(p => 
            p.owner && (p.owner.id === currentUserId || p.owner.id === currentUserIdAlt)
        );
        
        // Get users interested in my projects (who haven't been matched yet)
        const interestedInMyProjects = [];
        myProjects.forEach(project => {
            AppData.collaborators.forEach(collab => {
                if (collab.interestedProjects && collab.interestedProjects.includes(project.id)) {
                    // Check if already matched
                    const currentUserLikes = AppData.currentUser?.likesSent || [];
                    const alreadyMatched = currentUserLikes.some(like => 
                        like.targetId === collab.id
                    );
                    
                    if (!alreadyMatched) {
                        interestedInMyProjects.push({
                            user: {
                                id: collab.id,
                                name: collab.name,
                                photo: collab.photo,
                                bio: collab.bio
                            },
                            project: {
                                id: project.id,
                                title: project.title
                            }
                        });
                    }
                }
            });
        });
        
        // Render page with tabs
        let html = `
            <section class="fixed inset-0 top-16 bottom-20 overflow-y-auto px-4 py-6">
                <h2 class="text-2xl font-bold text-gray-800 mb-4 max-w-md mx-auto">Your Matches</h2>
                
                <!-- Tabs -->
                <div class="flex items-center justify-center gap-2 mb-4 p-1 bg-gray-100 rounded-xl max-w-md mx-auto">
                    <button class="match-tab flex-1 px-4 py-2 rounded-lg text-sm font-medium transition bg-white text-indigo-600 shadow-sm" data-tab="people" onclick="App.switchMatchTab('people')">
                        <i class="ph ph-users mr-1"></i> People Who Liked You (${usersWhoLikedYou.length})
                    </button>
                    <button class="match-tab flex-1 px-4 py-2 rounded-lg text-sm font-medium transition text-gray-500" data-tab="projects" onclick="App.switchMatchTab('projects')">
                        <i class="ph ph-rocket-launch mr-1"></i> Your Projects (${interestedInMyProjects.length})
                    </button>
                </div>
                
                <!-- People Who Liked You -->
                <div id="match-people" class="match-content space-y-4 max-w-md mx-auto">
        `;
        
        if (usersWhoLikedYou.length === 0) {
            html += `
                <div class="text-center py-12">
                    <i class="ph ph-heart text-5xl text-gray-300 mb-4"></i>
                    <h3 class="text-lg font-semibold text-gray-600 mb-2">No Likes Yet</h3>
                    <p class="text-gray-400">Start swiping to get noticed!</p>
                </div>
            `;
        } else {
            usersWhoLikedYou.forEach(user => {
                html += `
                    <div class="bg-white rounded-xl p-4 shadow-sm">
                        <div class="flex items-center gap-4">
                            <img src="${user.photo}" alt="${user.name}" class="w-16 h-16 rounded-full object-cover">
                            <div class="flex-1">
                                <h3 class="font-semibold text-gray-800">${user.name}</h3>
                                <p class="text-sm text-gray-600">${user.location || ''}</p>
                                <p class="text-xs text-indigo-600">Liked your profile</p>
                            </div>
                        </div>
                        <div class="mt-3 flex gap-2">
                            <button onclick="App.likeBack('${user.id}', 'user')" class="flex-1 py-2 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition">
                                <i class="ph ph-heart mr-1"></i> Like Back
                            </button>
                            <button onclick="Modal.showUserDetailModal(AppData.collaborators.find(u => u.id === '${user.id}'))" class="px-4 py-2 border border-gray-300 rounded-lg text-gray-600 hover:bg-gray-50 transition">
                                <i class="ph ph-eye"></i>
                            </button>
                        </div>
                    </div>
                `;
            });
        }
        
        html += `
                </div>
                
                <!-- Projects Interested -->
                <div id="match-projects" class="match-content space-y-4 max-w-md mx-auto hidden">
        `;
        
        if (interestedInMyProjects.length === 0) {
            html += `
                <div class="text-center py-12">
                    <i class="ph ph-rocket-launch text-5xl text-gray-300 mb-4"></i>
                    <h3 class="text-lg font-semibold text-gray-600 mb-2">No Interest Yet</h3>
                    <p class="text-gray-400">Create projects to attract collaborators!</p>
                </div>
            `;
        } else {
            interestedInMyProjects.forEach(item => {
                html += `
                    <div class="bg-white rounded-xl p-4 shadow-sm">
                        <div class="flex items-center gap-4">
                            <img src="${item.user.photo}" alt="${item.user.name}" class="w-12 h-12 rounded-full object-cover">
                            <div class="flex-1">
                                <h3 class="font-semibold text-gray-800">${item.user.name}</h3>
                                <p class="text-sm text-gray-600">Interested in: ${item.project.title}</p>
                            </div>
                        </div>
                        <div class="mt-3 flex gap-2">
                            <button onclick="App.likeBack('${item.user.id}', 'user', '${item.project.id}')" class="flex-1 py-2 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition">
                                <i class="ph ph-heart mr-1"></i> Like Back
                            </button>
                        </div>
                    </div>
                `;
            });
        }
        
        html += `
                </div>
            </section>
        `;
        
        main.innerHTML = html;
    },
    
    // Handle like back from matches page
    async likeBack(targetId, type, projectId = null) {
        const currentUserId = AppData.currentUser?.id;
        const currentUserIdAlt = AppData.currentUser?.originalId || 'user-1';
        
        // Get project if provided
        const project = projectId ? AppData.projects.find(p => p.id === projectId) : null;
        
        // Add like to current user
        if (!AppData.currentUser.likesSent) {
            AppData.currentUser.likesSent = [];
        }
        
        AppData.currentUser.likesSent.push({
            targetId: targetId,
            targetType: type,
            projectId: projectId,
            timestamp: new Date().toISOString()
        });
        
        // Save to database
        await Database.saveCurrentUser(AppData.currentUser);
        
        // Check if target already liked us (create match)
        const targetUser = AppData.collaborators.find(u => u.id === targetId);
        let isMatch = false;
        
        if (targetUser && targetUser.likesSent) {
            const likedUsBack = targetUser.likesSent.some(like => 
                like.targetId === currentUserId || 
                like.targetId === currentUserIdAlt ||
                like.targetId === 'current'
            );
            
            if (likedUsBack) {
                isMatch = true;
                
                // Create match
                const matchId = `match-${Date.now()}`;
                const match = {
                    id: matchId,
                    users: [currentUserIdAlt, targetId],
                    projectId: projectId,
                    createdAt: new Date().toISOString(),
                    lastActivity: new Date().toISOString()
                };
                
                await Database.add('matches', match);
                
                // Create initial chat
                const chat = {
                    id: matchId,
                    matchId: matchId,
                    participants: [currentUserIdAlt, targetId],
                    messages: [{
                        id: `msg-${Date.now()}`,
                        senderId: 'system',
                        content: `You matched with ${targetUser.name}! Start a conversation within 24 hours.`,
                        timestamp: new Date().toISOString()
                    }],
                    createdAt: new Date().toISOString(),
                    expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString()
                };
                
                await Database.add('chats', chat);
                
                // Navigate to chat
                App.showChatsPage();
                return;
            }
        }
        
        if (!isMatch) {
            alert('Like sent! If they like you back, it will be a match.');
            // Refresh the matches page
            App.showMatchesPage();
        }
    },
    
    switchMatchTab(tab) {
        document.querySelectorAll('.match-tab').forEach(btn => {
            if (btn.dataset.tab === tab) {
                btn.classList.add('bg-white', 'text-indigo-600', 'shadow-sm');
                btn.classList.remove('text-gray-500');
            } else {
                btn.classList.remove('bg-white', 'text-indigo-600', 'shadow-sm');
                btn.classList.add('text-gray-500');
            }
        });
        
        document.querySelectorAll('.match-content').forEach(div => {
            div.classList.add('hidden');
        });
        
        document.getElementById(`match-${tab}`).classList.remove('hidden');
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

    showProfilePage() {
        const main = document.querySelector('main');
        const user = AppData.currentUser;
        
        // Get user's owned projects
        const userProjects = AppData.projects.filter(p => user.ownedProjects && user.ownedProjects.includes(p.id));
        const interestedCount = user.interestedProjects ? user.interestedProjects.length : 0;
        
        const skillsHTML = user.skills.map(skill => `
            <div class="flex items-center gap-2 mb-1">
                <span class="text-xs text-gray-600 w-20 truncate">${skill.name}</span>
                <div class="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div class="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full" style="width: ${skill.level}%"></div>
                </div>
                <span class="text-xs text-gray-400 w-8">${skill.level}%</span>
            </div>
        `).join('');

        const goalsHTML = user.goals.map(goal => 
            `<span class="skill-tag bg-indigo-50 text-indigo-700">${goal}</span>`
        ).join('');

        const workStyleHTML = user.workStyle.map(style => 
            `<span class="px-2 py-1 bg-green-50 text-green-700 rounded-full text-xs font-medium">${style}</span>`
        ).join('');

        // Private document section
        const privateDocHTML = user.privateDocument ? `
            <div class="mb-4">
                <div class="flex items-center justify-between mb-2">
                    <h3 class="font-semibold text-gray-800">
                        <i class="ph ph-lock mr-1"></i> Private Document
                    </h3>
                    <span class="text-xs text-green-600"><i class="ph ph-check-circle"></i> Your document</span>
                </div>
                <div class="bg-gray-50 rounded-xl p-4">
                    <h5 class="font-medium text-gray-800 mb-1">${user.privateDocument.title || 'Private Document'}</h5>
                    <p class="text-sm text-gray-600 line-clamp-2">${user.privateDocument.content || 'No content yet'}</p>
                </div>
            </div>
        ` : '';

        // Projects list HTML
        const projectsListHTML = userProjects.length > 0 ? `
            <div class="mb-4">
                <div class="flex items-center justify-between mb-2">
                    <h3 class="font-semibold text-gray-800">
                        <i class="ph ph-folder mr-1"></i> Your Projects (${userProjects.length})
                    </h3>
                    <button onclick="Modal.showCreateProjectModal()" class="px-3 py-1 bg-green-600 text-white text-xs font-medium rounded-lg hover:bg-green-700 transition">
                        <i class="ph ph-plus mr-1"></i> New Project
                    </button>
                </div>
                <div class="space-y-2">
                    ${userProjects.map(project => `
                        <div class="bg-green-50 rounded-lg p-3 cursor-pointer hover:bg-green-100 transition" onclick="Modal.showProjectDetailModal(AppData.projects.find(p => p.id === '${project.id}'))">
                            <div class="flex items-center gap-3">
                                <div class="w-8 h-8 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg flex items-center justify-center">
                                    <i class="ph ph-rocket-launch text-white"></i>
                                </div>
                                <div class="flex-1">
                                    <h5 class="font-medium text-gray-800 text-sm">${project.title}</h5>
                                    <p class="text-xs text-gray-500">${project.distance}</p>
                                </div>
                                <i class="ph ph-arrow-right text-gray-400"></i>
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>
        ` : `
            <div class="mb-4">
                <div class="flex items-center justify-between mb-2">
                    <h3 class="font-semibold text-gray-800">
                        <i class="ph ph-folder mr-1"></i> Your Projects
                    </h3>
                    <button onclick="Modal.showCreateProjectModal()" class="px-3 py-1 bg-green-600 text-white text-xs font-medium rounded-lg hover:bg-green-700 transition">
                        <i class="ph ph-plus mr-1"></i> New Project
                    </button>
                </div>
                <div class="text-center py-6 bg-gray-50 rounded-lg">
                    <i class="ph ph-folder-open text-3xl text-gray-300 mb-2"></i>
                    <p class="text-sm text-gray-500">No projects yet</p>
                    <p class="text-xs text-gray-400">Create your first project to get started!</p>
                </div>
            </div>
        `;

        main.innerHTML = `
            <section class="fixed inset-0 top-16 bottom-20 overflow-y-auto px-4 py-6">
                <div class="max-w-md mx-auto">
                    <div class="relative mb-16">
                        <div class="w-full h-32 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl"></div>
                        <div class="absolute -bottom-12 left-1/2 transform -translate-x-1/2">
                            <img src="${user.photo}" alt="${user.name}" class="w-24 h-24 rounded-full border-4 border-white shadow-md">
                        </div>
                    </div>
                    
                    <div class="pt-14">
                        <div class="flex items-start justify-between mb-4">
                            <div class="flex-1 text-center">
                                <h2 class="text-2xl font-bold text-gray-800">${user.name}</h2>
                            </div>
                            <button onclick="Signup.show()" class="px-4 py-2 bg-indigo-600 text-white text-sm rounded-lg hover:bg-indigo-700 transition">
                                <i class="ph ph-pencil"></i> Edit
                            </button>
                        </div>
                        
                        <!-- Location -->
                        <div class="flex items-center justify-center gap-2 text-sm text-gray-600 mb-4">
                            <i class="ph ph-map-pin"></i>
                            <span>${user.location}</span>
                            <span class="text-xs bg-gray-100 px-2 py-0.5 rounded-full">${user.distance}</span>
                        </div>
                        
                        <!-- Work Style -->
                        <div class="flex flex-wrap justify-center gap-2 mb-4">
                            ${workStyleHTML}
                            <span class="px-2 py-1 bg-blue-50 text-blue-700 rounded-full text-xs font-medium">
                                <i class="ph ph-clock mr-1"></i>${user.availability}
                            </span>
                        </div>
                        
                        <p class="text-gray-600 mb-4 text-center">${user.bio}</p>
                        
                        <div class="mb-4">
                            <h3 class="font-semibold text-gray-800 mb-2 text-center">Goals</h3>
                            <div class="flex flex-wrap justify-center gap-2">
                                ${goalsHTML}
                            </div>
                        </div>
                        
                        <div class="mb-4">
                            <h3 class="font-semibold text-gray-800 mb-2">Skills</h3>
                            ${skillsHTML}
                        </div>
                        
                        <div class="mb-4">
                            <h3 class="font-semibold text-gray-800 mb-2 text-center">Looking For</h3>
                            <div class="flex justify-center gap-2">
                                ${user.lookingFor.map(item => 
                                    `<span class="px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full text-sm">${item}</span>`
                                ).join('')}
                            </div>
                        </div>
                        
                        <!-- Private Document -->
                        ${privateDocHTML}
                        
                        <!-- Projects List -->
                        ${projectsListHTML}
                        
                        <div class="border-t pt-4">
                            <h3 class="font-semibold text-gray-800 mb-3 text-center">Stats</h3>
                            <div class="grid grid-cols-4 gap-2 text-center">
                                <div class="p-3 bg-gray-50 rounded-lg">
                                    <div class="text-xl font-bold text-indigo-600">${AppData.matches.length}</div>
                                    <div class="text-xs text-gray-500">Matches</div>
                                </div>
                                <div class="p-3 bg-gray-50 rounded-lg">
                                    <div class="text-xl font-bold text-indigo-600">${AppData.swiped.users.length}</div>
                                    <div class="text-xs text-gray-500">Viewed</div>
                                </div>
                                <div class="p-3 bg-gray-50 rounded-lg">
                                    <div class="text-xl font-bold text-green-600">${userProjects.length}</div>
                                    <div class="text-xs text-gray-500">Projects</div>
                                </div>
                                <div class="p-3 bg-gray-50 rounded-lg">
                                    <div class="text-xl font-bold text-pink-600">${interestedCount}</div>
                                    <div class="text-xs text-gray-500">Interested</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        `;
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

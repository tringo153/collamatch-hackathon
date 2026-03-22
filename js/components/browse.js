// Browse Component - Users and Projects sorted by distance with tabs

const Browse = {
    activeTab: 'users', // 'users' or 'projects'
    users: [],
    projects: [],
    
    init() {
        // Load and sort data by distance
        this.loadData();
        this.render();
    },
    
    loadData() {
        // Get current user ID (could be 'current' or actual user ID)
        const currentUserId = AppData.currentUser?.id;
        const currentUserIdAlt = AppData.currentUser?.originalId || (currentUserId === 'current' ? 'user-1' : currentUserId);
        
        // Get liked user IDs
        const likedUserIds = new Set();
        if (AppData.currentUser && AppData.currentUser.likesSent) {
            AppData.currentUser.likesSent.forEach(like => {
                if (like.targetType === 'user') {
                    likedUserIds.add(like.targetId);
                }
            });
        }
        
        // Get liked project IDs
        const likedProjectIds = new Set();
        if (AppData.currentUser && AppData.currentUser.likesSent) {
            AppData.currentUser.likesSent.forEach(like => {
                if (like.targetType === 'project') {
                    likedProjectIds.add(like.targetId);
                }
            });
        }
        
        // Get all collaborators, filter out already liked AND own profile, and sort by distance
        this.users = [...AppData.collaborators]
            .filter(u => {
                // Filter out self
                if (u.id === currentUserId || u.id === currentUserIdAlt) return false;
                // Filter out already liked
                if (likedUserIds.has(u.id)) return false;
                return true;
            })
            .sort((a, b) => {
                const distA = a.distanceValue || parseFloat(a.distance) || 999;
                const distB = b.distanceValue || parseFloat(b.distance) || 999;
                return distA - distB;
            });
        
        // Get all projects, filter out already liked AND own projects, and sort by distance
        const userOwnedProjects = AppData.currentUser?.ownedProjects || [];
        this.projects = [...AppData.projects]
            .filter(p => {
                // Filter out own projects (check owner ID, originalId, and ownedProjects array)
                if (p.owner && (p.owner.id === currentUserId || p.owner.id === currentUserIdAlt)) return false;
                if (userOwnedProjects.includes(p.id)) return false;
                // Filter out already liked
                if (likedProjectIds.has(p.id)) return false;
                return true;
            })
            .sort((a, b) => {
                const distA = a.distanceValue || parseFloat(a.distance) || 999;
                const distB = b.distanceValue || parseFloat(b.distance) || 999;
                return distA - distB;
            });
    },
    
    render() {
        const main = document.querySelector('main');
        main.className = 'pt-20 pb-24';
        
        const data = this.activeTab === 'users' ? this.users : this.projects;
        
        main.innerHTML = `
            <section class="min-h-screen px-4 py-6">
                <div class="max-w-lg mx-auto">
                    <!-- Header -->
                    <div class="text-center mb-6">
                        <h2 class="text-2xl font-bold text-gray-800">Discover</h2>
                        <p class="text-gray-500 text-sm">Sorted by shortest distance</p>
                    </div>
                    
                    <!-- Tabs -->
                    <div class="sticky top-16 z-10 bg-gray-50 -mx-4 px-4 py-3 mb-4">
                        <div class="flex items-center justify-center gap-2 p-1 bg-gray-100 rounded-xl max-w-lg mx-auto">
                            <button class="browse-tab flex-1 px-4 py-2 rounded-lg text-sm font-medium transition ${this.activeTab === 'users' ? 'bg-white text-indigo-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}" data-tab="users">
                                <i class="ph ph-users mr-1"></i> People
                            </button>
                            <button class="browse-tab flex-1 px-4 py-2 rounded-lg text-sm font-medium transition ${this.activeTab === 'projects' ? 'bg-white text-green-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}" data-tab="projects">
                                <i class="ph ph-rocket-launch mr-1"></i> Projects
                            </button>
                        </div>
                    </div>
                    
                    <!-- Cards List -->
                    <div id="browse-cards" class="space-y-4">
                        ${this.renderCards(data)}
                    </div>
                </div>
            </section>
        `;
        
        this.setupEventListeners();
    },
    
    renderCards(data) {
        if (data.length === 0) {
            return `
                <div class="text-center py-12">
                    <i class="ph ph-empty text-5xl text-gray-300 mb-4"></i>
                    <h3 class="text-lg font-semibold text-gray-600 mb-2">No ${this.activeTab} found</h3>
                    <p class="text-gray-400">Check back later for new matches!</p>
                </div>
            `;
        }
        
        return data.map((item, index) => {
            if (this.activeTab === 'users') {
                return this.renderUserCard(item, index);
            } else {
                return this.renderProjectCard(item, index);
            }
        }).join('');
    },
    
    renderUserCard(user, index) {
        // Get user's owned projects
        const userProjects = AppData.projects.filter(p => user.ownedProjects && user.ownedProjects.includes(p.id));
        const interestedCount = user.interestedProjects ? user.interestedProjects.length : 0;
        
        // Check if already swiped
        const isSwiped = AppData.swiped.users.includes(user.id);
        
        return `
            <div class="browse-card bg-white rounded-xl shadow-sm overflow-hidden cursor-pointer hover:shadow-md transition ${isSwiped ? 'opacity-50' : ''}" data-id="${user.id}" data-type="user">
                <!-- Photo & Distance Badge -->
                <div class="relative">
                    <img src="${user.photo || 'https://ui-avatars.com/api/?name=' + encodeURIComponent(user.name || 'U') + '&background=6366f1&color=fff&size=400&font-size=0.4&length=1'}" alt="${user.name}" class="w-full h-40 object-cover">
                    <div class="absolute top-3 right-3">
                        <span class="px-2 py-1 bg-black/50 text-white text-xs rounded-full flex items-center gap-1">
                            <i class="ph ph-map-pin"></i> ${user.distance}
                        </span>
                    </div>
                    <div class="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-black/50 to-transparent"></div>
                </div>
                
                <!-- Content -->
                <div class="p-4">
                    <!-- Name & Location -->
                    <div class="flex items-start justify-between mb-2">
                        <div>
                            <h3 class="text-lg font-bold text-gray-800">${user.name}</h3>
                            <p class="text-sm text-gray-500 flex items-center gap-1">
                                <i class="ph ph-map-pin"></i> ${user.location}
                            </p>
                        </div>
                    </div>
                    
                    <!-- Work Style & Availability -->
                    <div class="flex flex-wrap gap-1 mb-3">
                        ${user.workStyle.slice(0, 2).map(style => `
                            <span class="px-2 py-0.5 bg-green-50 text-green-700 rounded-full text-xs font-medium">${style}</span>
                        `).join('')}
                        <span class="px-2 py-0.5 bg-blue-50 text-blue-700 rounded-full text-xs font-medium">
                            <i class="ph ph-clock"></i> ${user.availability}
                        </span>
                    </div>
                    
                    <!-- Bio -->
                    <p class="text-sm text-gray-600 mb-3 line-clamp-2">${user.bio}</p>
                    
                    <!-- Goals -->
                    <div class="mb-3">
                        <div class="flex flex-wrap gap-1">
                            ${user.goals.slice(0, 3).map(goal => `
                                <span class="px-2 py-0.5 bg-indigo-50 text-indigo-700 rounded-full text-xs">${goal}</span>
                            `).join('')}
                        </div>
                    </div>
                    
                    <!-- View Details Button -->
                    <div class="pt-2 border-t border-gray-100">
                        <button class="w-full text-indigo-600 text-sm font-medium hover:text-indigo-700 flex items-center justify-center gap-1">
                            View Details <i class="ph ph-arrow-right"></i>
                        </button>
                    </div>
                </div>
            </div>
        `;
    },
    
    renderProjectCard(project, index) {
        // Check if already swiped
        const isSwiped = AppData.swiped.projects.includes(project.id);
        
        return `
            <div class="browse-card bg-white rounded-xl shadow-sm overflow-hidden cursor-pointer hover:shadow-md transition ${isSwiped ? 'opacity-50' : ''}" data-id="${project.id}" data-type="project">
                <!-- Project Header -->
                <div class="relative bg-gradient-to-r from-green-500 to-emerald-500 h-24 flex items-center justify-center">
                    <i class="ph ph-rocket-launch text-4xl text-white/50"></i>
                    <div class="absolute top-3 right-3">
                        <span class="px-2 py-1 bg-black/50 text-white text-xs rounded-full flex items-center gap-1">
                            <i class="ph ph-map-pin"></i> ${project.distance}
                        </span>
                    </div>
                    <div class="absolute bottom-3 left-4">
                        <span class="px-2 py-1 bg-white/20 text-white text-xs rounded-full">PROJECT</span>
                    </div>
                </div>
                
                <!-- Content -->
                <div class="p-4">
                    <!-- Title & Owner -->
                    <div class="mb-2">
                        <h3 class="text-lg font-bold text-gray-800">${project.title}</h3>
                        <div class="flex items-center gap-2 mt-1">
                            <img src="${project.owner.photo || 'https://ui-avatars.com/api/?name=' + encodeURIComponent(project.owner.name || 'U') + '&background=6366f1&color=fff&size=64&font-size=0.4&length=1'}" alt="${project.owner.name}" class="w-5 h-5 rounded-full">
                            <span class="text-sm text-gray-600">${project.owner.name}</span>
                        </div>
                    </div>
                    
                    <!-- Description -->
                    <p class="text-sm text-gray-600 mb-3 line-clamp-2">${project.description}</p>
                    
                    <!-- Goals -->
                    <div class="mb-3">
                        <div class="flex flex-wrap gap-1">
                            ${project.goals.slice(0, 3).map(goal => `
                                <span class="px-2 py-0.5 bg-green-50 text-green-700 rounded-full text-xs">${goal}</span>
                            `).join('')}
                        </div>
                    </div>
                    
                    <!-- Work Style -->
                    <div class="flex flex-wrap gap-1 mb-3">
                        ${project.workStyle.slice(0, 2).map(style => `
                            <span class="px-2 py-0.5 bg-purple-50 text-purple-700 rounded-full text-xs font-medium">${style}</span>
                        `).join('')}
                        ${project.teamNeeds.slice(0, 2).map(need => `
                            <span class="px-2 py-0.5 bg-orange-50 text-orange-700 rounded-full text-xs font-medium">${need}</span>
                        `).join('')}
                    </div>
                    
                    <!-- View Details Button -->
                    <div class="pt-2 border-t border-gray-100">
                        <button class="w-full text-green-600 text-sm font-medium hover:text-green-700 flex items-center justify-center gap-1">
                            View Details <i class="ph ph-arrow-right"></i>
                        </button>
                    </div>
                </div>
            </div>
        `;
    },
    
    setupEventListeners() {
        // Tab switching
        document.querySelectorAll('.browse-tab').forEach(tab => {
            tab.addEventListener('click', () => {
                this.activeTab = tab.dataset.tab;
                this.render();
            });
        });
        
        // Card clicking - open modal
        document.querySelectorAll('.browse-card').forEach(card => {
            card.addEventListener('click', () => {
                const id = card.dataset.id;
                const type = card.dataset.type;
                
                if (type === 'user') {
                    const user = this.users.find(u => u.id === id) || AppData.collaborators.find(u => u.id === id);
                    if (user) {
                        Modal.showUserDetailModal(user);
                    }
                } else {
                    const project = this.projects.find(p => p.id === id) || AppData.projects.find(p => p.id === id);
                    if (project) {
                        Modal.showProjectDetailModal(project);
                    }
                }
            });
        });
    },
    
    refresh() {
        this.loadData();
        this.render();
    },
    
    handleAction(id, type, action) {
        console.log(`${action} ${type} ${id}`);
        
        // Initialize arrays if needed
        if (!AppData.currentUser.likesSent) AppData.currentUser.likesSent = [];
        
        // Prevent self-like
        const currentUserId = AppData.currentUser.id;
        const currentUserIdAlt = AppData.currentUser?.originalId || (currentUserId === 'current' ? 'user-1' : currentUserId);
        
        if (action === 'like') {
            // Check if trying to like self
            if (type === 'user' && (id === currentUserId || id === currentUserIdAlt)) {
                alert('You cannot like your own profile!');
                return;
            }
            // Check if trying to like own project
            if (type === 'project') {
                const project = AppData.projects.find(p => p.id === id);
                if (project && project.owner && (project.owner.id === currentUserId || project.owner.id === currentUserIdAlt)) {
                    alert('You cannot like your own project!');
                    return;
                }
            }
        }
        
        if (action === 'pass') {
            // Add to swiped list
            if (type === 'user') {
                if (!AppData.swiped.users.includes(id)) {
                    AppData.swiped.users.push(id);
                }
            } else {
                if (!AppData.swiped.projects.includes(id)) {
                    AppData.swiped.projects.push(id);
                }
            }
            // Refresh browse to show updated state
            this.render();
        } else if (action === 'like') {
            // Check if already liked
            const alreadyLiked = AppData.currentUser.likesSent.some(l => l.targetId === id);
            if (alreadyLiked) {
                alert('You already liked this!');
                return;
            }
            
            // If liking a user, check if we have projects to match
            if (type === 'user') {
                const user = AppData.collaborators.find(u => u.id === id);
                if (user) {
                    // Get user's projects (check owner ID, originalId, and ownedProjects array)
                    const currentUserId = AppData.currentUser.id;
                    const currentUserIdAlt = AppData.currentUser.originalId || (currentUserId === 'current' ? 'user-1' : currentUserId);
                    const userOwnedProjects = AppData.currentUser.ownedProjects || [];
                    
                    const userProjects = AppData.projects.filter(p => 
                        p.owner && (p.owner.id === currentUserId || p.owner.id === currentUserIdAlt || userOwnedProjects.includes(p.id))
                    );
                    
                    if (userProjects.length > 0) {
                        // Show project selection modal
                        Modal.showProjectMatchModal(user, userProjects);
                        return;
                    }
                }
            }
            
            // Process the like without project selection
            this.processLike(id, type);
        }
    },
    
    async processLike(id, type, selectedProject = null) {
        // Add to likes sent
        AppData.currentUser.likesSent.push({
            targetId: id,
            targetType: type,
            projectId: selectedProject ? selectedProject.id : null,
            timestamp: new Date().toISOString()
        });
        
        const currentUserActualId = AppData.currentUser.originalId || (AppData.currentUser.id === 'current' ? 'user-1' : AppData.currentUser.id);
        
        // If liking a project, add to current user's interestedProjects AND update project owner
        if (type === 'project') {
            const project = AppData.projects.find(p => p.id === id);
            if (project) {
                // Add to current user's interestedProjects
                if (!AppData.currentUser.interestedProjects) {
                    AppData.currentUser.interestedProjects = [];
                }
                if (!AppData.currentUser.interestedProjects.includes(project.id)) {
                    AppData.currentUser.interestedProjects.push(project.id);
                }
                
                // Also add to the project owner's likesReceived so they see us in their People tab
                const projectOwner = AppData.collaborators.find(u => u.id === project.owner.id);
                if (projectOwner) {
                    if (!projectOwner.likesReceived) {
                        projectOwner.likesReceived = [];
                    }
                    // Check if already exists
                    const existingIndex = projectOwner.likesReceived.findIndex(l => l.fromId === currentUserActualId);
                    if (existingIndex === -1) {
                        projectOwner.likesReceived.push({
                            fromId: currentUserActualId,
                            fromType: 'project',
                            projectId: project.id,
                            timestamp: new Date().toISOString()
                        });
                        // Update in database
                        await Database.saveCollaborator(projectOwner);
                    }
                }
            }
        }
        
        // Update target user based on whether a project was selected
        if (type === 'user') {
            const targetUser = AppData.collaborators.find(u => u.id === id);
            if (targetUser) {
                if (selectedProject) {
                    // If project selected - add to current user's interestedProjects (we're interested in their project)
                    if (!AppData.currentUser.interestedProjects) {
                        AppData.currentUser.interestedProjects = [];
                    }
                    if (!AppData.currentUser.interestedProjects.includes(selectedProject.id)) {
                        AppData.currentUser.interestedProjects.push(selectedProject.id);
                    }
                } else {
                    // No project - add to target user's likesReceived (people-based match)
                    if (!targetUser.likesReceived) {
                        targetUser.likesReceived = [];
                    }
                    targetUser.likesReceived.push({
                        fromId: currentUserActualId,
                        fromType: 'user',
                        timestamp: new Date().toISOString()
                    });
                    // Update in database
                    await Database.saveCollaborator(targetUser);
                }
            }
        }
        
        // Save to database
        await Database.saveCurrentUser(AppData.currentUser);
        
        // Check for match - check if the other person already liked us back
        let isMatch = false;
        
        if (type === 'user') {
            // Find the user
            const user = AppData.collaborators.find(u => u.id === id);
            if (user && user.likesSent) {
                // Check if this user has liked us back
                const likedUsBack = user.likesSent.some(like => 
                    like.targetId === 'current' || 
                    like.targetId === AppData.currentUser.id
                );
                if (likedUsBack) {
                    isMatch = true;
                }
            }
        } else if (type === 'project') {
            // Check if project owner already liked us back
            const project = AppData.projects.find(p => p.id === id);
            if (project && project.owner) {
                // Find the owner in collaborators
                const owner = AppData.collaborators.find(u => u.id === project.owner.id);
                if (owner && owner.likesSent) {
                    const likedUsBack = owner.likesSent.some(like => 
                        like.targetId === 'current' ||
                        like.targetId === AppData.currentUser.id
                    );
                    if (likedUsBack) {
                        isMatch = true;
                    }
                }
            }
        }
        
        if (isMatch) {
            this.createMatch(id, type, selectedProject);
        } else {
            // Show "sent" feedback
            alert('Like sent! If they like you back, it will be a match!');
            this.render();
        }
    },
    
    calculateMatchScore(project, user) {
        let score = 0;
        
        // Match goals (higher weight)
        if (project.goals && user.goals) {
            const matchingGoals = project.goals.filter(g => user.goals.includes(g));
            score += matchingGoals.length * 3;
        }
        
        // Match skills (highest weight)
        if (project.skills && user.skills) {
            const projectSkillNames = project.skills.map(s => s.name.toLowerCase());
            const userSkillNames = user.skills.map(s => s.name.toLowerCase());
            const matchingSkills = projectSkillNames.filter(s => userSkillNames.includes(s));
            score += matchingSkills.length * 5;
        }
        
        // Match work style
        if (project.workStyle && user.workStyle) {
            const matchingStyles = project.workStyle.filter(s => user.workStyle.includes(s));
            score += matchingStyles.length * 2;
        }
        
        return score;
    },
    
    showProjectMatchModal(user, userProjects) {
        // Calculate match scores for each project
        const projectsWithScore = userProjects.map(project => {
            return {
                project: project,
                score: this.calculateMatchScore(project, user)
            };
        });
        
        // Sort by score (highest first)
        projectsWithScore.sort((a, b) => b.score - a.score);
        
        const main = document.querySelector('main');
        
        let projectsHTML = projectsWithScore.map(({project, score}) => {
            const matchPercentage = Math.min(100, score * 10);
            const isHighMatch = score >= 5;
            
            return `
                <div onclick="Browse.selectProjectForMatch('${user.id}', '${project.id}')" class="bg-white rounded-xl p-4 shadow-sm cursor-pointer hover:shadow-md transition ${isHighMatch ? 'border-2 border-green-500' : ''}">
                    <div class="flex items-center justify-between mb-2">
                        <h3 class="font-semibold text-gray-800">${project.title}</h3>
                        ${isHighMatch ? '<span class="px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full">Best Match!</span>' : ''}
                    </div>
                    <p class="text-sm text-gray-600 line-clamp-2 mb-2">${project.description || 'No description'}</p>
                    <div class="flex items-center justify-between">
                        <div class="flex gap-1">
                            ${(project.workStyle || []).slice(0, 2).map(style => 
                                `<span class="px-2 py-0.5 bg-purple-50 text-purple-700 rounded-full text-xs">${style}</span>`
                            ).join('')}
                        </div>
                        <div class="flex items-center gap-1">
                            <div class="w-16 h-2 bg-gray-200 rounded-full overflow-hidden">
                                <div class="h-full bg-green-500 rounded-full" style="width: ${matchPercentage}%"></div>
                            </div>
                            <span class="text-xs text-gray-500">${score} match</span>
                        </div>
                    </div>
                </div>
            `;
        }).join('');
        
        main.innerHTML = `
            <section class="fixed inset-0 top-16 bottom-20 overflow-y-auto px-4 py-6">
                <div class="max-w-md mx-auto">
                    <button onclick="Browse.render()" class="mb-4 text-gray-500 hover:text-gray-700 flex items-center gap-1">
                        <i class="ph ph-arrow-left"></i> Back
                    </button>
                    
                    <div class="text-center mb-6">
                        <div class="w-16 h-16 mx-auto mb-3 rounded-full overflow-hidden">
                            <img src="${user.photo || 'https://ui-avatars.com/api/?name=' + encodeURIComponent(user.name || 'U') + '&background=6366f1&color=fff&size=128&font-size=0.4&length=1'}" alt="${user.name}" class="w-full h-full object-cover">
                        </div>
                        <h2 class="text-xl font-bold text-gray-800">Match ${user.name} with a Project</h2>
                        <p class="text-gray-500 text-sm">Select which of your projects matches best with this person</p>
                    </div>
                    
                    <div class="space-y-3 mb-4">
                        ${projectsHTML}
                    </div>
                    
                    <button onclick="Browse.processLike('${user.id}', 'user', null)" class="w-full py-3 border-2 border-gray-300 text-gray-600 font-semibold rounded-xl hover:bg-gray-50 transition">
                        Skip - Like without a Project
                    </button>
                </div>
            </section>
        `;
    },
    
    selectProjectForMatch(userId, projectId) {
        // Close the project match modal first
        Modal.closeProjectMatch();
        // Then process the like
        const project = AppData.projects.find(p => p.id === projectId);
        this.processLike(userId, 'user', project);
    },
    
    async createMatch(id, type, selectedProject = null) {
        // Create a match
        let matchData;
        
        if (type === 'user') {
            const user = AppData.collaborators.find(u => u.id === id);
            if (!user) return;
            
            // Create match
            const match = {
                id: 'match-' + Date.now(),
                user: user,
                project: selectedProject,
                matchedAt: new Date().toISOString()
            };
            
            // Add to matches
            AppData.matches.push(match);
            
            // Save to database
            await Database.addMatch(match);
            
            // Build message based on whether project was selected
            const projectMessage = selectedProject 
                ? { id: 'm2', from: 'system', text: '📝 You matched for project: "' + selectedProject.title + '"', time: 'Just now', isSystem: true }
                : { id: 'm2', from: 'system', text: '📝 You have 24 hours to chat and decide if you want to continue together.', time: 'Just now', isSystem: true };
            
            // Create a 24h chat
            const chat = {
                id: 'chat-' + Date.now(),
                participant: user,
                project: selectedProject,
                messages: [
                    { id: 'm1', from: 'system', text: '🎉 It\'s a Match! You and ' + user.name + ' liked each other!', time: 'Just now', isSystem: true },
                    projectMessage
                ],
                unread: 0,
                expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
                status: 'active' // 'active', 'continued', 'rejected'
            };
            
            AppData.chats.push(chat);
            
            // Save chat to database
            await Database.saveChat(chat);
            
            // Show match modal
            this.showMatchModal(user);
        } else {
            const project = AppData.projects.find(p => p.id === id);
            if (!project) return;
            
            const owner = AppData.collaborators.find(u => u.id === project.owner.id);
            if (!owner) return;
            
            // Create match
            const match = {
                id: 'match-' + Date.now(),
                user: owner,
                project: project,
                matchedAt: new Date().toISOString()
            };
            
            AppData.matches.push(match);
            
            // Create a 24h chat
            const chat = {
                id: 'chat-' + Date.now(),
                participant: owner,
                project: project,
                messages: [
                    { id: 'm1', from: 'system', text: '🎉 It\'s a Match! You liked "' + project.title + '" and the owner liked you back!', time: 'Just now', isSystem: true },
                    { id: 'm2', from: 'system', text: '📝 You have 24 hours to chat and decide if you want to work together.', time: 'Just now', isSystem: true }
                ],
                unread: 0,
                expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
                status: 'active'
            };
            
            AppData.chats.push(chat);
            
            // Show match modal
            this.showMatchModal(owner, project);
        }
    },
    
    showMatchModal(user, project = null) {
        const main = document.querySelector('main');
        
        const projectInfo = project ? `<p class="text-sm text-indigo-600 font-medium mb-2">For project: ${project.title}</p>` : '';
        
        main.innerHTML = `
            <div class="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                <div class="bg-white rounded-2xl p-6 max-w-sm w-full text-center animate-bounce-in">
                    <div class="text-5xl mb-4">🎉</div>
                    <h2 class="text-2xl font-bold text-gray-800 mb-2">It's a Match!</h2>
                    <p class="text-gray-600 mb-4">
                        ${project ? 
                            'You and ' + user.name + ' liked each other for project "' + project.title + '"!' : 
                            'You and ' + user.name + ' liked each other!'
                        }
                    </p>
                    ${projectInfo}
                    <div class="flex justify-center gap-4 mb-4">
                        <img src="${user.photo || 'https://ui-avatars.com/api/?name=' + encodeURIComponent(user.name || 'U') + '&background=6366f1&color=fff&size=200&font-size=0.4&length=1'}" class="w-20 h-20 rounded-full object-cover border-4 border-indigo-100">
                    </div>
                    <p class="text-sm text-gray-500 mb-4">Start a 24-hour chat to get to know each other!</p>
                    <div class="flex gap-2">
                        <button onclick="Chat.showChatList()" class="flex-1 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold rounded-xl hover:shadow-lg transition">
                            <i class="ph ph-chat-circle mr-2"></i> Start Chat
                        </button>
                        <button onclick="Browse.refresh()" class="py-3 px-4 border-2 border-gray-300 text-gray-600 font-semibold rounded-xl hover:bg-gray-50 transition">
                            Keep Browsing
                        </button>
                    </div>
                </div>
            </div>
        `;
    }
};

// Make Browse available globally
window.Browse = Browse;

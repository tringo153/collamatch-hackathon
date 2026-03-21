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
        // Get all collaborators and sort by distance
        this.users = [...AppData.collaborators].sort((a, b) => {
            const distA = a.distanceValue || parseFloat(a.distance) || 999;
            const distB = b.distanceValue || parseFloat(b.distance) || 999;
            return distA - distB;
        });
        
        // Get all projects and sort by distance
        this.projects = [...AppData.projects].sort((a, b) => {
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
                    <div class="flex items-center justify-center gap-2 mb-6 p-1 bg-gray-100 rounded-xl">
                        <button class="browse-tab flex-1 px-4 py-2 rounded-lg text-sm font-medium transition ${this.activeTab === 'users' ? 'bg-white text-indigo-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}" data-tab="users">
                            <i class="ph ph-users mr-1"></i> People
                        </button>
                        <button class="browse-tab flex-1 px-4 py-2 rounded-lg text-sm font-medium transition ${this.activeTab === 'projects' ? 'bg-white text-green-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}" data-tab="projects">
                            <i class="ph ph-rocket-launch mr-1"></i> Projects
                        </button>
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
        
        return `
            <div class="browse-card bg-white rounded-xl shadow-sm overflow-hidden cursor-pointer hover:shadow-md transition" data-id="${user.id}" data-type="user">
                <!-- Photo & Distance Badge -->
                <div class="relative">
                    <img src="${user.photo}" alt="${user.name}" class="w-full h-40 object-cover">
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
                    
                    <!-- Stats Row -->
                    <div class="flex items-center justify-between pt-3 border-t border-gray-100">
                        <div class="flex items-center gap-3">
                            ${userProjects.length > 0 ? `
                                <span class="text-xs text-gray-500">
                                    <i class="ph ph-folder text-green-600"></i> ${userProjects.length} project${userProjects.length > 1 ? 's' : ''}
                                </span>
                            ` : ''}
                            <span class="text-xs text-gray-500">
                                <i class="ph ph-heart text-pink-600"></i> ${interestedCount} interested
                            </span>
                        </div>
                        <button class="text-indigo-600 text-sm font-medium hover:text-indigo-700">
                            View Details <i class="ph ph-arrow-right"></i>
                        </button>
                    </div>
                </div>
            </div>
        `;
    },
    
    renderProjectCard(project, index) {
        return `
            <div class="browse-card bg-white rounded-xl shadow-sm overflow-hidden cursor-pointer hover:shadow-md transition" data-id="${project.id}" data-type="project">
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
                            <img src="${project.owner.photo}" alt="${project.owner.name}" class="w-5 h-5 rounded-full">
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
                    
                    <!-- Posted Date -->
                    <div class="flex items-center justify-between pt-3 border-t border-gray-100">
                        <span class="text-xs text-gray-400">
                            <i class="ph ph-clock"></i> ${project.postedDate}
                        </span>
                        <button class="text-green-600 text-sm font-medium hover:text-green-700">
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
    }
};

// Make Browse available globally
window.Browse = Browse;

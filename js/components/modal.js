// Modal Component - Updated with new profile format and 24-hour chat

const Modal = {
    show(item) {
        const isProject = item.type === 'project';
        
        // Skill visualization
        const skillsHTML = item.skills.map(skill => `
            <div class="flex items-center gap-2 mb-1">
                <span class="text-xs text-gray-600 w-20 truncate">${skill.name}</span>
                <div class="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div class="h-full bg-gradient-to-r ${isProject ? 'from-green-500 to-emerald-500' : 'from-indigo-500 to-purple-500'} rounded-full" style="width: ${skill.level}%"></div>
                </div>
                <span class="text-xs text-gray-400 w-8">${skill.level}%</span>
            </div>
        `).join('');

        // Goals
        const goalsHTML = item.goals.map(goal => 
            `<span class="skill-tag ${isProject ? 'bg-green-50 text-green-700' : 'bg-indigo-50 text-indigo-700'}">${goal}</span>`
        ).join('');

        // Work style
        const workStyleHTML = item.workStyle.map(style => 
            `<span class="px-2 py-1 bg-green-50 text-green-700 rounded-full text-xs font-medium">${style}</span>`
        ).join('');

        // Availability (for users)
        const availabilityHTML = !isProject ? `
            <div class="flex items-center gap-2 text-sm text-gray-600 mb-3">
                <i class="ph ph-clock"></i>
                <span>${item.availability}</span>
            </div>
        ` : '';

        // Team needs (for projects)
        const teamNeedsHTML = isProject ? `
            <div class="mb-4">
                <h4 class="text-sm font-semibold text-gray-500 mb-2">Looking For</h4>
                <div class="flex flex-wrap gap-2">
                    ${item.teamNeeds.map(need => 
                        `<span class="px-3 py-1 bg-orange-50 text-orange-700 rounded-full text-sm font-medium">${need}</span>`
                    ).join('')}
                </div>
            </div>
        ` : '';

        // Location
        const locationHTML = `
            <div class="flex items-center gap-2 text-sm text-gray-600 mb-3">
                <i class="ph ph-map-pin"></i>
                <span>${item.location}</span>
                <span class="text-xs bg-gray-100 px-2 py-0.5 rounded-full">${item.distance}</span>
            </div>
        `;

        const title = isProject ? item.title : item.name;
        const photo = isProject ? item.owner.photo : item.photo;
        const ownerName = isProject ? item.owner.name : '';

        html = `
            <div class="modal-overlay" onclick="event.target === this && Modal.close()">
                <div class="modal-content w-full max-w-lg mx-4 max-h-[90vh] overflow-y-auto">
                    <button onclick="Modal.close()" class="absolute top-4 right-4 w-10 h-10 bg-white rounded-full shadow-lg flex items-center justify-center text-gray-500 hover:text-gray-700 z-10">
                        <i class="ph ph-x text-xl"></i>
                    </button>
                    
                    <!-- Photo -->
                    <div class="relative">
                        ${isProject ? 
                            `<div class="w-full h-40 bg-gradient-to-r from-green-500 to-emerald-500 flex items-center justify-center">
                                <i class="ph ph-rocket-launch text-5xl text-white/50"></i>
                            </div>` :
                            `<img src="${item.photo}" alt="${item.name}" class="w-full h-56 object-cover">`
                        }
                        <div class="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-black/50 to-transparent"></div>
                    </div>
                    
                    <div class="p-5 -mt-8 relative">
                        <!-- Name/Title -->
                        <div class="flex items-end gap-4 mb-3">
                            ${!isProject ? `<img src="${item.photo || 'https://ui-avatars.com/api/?name=' + encodeURIComponent(item.name || 'U') + '&background=6366f1&color=fff&size=128&font-size=0.4&length=1'}" alt="${item.name}" class="w-16 h-16 rounded-full border-4 border-white shadow-md">` : ''}
                            <div class="flex-1 pb-2">
                                <h2 class="text-2xl font-bold text-gray-800">${title}</h2>
                                ${ownerName ? `<p class="text-gray-600">${ownerName}</p>` : ''}
                            </div>
                        </div>
                        
                        <!-- Location -->
                        ${locationHTML}
                        
                        <!-- Work Style -->
                        <div class="mb-4">
                            <div class="flex flex-wrap gap-2">
                                ${workStyleHTML}
                                ${!isProject ? `<span class="px-2 py-1 bg-blue-50 text-blue-700 rounded-full text-xs font-medium"><i class="ph ph-clock mr-1"></i>${item.availability}</span>` : ''}
                            </div>
                        </div>
                        
                        <!-- Bio -->
                        <p class="text-gray-600 text-sm mb-4">${item.bio}</p>
                        
                        <!-- Goals -->
                        <div class="mb-4">
                            <h4 class="text-sm font-semibold text-gray-500 mb-2">Goals</h4>
                            <div class="flex flex-wrap gap-2">
                                ${goalsHTML}
                            </div>
                        </div>
                        
                        ${teamNeedsHTML}
                        
                        <!-- Skills -->
                        <div class="mb-5">
                            <h4 class="text-sm font-semibold text-gray-500 mb-2">${isProject ? 'Tech Stack' : 'Skills'}</h4>
                            ${skillsHTML}
                        </div>
                        
                        <!-- Action Buttons -->
                        <div class="flex gap-3">
                            <button onclick="Modal.close(); setTimeout(() => Swiper.pass(), 200);" class="flex-1 py-3 border-2 border-gray-300 text-gray-600 font-semibold rounded-xl hover:bg-gray-50 transition">
                                <i class="ph ph-x"></i> Pass
                            </button>
                            <button onclick="Modal.close(); setTimeout(() => Swiper.like(), 200);" class="flex-1 py-3 bg-gradient-to-r from-green-500 to-emerald-500 text-white font-semibold rounded-xl hover:shadow-lg transition">
                                <i class="ph ph-heart"></i> Interested
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `;

        const container = document.getElementById('modal-container');
        container.innerHTML = html;
    },

    // Show detailed user modal with private document and projects
    showUserDetailModal(user) {
        // Get user's owned projects
        const userProjects = AppData.projects.filter(p => user.ownedProjects && user.ownedProjects.includes(p.id));
        const interestedCount = user.interestedProjects ? user.interestedProjects.length : 0;
        
        // Check if current user owns this profile (can see private doc)
        const isOwnProfile = user.id === AppData.currentUser.id;
        
        // Skills HTML
        const skillsHTML = user.skills.map(skill => `
            <div class="flex items-center gap-2 mb-1">
                <span class="text-xs text-gray-600 w-20 truncate">${skill.name}</span>
                <div class="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div class="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full" style="width: ${skill.level}%"></div>
                </div>
                <span class="text-xs text-gray-400 w-8">${skill.level}%</span>
            </div>
        `).join('');

        // Goals HTML
        const goalsHTML = user.goals.map(goal => 
            `<span class="px-3 py-1 bg-indigo-50 text-indigo-700 rounded-full text-sm">${goal}</span>`
        ).join('');

        // Work style HTML
        const workStyleHTML = user.workStyle.map(style => 
            `<span class="px-2 py-1 bg-green-50 text-green-700 rounded-full text-xs font-medium">${style}</span>`
        ).join('');

        // Private document section
        const privateDocHTML = user.privateDocument ? `
            <div class="mb-5">
                <div class="flex items-center justify-between mb-2">
                    <h4 class="text-sm font-semibold text-gray-500">
                        <i class="ph ph-lock mr-1"></i> Private Document
                    </h4>
                    ${isOwnProfile ? '<span class="text-xs text-green-600"><i class="ph ph-check-circle"></i> Your document</span>' : '<span class="text-xs text-gray-400">Available upon request</span>'}
                </div>
                <div class="bg-gray-50 rounded-xl p-4">
                    <h5 class="font-semibold text-gray-800 mb-2">${user.privateDocument.title || 'Private Document'}</h5>
                    ${isOwnProfile ? `
                        <p class="text-sm text-gray-600">${user.privateDocument.content}</p>
                    ` : `
                        <div class="text-center py-2">
                            <p class="text-sm text-gray-500 mb-3">This content is private. Request access to view.</p>
                            <button class="px-4 py-2 bg-indigo-600 text-white text-sm rounded-lg hover:bg-indigo-700 transition">
                                <i class="ph ph-envelope mr-1"></i> Request Access
                            </button>
                        </div>
                    `}
                </div>
            </div>
        ` : '';

        // Projects list HTML
        const projectsListHTML = userProjects.length > 0 ? `
            <div class="mb-5">
                <h4 class="text-sm font-semibold text-gray-500 mb-3">
                    <i class="ph ph-folder mr-1"></i> Projects (${userProjects.length})
                </h4>
                <div class="space-y-2">
                    ${userProjects.map(project => `
                        <div class="bg-green-50 rounded-lg p-3 cursor-pointer hover:bg-green-100 transition" onclick="Modal.showProjectDetailModal(AppData.projects.find(p => p.id === '${project.id}'))">
                            <div class="flex items-center gap-3">
                                <div class="w-10 h-10 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg flex items-center justify-center">
                                    <i class="ph ph-rocket-launch text-white text-lg"></i>
                                </div>
                                <div class="flex-1">
                                    <h5 class="font-medium text-gray-800">${project.title}</h5>
                                    <p class="text-xs text-gray-500">${project.goals.slice(0, 2).join(', ')}</p>
                                </div>
                                <i class="ph ph-arrow-right text-gray-400"></i>
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>
        ` : '';

        const html = `
            <div class="modal-overlay" onclick="event.target === this && Modal.close()">
                <div class="modal-content w-full max-w-lg mx-4 max-h-[90vh] overflow-y-auto">
                    <button onclick="Modal.close()" class="absolute top-4 right-4 w-10 h-10 bg-white rounded-full shadow-lg flex items-center justify-center text-gray-500 hover:text-gray-700 z-10">
                        <i class="ph ph-x text-xl"></i>
                    </button>
                    
                    <!-- Cover Photo -->
                    <div class="relative">
                        <div class="w-full h-32 bg-gradient-to-r from-indigo-600 to-purple-600"></div>
                        <div class="absolute -bottom-12 left-6">
                            <img src="${user.photo || 'https://ui-avatars.com/api/?name=' + encodeURIComponent(user.name || 'U') + '&background=6366f1&color=fff&size=200&font-size=0.4&length=1'}" alt="${user.name}" class="w-24 h-24 rounded-full border-4 border-white shadow-md">
                        </div>
                    </div>
                    
                    <div class="p-5 pt-16">
                        <!-- Name & Location -->
                        <div class="mb-4">
                            <h2 class="text-2xl font-bold text-gray-800">${user.name}</h2>
                            <div class="flex items-center gap-2 text-gray-500 mt-1">
                                <i class="ph ph-map-pin"></i>
                                <span>${user.location}</span>
                                <span class="text-xs bg-gray-100 px-2 py-0.5 rounded-full">${user.distance}</span>
                            </div>
                        </div>
                        
                        <!-- Work Style & Availability -->
                        <div class="flex flex-wrap gap-2 mb-4">
                            ${workStyleHTML}
                            <span class="px-2 py-1 bg-blue-50 text-blue-700 rounded-full text-xs font-medium">
                                <i class="ph ph-clock mr-1"></i>${user.availability}
                            </span>
                        </div>
                        
                        <!-- Bio -->
                        <p class="text-gray-600 mb-4">${user.bio}</p>
                        
                        <!-- Stats -->
                        <div class="flex gap-4 mb-4">
                            <div class="flex items-center gap-2 text-sm text-gray-500">
                                <i class="ph ph-folder text-green-600"></i>
                                <span>${userProjects.length} project${userProjects.length !== 1 ? 's' : ''}</span>
                            </div>
                            <div class="flex items-center gap-2 text-sm text-gray-500">
                                <i class="ph ph-heart text-pink-600"></i>
                                <span>${interestedCount} interested</span>
                            </div>
                        </div>
                        
                        <!-- Goals -->
                        <div class="mb-4">
                            <h4 class="text-sm font-semibold text-gray-500 mb-2">Goals</h4>
                            <div class="flex flex-wrap gap-2">
                                ${goalsHTML}
                            </div>
                        </div>
                        
                        <!-- Looking For -->
                        <div class="mb-4">
                            <h4 class="text-sm font-semibold text-gray-500 mb-2">Looking For</h4>
                            <div class="flex gap-2">
                                ${user.lookingFor.map(item => 
                                    `<span class="px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full text-sm">${item}</span>`
                                ).join('')}
                            </div>
                        </div>
                        
                        <!-- Skills -->
                        <div class="mb-4">
                            <h4 class="text-sm font-semibold text-gray-500 mb-2">Skills</h4>
                            ${skillsHTML}
                        </div>
                        
                        <!-- Private Document -->
                        ${privateDocHTML}
                        
                        <!-- Projects List -->
                        ${projectsListHTML}
                        
                        <!-- Action Buttons -->
                        <div class="flex gap-3 pt-4 border-t">
                            <button onclick="Modal.close(); setTimeout(() => Browse.handleAction('${user.id}', 'user', 'pass'), 200);" class="flex-1 py-3 border-2 border-gray-300 text-gray-600 font-semibold rounded-xl hover:bg-gray-50 transition">
                                <i class="ph ph-x"></i> Pass
                            </button>
                            <button onclick="Modal.close(); setTimeout(() => Browse.handleAction('${user.id}', 'user', 'like'), 200);" class="flex-1 py-3 bg-gradient-to-r from-green-500 to-emerald-500 text-white font-semibold rounded-xl hover:shadow-lg transition">
                                <i class="ph ph-handshake"></i> Match
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `;

        const container = document.getElementById('modal-container');
        container.innerHTML = html;
    },

    // Show detailed project modal with private document
    showProjectDetailModal(project) {
        // Check if current user owns this project (check both owner ID and ownedProjects)
        const currentUserId = AppData.currentUser?.originalId || AppData.currentUser?.id;
        const isOwnProject = project.owner.id === currentUserId || 
            (AppData.currentUser?.ownedProjects && AppData.currentUser.ownedProjects.includes(project.id));
        
        // Skills HTML
        const skillsHTML = project.skills.map(skill => `
            <div class="flex items-center gap-2 mb-1">
                <span class="text-xs text-gray-600 w-20 truncate">${skill.name}</span>
                <div class="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div class="h-full bg-gradient-to-r from-green-500 to-emerald-500 rounded-full" style="width: ${skill.level}%"></div>
                </div>
                <span class="text-xs text-gray-400 w-8">${skill.level}%</span>
            </div>
        `).join('');

        // Goals HTML
        const goalsHTML = project.goals.map(goal => 
            `<span class="px-3 py-1 bg-green-50 text-green-700 rounded-full text-sm">${goal}</span>`
        ).join('');

        // Work style HTML
        const workStyleHTML = project.workStyle.map(style => 
            `<span class="px-2 py-1 bg-purple-50 text-purple-700 rounded-full text-xs font-medium">${style}</span>`
        ).join('');

        // Team needs HTML
        const teamNeedsHTML = project.teamNeeds.map(need => 
            `<span class="px-3 py-1 bg-orange-50 text-orange-700 rounded-full text-sm font-medium">${need}</span>`
        ).join('');

        // Private document section
        const privateDocHTML = project.privateDocument ? `
            <div class="mb-5">
                <div class="flex items-center justify-between mb-2">
                    <h4 class="text-sm font-semibold text-gray-500">
                        <i class="ph ph-lock mr-1"></i> Private Document
                    </h4>
                    ${isOwnProject ? '<span class="text-xs text-green-600"><i class="ph ph-check-circle"></i> Your document</span>' : '<span class="text-xs text-gray-400">Available upon request</span>'}
                </div>
                <div class="bg-gray-50 rounded-xl p-4">
                    <h5 class="font-semibold text-gray-800 mb-2">${project.privateDocument.title || 'Private Document'}</h5>
                    ${isOwnProject ? `
                        <p class="text-sm text-gray-600">${project.privateDocument.content}</p>
                    ` : `
                        <div class="text-center py-2">
                            <p class="text-sm text-gray-500 mb-3">This content is private. Request access to view.</p>
                            <button class="px-4 py-2 bg-green-600 text-white text-sm rounded-lg hover:bg-green-700 transition">
                                <i class="ph ph-envelope mr-1"></i> Request Access
                            </button>
                        </div>
                    `}
                </div>
            </div>
        ` : '';

        const html = `
            <div class="modal-overlay" onclick="event.target === this && Modal.close()">
                <div class="modal-content w-full max-w-lg mx-4 max-h-[90vh] overflow-y-auto">
                    <button onclick="Modal.close()" class="absolute top-4 right-4 w-10 h-10 bg-white rounded-full shadow-lg flex items-center justify-center text-gray-500 hover:text-gray-700 z-10">
                        <i class="ph ph-x text-xl"></i>
                    </button>
                    
                    <!-- Cover -->
                    <div class="relative">
                        <div class="w-full h-40 bg-gradient-to-r from-green-500 to-emerald-500 flex items-center justify-center">
                            <i class="ph ph-rocket-launch text-5xl text-white/50"></i>
                        </div>
                        <div class="absolute bottom-4 left-6">
                            <span class="px-3 py-1 bg-white/20 text-white text-sm font-bold rounded-full">PROJECT</span>
                        </div>
                    </div>
                    
                    <div class="p-5">
                        <!-- Title -->
                        <h2 class="text-2xl font-bold text-gray-800 mb-2">${project.title}</h2>
                        
                        <!-- Owner -->
                        <div class="flex items-center gap-3 mb-4">
                            <img src="${project.owner.photo}" alt="${project.owner.name}" class="w-10 h-10 rounded-full">
                            <div>
                                <p class="font-medium text-gray-800">${project.owner.name}</p>
                                <p class="text-xs text-gray-500">Project Owner</p>
                            </div>
                        </div>
                        
                        <!-- Location & Date -->
                        <div class="flex items-center gap-4 text-sm text-gray-500 mb-4">
                            <span class="flex items-center gap-1">
                                <i class="ph ph-map-pin"></i> ${project.location}
                            </span>
                            <span class="flex items-center gap-1">
                                <i class="ph ph-clock"></i> ${project.postedDate}
                            </span>
                            <span class="bg-gray-100 px-2 py-0.5 rounded-full text-xs">${project.distance}</span>
                        </div>
                        
                        <!-- Work Style -->
                        <div class="flex flex-wrap gap-2 mb-4">
                            ${workStyleHTML}
                        </div>
                        
                        <!-- Description -->
                        <p class="text-gray-600 mb-4">${project.description}</p>
                        
                        <!-- Goals -->
                        <div class="mb-4">
                            <h4 class="text-sm font-semibold text-gray-500 mb-2">Goals</h4>
                            <div class="flex flex-wrap gap-2">
                                ${goalsHTML}
                            </div>
                        </div>
                        
                        <!-- Team Needs -->
                        <div class="mb-4">
                            <h4 class="text-sm font-semibold text-gray-500 mb-2">Looking For</h4>
                            <div class="flex flex-wrap gap-2">
                                ${teamNeedsHTML}
                            </div>
                        </div>
                        
                        <!-- Tech Stack -->
                        <div class="mb-4">
                            <h4 class="text-sm font-semibold text-gray-500 mb-2">Tech Stack</h4>
                            ${skillsHTML}
                        </div>
                        
                        <!-- Private Document -->
                        ${privateDocHTML}
                        
                        <!-- Action Buttons -->
                        <div class="flex gap-3 pt-4 border-t">
                            ${isOwnProject ? `
                                <button onclick="Modal.close()" class="flex-1 py-3 border-2 border-gray-300 text-gray-600 font-semibold rounded-xl hover:bg-gray-50 transition">
                                    <i class="ph ph-x"></i> Close
                                </button>
                            ` : `
                                <button onclick="Modal.close(); setTimeout(() => Browse.handleAction('${project.id}', 'project', 'pass'), 200);" class="flex-1 py-3 border-2 border-gray-300 text-gray-600 font-semibold rounded-xl hover:bg-gray-50 transition">
                                    <i class="ph ph-x"></i> Pass
                                </button>
                                <button onclick="Modal.close(); setTimeout(() => Browse.handleAction('${project.id}', 'project', 'like'), 200);" class="flex-1 py-3 bg-gradient-to-r from-green-500 to-emerald-500 text-white font-semibold rounded-xl hover:shadow-lg transition">
                                    <i class="ph ph-heart"></i> Like
                                </button>
                            `}
                        </div>
                    </div>
                </div>
            </div>
        `;

        const container = document.getElementById('modal-container');
        container.innerHTML = html;
    },

    handleInterest(type, id) {
        // Add to interested list
        if (type === 'user') {
            // The user liked a person
            if (!AppData.currentUser.interestedProjects) {
                AppData.currentUser.interestedProjects = [];
            }
        }
        
        // Show interest and close modal
        alert('Interest expressed! If there\'s a match, you\'ll be notified.');
        Modal.close();
    },

    showProfileModal(user) {
        // Get user's owned projects
        const userProjects = AppData.projects.filter(p => user.ownedProjects && user.ownedProjects.includes(p.id));
        const interestedCount = user.interestedProjects ? user.interestedProjects.length : 0;
        
        // Check if this is current user's profile
        const isOwnProfile = user.id === AppData.currentUser.id;
        
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
                    <span class="text-xs text-green-600"><i class="ph ph-check-circle"></i> ${isOwnProfile ? 'Your document' : 'Available'}</span>
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
                <h3 class="font-semibold text-gray-800 mb-2">
                    <i class="ph ph-folder mr-1"></i> Your Projects (${userProjects.length})
                </h3>
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
        ` : '';

        const html = `
            <div class="modal-overlay" onclick="event.target === this && Modal.close()">
                <div class="modal-content w-full max-w-lg mx-4 max-h-[90vh] overflow-y-auto">
                    <button onclick="Modal.close()" class="absolute top-4 right-4 w-10 h-10 bg-white rounded-full shadow-lg flex items-center justify-center text-gray-500 hover:text-gray-700 z-10">
                        <i class="ph ph-x text-xl"></i>
                    </button>
                    
                    <div class="relative">
                        <div class="w-full h-32 bg-gradient-to-r from-indigo-600 to-purple-600"></div>
                        <div class="absolute -bottom-12 left-6">
                            <img src="${user.photo || 'https://ui-avatars.com/api/?name=' + encodeURIComponent(user.name || 'U') + '&background=6366f1&color=fff&size=200&font-size=0.4&length=1'}" alt="${user.name}" class="w-24 h-24 rounded-full border-4 border-white shadow-md">
                        </div>
                    </div>
                    
                    <div class="p-5 pt-16">
                        <div class="flex items-start justify-between mb-4">
                            <div>
                                <h2 class="text-2xl font-bold text-gray-800">${user.name}</h2>
                            </div>
                            ${isOwnProfile ? `
                                <button onclick="Signup.show()" class="px-4 py-2 bg-indigo-600 text-white text-sm rounded-lg hover:bg-indigo-700 transition">
                                    <i class="ph ph-pencil"></i> Edit
                                </button>
                            ` : ''}
                        </div>
                        
                        <!-- Location -->
                        <div class="flex items-center gap-2 text-sm text-gray-600 mb-4">
                            <i class="ph ph-map-pin"></i>
                            <span>${user.location}</span>
                            <span class="text-xs bg-gray-100 px-2 py-0.5 rounded-full">${user.distance}</span>
                        </div>
                        
                        <!-- Work Style -->
                        <div class="flex flex-wrap gap-2 mb-4">
                            ${workStyleHTML}
                            <span class="px-2 py-1 bg-blue-50 text-blue-700 rounded-full text-xs font-medium">
                                <i class="ph ph-clock mr-1"></i>${user.availability}
                            </span>
                        </div>
                        
                        <p class="text-gray-600 mb-4">${user.bio}</p>
                        
                        <div class="mb-4">
                            <h3 class="font-semibold text-gray-800 mb-2">Goals</h3>
                            <div class="flex flex-wrap gap-2">
                                ${goalsHTML}
                            </div>
                        </div>
                        
                        <div class="mb-4">
                            <h3 class="font-semibold text-gray-800 mb-2">Skills</h3>
                            ${skillsHTML}
                        </div>
                        
                        <div class="mb-4">
                            <h3 class="font-semibold text-gray-800 mb-2">Looking For</h3>
                            <div class="flex gap-2">
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
                            <h3 class="font-semibold text-gray-800 mb-3">Stats</h3>
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
            </div>
        `;

        const container = document.getElementById('modal-container');
        container.innerHTML = html;
    },

    // Store selected user and projects for matching
    _pendingMatch: null,

    showProjectSelection(swipedUser, userProjects) {
        const popup = document.getElementById('match-popup');
        
        // Store the pending match data
        this._pendingMatch = {
            user: swipedUser,
            userProjects: userProjects
        };
        
        // Generate projects list HTML
        const projectsHTML = userProjects.map(project => `
            <div class="project-option bg-white/10 rounded-xl p-4 cursor-pointer hover:bg-white/20 transition border-2 border-transparent hover:border-indigo-400" onclick="Modal.selectProjectForMatch('${project.id}')">
                <div class="flex items-center gap-3">
                    <div class="w-12 h-12 rounded-lg bg-gradient-to-r from-green-500 to-emerald-500 flex items-center justify-center">
                        <i class="ph ph-rocket-launch text-xl text-white"></i>
                    </div>
                    <div class="flex-1 text-left">
                        <h4 class="font-semibold text-white">${project.title}</h4>
                        <p class="text-xs text-gray-300">${project.goals?.[0] || 'View project details'}</p>
                    </div>
                    <i class="ph ph-caret-right text-gray-400"></i>
                </div>
            </div>
        `).join('');

        const html = `
            <div class="text-center">
                <h2 class="text-2xl font-bold mb-2">Select a Project</h2>
                <p class="text-gray-300 mb-2">${swipedUser.name} has projects available!</p>
                <p class="text-indigo-300 text-sm mb-6">Choose one of your projects to match</p>
                
                <div class="flex items-center justify-center gap-3 mb-6">
                    <div class="w-16 h-16 rounded-full overflow-hidden border-2 border-white">
                        <img src="${swipedUser.photo || 'https://ui-avatars.com/api/?name=' + encodeURIComponent(swipedUser.name || 'U') + '&background=6366f1&color=fff&size=128&font-size=0.4&length=1'}" alt="${swipedUser.name}" class="w-full h-full object-cover">
                    </div>
                    <i class="ph ph-arrow-right text-2xl text-gray-400"></i>
                    <div class="w-16 h-16 rounded-full overflow-hidden border-2 border-white bg-gradient-to-r from-green-500 to-emerald-500 flex items-center justify-center">
                        <i class="ph ph-folder-open text-2xl text-white"></i>
                    </div>
                </div>
                
                <div class="space-y-3 mb-6 max-h-64 overflow-y-auto">
                    ${projectsHTML}
                </div>
                
                <div class="flex gap-3">
                    <button onclick="Modal.skipProjectMatch()" class="flex-1 px-8 py-3 bg-transparent border-2 border-white text-white font-semibold rounded-full hover:bg-white/10 transition">
                        Skip
                    </button>
                    <button onclick="Modal.closeMatch()" class="flex-1 px-8 py-3 bg-transparent border-2 border-white text-white font-semibold rounded-full hover:bg-white/10 transition">
                        Cancel
                    </button>
                </div>
            </div>
        `;

        popup.innerHTML = html;
        popup.classList.remove('hidden');
    },

    async selectProjectForMatch(projectId) {
        if (!this._pendingMatch) return;
        
        const { user, userProjects } = this._pendingMatch;
        const selectedProject = userProjects.find(p => p.id === projectId);
        
        if (!selectedProject) return;
        
        // Add to current user's interestedProjects (we're interested in this project)
        if (!AppData.currentUser.interestedProjects) {
            AppData.currentUser.interestedProjects = [];
        }
        if (!AppData.currentUser.interestedProjects.includes(projectId)) {
            AppData.currentUser.interestedProjects.push(projectId);
        }
        
        // Save current user to database
        await Database.saveCurrentUser(AppData.currentUser);
        
        // Also add to the project owner's data so they can see us in their People tab
        const projectOwner = AppData.collaborators.find(u => u.id === selectedProject.owner.id);
        if (projectOwner) {
            if (!projectOwner.likesReceived) {
                projectOwner.likesReceived = [];
            }
            const currentUserId = AppData.currentUser.originalId || (AppData.currentUser.id === 'current' ? 'user-1' : AppData.currentUser.id);
            
            // Check if already exists
            const existingIndex = projectOwner.likesReceived.findIndex(l => l.fromId === currentUserId);
            if (existingIndex === -1) {
                projectOwner.likesReceived.push({
                    fromId: currentUserId,
                    fromType: 'project',
                    projectId: projectId,
                    timestamp: new Date().toISOString()
                });
                // Update in database using saveCollaborator
                await Database.saveCollaborator(projectOwner);
            }
        }
        
        // Create the match with the selected project
        const matchItem = {
            ...user,
            matchedProject: selectedProject
        };
        
        AppData.matches.push({
            id: user.id,
            item: matchItem,
            matchedAt: new Date().toISOString(),
            expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString()
        });
        
        // Clear pending match
        this._pendingMatch = null;
        
        // Show the match popup with the selected project
        this.closeMatch();
        setTimeout(() => {
            this.showMatchWithProject(user, selectedProject);
        }, 300);
    },
    
    async skipProjectMatch() {
        if (!this._pendingMatch) return;
        
        const { user } = this._pendingMatch;
        
        // Add to target user's likesReceived (so they see currUser in their People tab)
        const currentUserActualId = AppData.currentUser.originalId || (AppData.currentUser.id === 'current' ? 'user-1' : AppData.currentUser.id);
        
        // Find the target user (the one we're skipping)
        const targetUser = AppData.collaborators.find(u => u.id === user.id);
        if (targetUser) {
            if (!targetUser.likesReceived) {
                targetUser.likesReceived = [];
            }
            targetUser.likesReceived.push({
                fromId: currentUserActualId,
                fromType: 'user',
                timestamp: new Date().toISOString()
            });
            // Save to database
            await Database.saveCollaborator(targetUser);
        }
        
        // Clear pending match
        this._pendingMatch = null;
        
        // Close the modal (try both methods to ensure it closes)
        this.closeProjectMatch();
        this.closeMatch();
    },

    showMatchWithProject(user, project) {
        const popup = document.getElementById('match-popup');
        
        const html = `
            <div class="text-center">
                <h2 class="text-4xl font-bold mb-4">It's a Match! 🎉</h2>
                <p class="text-gray-300 mb-2">You and ${user.name} are both interested!</p>
                <p class="text-indigo-300 text-sm mb-6">Matched on project: <span class="text-white font-semibold">${project.title}</span></p>
                
                <div class="flex items-center justify-center gap-4 mb-8">
                    <div class="w-28 h-28 rounded-full overflow-hidden border-4 border-white">
                        <img src="${AppData.currentUser.photo || 'https://ui-avatars.com/api/?name=' + encodeURIComponent(AppData.currentUser.name || 'U') + '&background=6366f1&color=fff&size=200&font-size=0.4&length=1'}" alt="You" class="w-full h-full object-cover">
                    </div>
                    <i class="ph ph-heart text-4xl text-red-500"></i>
                    <div class="w-28 h-28 rounded-full overflow-hidden border-4 border-white">
                        <img src="${user.photo || 'https://ui-avatars.com/api/?name=' + encodeURIComponent(user.name || 'U') + '&background=6366f1&color=fff&size=200&font-size=0.4&length=1'}" alt="${user.name}" class="w-full h-full object-cover">
                    </div>
                </div>
                
                <div class="bg-white/10 rounded-xl p-4 mb-6 max-w-xs mx-auto">
                    <p class="text-sm text-gray-300">Your 24-hour structured chat has opened. Use the guided prompts to get to know each other!</p>
                </div>
                
                <div class="flex flex-col gap-3">
                    <button onclick="Modal.closeMatch(); App.navigateTo('chats');" class="px-8 py-3 bg-white text-indigo-600 font-semibold rounded-full hover:bg-gray-100 transition">
                        <i class="ph ph-chat"></i> Start Chat
                    </button>
                    <button onclick="Modal.closeMatch()" class="px-8 py-3 bg-transparent border-2 border-white text-white font-semibold rounded-full hover:bg-white/10 transition">
                        Keep Browsing
                    </button>
                </div>
            </div>
        `;

        popup.innerHTML = html;
        popup.classList.remove('hidden');
    },

    showMatch(item) {
        const popup = document.getElementById('match-popup');
        
        const html = `
            <div class="text-center">
                <h2 class="text-4xl font-bold mb-4">It's a Match! 🎉</h2>
                <p class="text-gray-300 mb-2">You and ${item.name || item.title} are both interested!</p>
                <p class="text-indigo-300 text-sm mb-6">24-hour chat opened</p>
                
                <div class="flex items-center justify-center gap-4 mb-8">
                    <div class="w-28 h-28 rounded-full overflow-hidden border-4 border-white">
                        <img src="${AppData.currentUser.photo || 'https://ui-avatars.com/api/?name=' + encodeURIComponent(AppData.currentUser.name || 'U') + '&background=6366f1&color=fff&size=200&font-size=0.4&length=1'}" alt="You" class="w-full h-full object-cover">
                    </div>
                    <i class="ph ph-heart text-4xl text-red-500"></i>
                    <div class="w-28 h-28 rounded-full overflow-hidden border-4 border-white">
                        <img src="${item.photo || item.owner?.photo || 'https://ui-avatars.com/api/?name=' + encodeURIComponent(item.name || item.title || 'U') + '&background=6366f1&color=fff&size=200&font-size=0.4&length=1'}" alt="${item.name || item.title}" class="w-full h-full object-cover">
                    </div>
                </div>
                
                <div class="bg-white/10 rounded-xl p-4 mb-6 max-w-xs mx-auto">
                    <p class="text-sm text-gray-300">Your 24-hour structured chat has opened. Use the guided prompts to get to know each other!</p>
                </div>
                
                <div class="flex flex-col gap-3">
                    <button onclick="Modal.closeMatch(); App.navigateTo('chats');" class="px-8 py-3 bg-white text-indigo-600 font-semibold rounded-full hover:bg-gray-100 transition">
                        <i class="ph ph-chat"></i> Start Chat
                    </button>
                    <button onclick="Modal.closeMatch()" class="px-8 py-3 bg-transparent border-2 border-white text-white font-semibold rounded-full hover:bg-white/10 transition">
                        Keep Browsing
                    </button>
                </div>
            </div>
        `;

        popup.innerHTML = html;
        popup.classList.remove('hidden');
    },

    // Show create project modal
    showCreateProjectModal() {
        const container = document.getElementById('modal-container');
        
        const html = `
            <div class="modal-overlay" onclick="event.target === this && Modal.close()">
                <div class="modal-content p-6 max-h-[90vh] overflow-y-auto">
                    <div class="flex items-center justify-between mb-6">
                        <h3 class="text-xl font-bold text-gray-800">Create New Project</h3>
                        <button onclick="Modal.close()" class="text-gray-400 hover:text-gray-600">
                            <i class="ph ph-x text-xl"></i>
                        </button>
                    </div>
                    
                    <form id="create-project-form" class="space-y-4">
                        <!-- Project Title -->
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-2">Project Title</label>
                            <input type="text" id="project-title" required placeholder="e.g., E-commerce Platform"
                                class="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent">
                        </div>
                        
                        <!-- Description -->
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-2">Description</label>
                            <textarea id="project-description" rows="3" required placeholder="Describe your project..."
                                class="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent resize-none"></textarea>
                        </div>
                        
                        <!-- Looking For -->
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-2">Looking For (select all that apply)</label>
                            <div class="flex flex-wrap gap-2">
                                <button type="button" class="team-need-btn px-3 py-2 rounded-full border text-sm font-medium transition border-gray-200 text-gray-600 hover:border-green-300" data-value="Co-founder">
                                    Co-founder
                                </button>
                                <button type="button" class="team-need-btn px-3 py-2 rounded-full border text-sm font-medium transition border-gray-200 text-gray-600 hover:border-green-300" data-value="Frontend Developer">
                                    Frontend Developer
                                </button>
                                <button type="button" class="team-need-btn px-3 py-2 rounded-full border text-sm font-medium transition border-gray-200 text-gray-600 hover:border-green-300" data-value="Backend Developer">
                                    Backend Developer
                                </button>
                                <button type="button" class="team-need-btn px-3 py-2 rounded-full border text-sm font-medium transition border-gray-200 text-gray-600 hover:border-green-300" data-value="Designer">
                                    Designer
                                </button>
                                <button type="button" class="team-need-btn px-3 py-2 rounded-full border text-sm font-medium transition border-gray-200 text-gray-600 hover:border-green-300" data-value="Marketing">
                                    Marketing
                                </button>
                                <button type="button" class="team-need-btn px-3 py-2 rounded-full border text-sm font-medium transition border-gray-200 text-gray-600 hover:border-green-300" data-value="Other">
                                    Other
                                </button>
                            </div>
                        </div>
                        
                        <!-- Work Style -->
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-2">Work Style (select all that apply)</label>
                            <div class="flex flex-wrap gap-2">
                                <button type="button" class="workstyle-btn px-3 py-2 rounded-full border text-sm font-medium transition border-gray-200 text-gray-600 hover:border-green-300" data-value="Deep Work">
                                    Deep Work
                                </button>
                                <button type="button" class="workstyle-btn px-3 py-2 rounded-full border text-sm font-medium transition border-gray-200 text-gray-600 hover:border-green-300" data-value="Async">
                                    Async
                                </button>
                                <button type="button" class="workstyle-btn px-3 py-2 rounded-full border text-sm font-medium transition border-gray-200 text-gray-600 hover:border-green-300" data-value="Collaborative">
                                    Collaborative
                                </button>
                                <button type="button" class="workstyle-btn px-3 py-2 rounded-full border text-sm font-medium transition border-gray-200 text-gray-600 hover:border-green-300" data-value="Casual">
                                    Casual
                                </button>
                            </div>
                        </div>
                        
                        <!-- Availability -->
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-2">Team Availability</label>
                            <div class="grid grid-cols-2 gap-2">
                                <button type="button" class="availability-btn px-4 py-2 rounded-lg border text-sm font-medium transition border-gray-200 text-gray-600 hover:border-green-300" data-value="5-10 hrs/week">
                                    5-10 hrs/week
                                </button>
                                <button type="button" class="availability-btn px-4 py-2 rounded-lg border text-sm font-medium transition border-gray-200 text-gray-600 hover:border-green-300" data-value="10-15 hrs/week">
                                    10-15 hrs/week
                                </button>
                                <button type="button" class="availability-btn px-4 py-2 rounded-lg border text-sm font-medium transition border-gray-200 text-gray-600 hover:border-green-300" data-value="15-20 hrs/week">
                                    15-20 hrs/week
                                </button>
                                <button type="button" class="availability-btn px-4 py-2 rounded-lg border text-sm font-medium transition border-gray-200 text-gray-600 hover:border-green-300" data-value="20+ hrs/week">
                                    20+ hrs/week
                                </button>
                            </div>
                        </div>
                        
                        <!-- Location -->
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-2">Location</label>
                            <input type="text" id="project-location" placeholder="City, State (or Remote)"
                                class="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent">
                        </div>
                        
                        <!-- Submit Button -->
                        <button type="submit" class="w-full py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white font-semibold rounded-xl hover:shadow-lg transition">
                            Create Project
                        </button>
                    </form>
                </div>
            </div>
        `;
        
        container.innerHTML = html;
        
        // Setup form handling
        const form = document.getElementById('create-project-form');
        const teamNeeds = [];
        const workStyles = [];
        let availability = '10-15 hrs/week';
        
        // Team need buttons
        document.querySelectorAll('.team-need-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const value = btn.dataset.value;
                if (teamNeeds.includes(value)) {
                    teamNeeds.splice(teamNeeds.indexOf(value), 1);
                    btn.classList.remove('border-green-500', 'bg-green-50', 'text-green-700');
                    btn.classList.add('border-gray-200', 'text-gray-600');
                } else {
                    teamNeeds.push(value);
                    btn.classList.add('border-green-500', 'bg-green-50', 'text-green-700');
                    btn.classList.remove('border-gray-200', 'text-gray-600');
                }
            });
        });
        
        // Workstyle buttons
        document.querySelectorAll('.workstyle-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const value = btn.dataset.value;
                if (workStyles.includes(value)) {
                    workStyles.splice(workStyles.indexOf(value), 1);
                    btn.classList.remove('border-green-500', 'bg-green-50', 'text-green-700');
                    btn.classList.add('border-gray-200', 'text-gray-600');
                } else {
                    workStyles.push(value);
                    btn.classList.add('border-green-500', 'bg-green-50', 'text-green-700');
                    btn.classList.remove('border-gray-200', 'text-gray-600');
                }
            });
        });
        
        // Availability buttons
        document.querySelectorAll('.availability-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                availability = btn.dataset.value;
                document.querySelectorAll('.availability-btn').forEach(b => {
                    b.classList.remove('border-green-500', 'bg-green-50', 'text-green-700');
                    b.classList.add('border-gray-200', 'text-gray-600');
                });
                btn.classList.add('border-green-500', 'bg-green-50', 'text-green-700');
                btn.classList.remove('border-gray-200', 'text-gray-600');
            });
        });
        
        // Set default availability
        document.querySelector('.availability-btn[data-value="10-15 hrs/week"]')?.classList.add('border-green-500', 'bg-green-50', 'text-green-700');
        
        // Form submit
        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const newProject = {
                id: 'project_' + Date.now(),
                type: 'project',
                title: document.getElementById('project-title').value,
                description: document.getElementById('project-description').value,
                teamNeeds: teamNeeds,
                workStyle: workStyles,
                skills: [], // Empty skills for new projects
                goals: [], // Empty goals for new projects
                availability: availability,
                location: document.getElementById('project-location').value || 'Remote',
                distance: '0 mi',
                distanceValue: 0,
                postedDate: 'Just now',
                owner: {
                    id: AppData.currentUser.id,
                    name: AppData.currentUser.name,
                    photo: AppData.currentUser.photo
                },
                createdAt: new Date().toISOString(),
                lookingFor: ['Collaborators'],
                privateDocument: null
            };
            
            // Add to AppData
            AppData.projects.push(newProject);
            
            // Save to database
            await Database.saveProject(newProject);
            
            // Add to user's owned projects
            if (!AppData.currentUser.ownedProjects) {
                AppData.currentUser.ownedProjects = [];
            }
            AppData.currentUser.ownedProjects.push(newProject.id);
            
            // Save current user to database
            await Database.saveCurrentUser(AppData.currentUser);
            
            // Close modal and refresh profile
            Modal.close();
            App.navigateTo('profile');
        });
    },

    close() {
        const container = document.getElementById('modal-container');
        container.innerHTML = '';
    },

    // Show project match modal (called from Browse.handleAction when user clicks Match)
    showProjectMatchModal(user, userProjects) {
        // Store pending match
        this._pendingMatch = { user, userProjects };
        
        // Calculate match scores for each project
        const projectsWithScore = userProjects.map(project => {
            return {
                project: project,
                score: Browse.calculateMatchScore(project, user)
            };
        });
        
        // Sort by score (highest first)
        projectsWithScore.sort((a, b) => b.score - a.score);
        
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
        
        const html = `
            <div class="modal-overlay" onclick="event.target === this && Modal.closeProjectMatch()">
                <div class="modal-content w-full max-w-lg mx-4 max-h-[90vh] overflow-y-auto">
                    <button onclick="Modal.closeProjectMatch()" class="absolute top-4 right-4 w-10 h-10 bg-white rounded-full shadow-lg flex items-center justify-center text-gray-500 hover:text-gray-700 z-10">
                        <i class="ph ph-x text-xl"></i>
                    </button>
                    
                    <div class="p-6">
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
                        
                        <button onclick="Modal.skipProjectMatch()" class="w-full py-3 border-2 border-gray-300 text-gray-600 font-semibold rounded-xl hover:bg-gray-50 transition">
                            Skip - Like without a Project
                        </button>
                    </div>
                </div>
            </div>
        `;
        
        const container = document.getElementById('modal-container');
        container.innerHTML = html;
    },
    
    closeProjectMatch() {
        const container = document.getElementById('modal-container');
        container.innerHTML = '';
        this._pendingMatch = null;
    },

    closeMatch() {
        const popup = document.getElementById('match-popup');
        popup.classList.add('hidden');
        popup.innerHTML = '';
    }
};

// Make Modal available globally
window.Modal = Modal;

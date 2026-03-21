// Card Component - New Design with Goals, Work Style, Skills, Location

const Card = {
    createUserCard(user, index) {
        // Skill visualization - horizontal bar chart
        const skillsHTML = user.skills.map(skill => `
            <div class="flex items-center gap-2 mb-1">
                <span class="text-xs text-gray-600 w-20 truncate">${skill.name}</span>
                <div class="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div class="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full" style="width: ${skill.level}%"></div>
                </div>
                <span class="text-xs text-gray-400 w-8">${skill.level}%</span>
            </div>
        `).join('');

        // Goals as tags
        const goalsHTML = user.goals.map(goal => 
            `<span class="skill-tag bg-indigo-50 text-indigo-700">${goal}</span>`
        ).join('');

        // Work style as badges
        const workStyleHTML = user.workStyle.map(style => 
            `<span class="px-2 py-1 bg-green-50 text-green-700 rounded-full text-xs font-medium">${style}</span>`
        ).join('');

        return `
            <div class="swipe-card" data-id="${user.id}" data-index="${index}" data-type="user">
                <!-- Photo & Location -->
                <div class="relative">
                    <img src="${user.photo}" alt="${user.name}" class="card-image">
                    <div class="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-black/70 to-transparent"></div>
                    <div class="absolute bottom-3 left-4 right-4">
                        <div class="flex items-center gap-2 text-white">
                            <i class="ph ph-map-pin"></i>
                            <span class="text-sm">${user.location}</span>
                            <span class="text-xs bg-white/20 px-2 py-0.5 rounded-full">${user.distance}</span>
                        </div>
                    </div>
                </div>
                
                <div class="p-4">
                    <h3 class="text-xl font-bold text-gray-800">${user.name}</h3>
                    
                    <!-- Work Style & Availability -->
                    <div class="flex flex-wrap gap-2 mt-2 mb-3">
                        ${workStyleHTML}
                        <span class="px-2 py-1 bg-blue-50 text-blue-700 rounded-full text-xs font-medium">
                            <i class="ph ph-clock mr-1"></i>${user.availability}
                        </span>
                    </div>
                    
                    <!-- Bio -->
                    <p class="text-gray-600 text-sm mb-3 line-clamp-2">${user.bio}</p>
                    
                    <!-- Goals -->
                    <div class="mb-3">
                        <span class="text-xs font-medium text-gray-500 uppercase tracking-wide">Goals</span>
                        <div class="flex flex-wrap gap-1 mt-1">
                            ${goalsHTML}
                        </div>
                    </div>
                    
                    <!-- Skills Visualization -->
                    <div>
                        <span class="text-xs font-medium text-gray-500 uppercase tracking-wide">Skills</span>
                        <div class="mt-1">
                            ${skillsHTML}
                        </div>
                    </div>
                </div>
                
                <div class="swipe-label like">INTERESTED</div>
                <div class="swipe-label dislike">PASS</div>
            </div>
        `;
    },

    createProjectCard(project, index) {
        // Skill visualization
        const skillsHTML = project.skills.map(skill => `
            <div class="flex items-center gap-2 mb-1">
                <span class="text-xs text-gray-600 w-20 truncate">${skill.name}</span>
                <div class="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div class="h-full bg-gradient-to-r from-green-500 to-emerald-500 rounded-full" style="width: ${skill.level}%"></div>
                </div>
                <span class="text-xs text-gray-400 w-8">${skill.level}%</span>
            </div>
        `).join('');

        // Goals as tags
        const goalsHTML = project.goals.map(goal => 
            `<span class="skill-tag bg-green-50 text-green-700">${goal}</span>`
        ).join('');

        // Work style
        const workStyleHTML = project.workStyle.map(style => 
            `<span class="px-2 py-1 bg-purple-50 text-purple-700 rounded-full text-xs font-medium">${style}</span>`
        ).join('');

        // Team needs
        const teamNeedsHTML = project.teamNeeds.map(need => 
            `<span class="px-2 py-1 bg-orange-50 text-orange-700 rounded-full text-xs font-medium">${need}</span>`
        ).join('');

        return `
            <div class="swipe-card" data-id="${project.id}" data-index="${index}" data-type="project">
                <!-- Project Image -->
                <div class="relative">
                    <div class="card-image-placeholder bg-gradient-to-r from-green-500 to-emerald-500">
                        <i class="ph ph-rocket-launch text-6xl text-white/50"></i>
                    </div>
                    <div class="absolute top-4 left-4">
                        <span class="px-3 py-1 bg-green-600 text-white text-xs font-bold rounded-full">PROJECT</span>
                    </div>
                    <div class="absolute bottom-3 left-4 right-4">
                        <div class="flex items-center gap-2 text-white">
                            <i class="ph ph-map-pin"></i>
                            <span class="text-sm">${project.location}</span>
                            <span class="text-xs bg-white/20 px-2 py-0.5 rounded-full">${project.distance}</span>
                        </div>
                    </div>
                </div>
                
                <div class="p-4">
                    <h3 class="text-xl font-bold text-gray-800">${project.title}</h3>
                    <div class="flex items-center gap-2 mt-1">
                        <img src="${project.owner.photo}" alt="${project.owner.name}" class="w-5 h-5 rounded-full">
                        <span class="text-sm text-gray-600">${project.owner.name}</span>
                    </div>
                    
                    <!-- Work Style -->
                    <div class="flex flex-wrap gap-2 mt-2 mb-3">
                        ${workStyleHTML}
                    </div>
                    
                    <!-- Description -->
                    <p class="text-gray-600 text-sm mb-3">${project.description}</p>
                    
                    <!-- Goals -->
                    <div class="mb-3">
                        <span class="text-xs font-medium text-gray-500 uppercase tracking-wide">Goals</span>
                        <div class="flex flex-wrap gap-1 mt-1">
                            ${goalsHTML}
                        </div>
                    </div>
                    
                    <!-- Team Needs -->
                    <div class="mb-3">
                        <span class="text-xs font-medium text-gray-500 uppercase tracking-wide">Looking For</span>
                        <div class="flex flex-wrap gap-1 mt-1">
                            ${teamNeedsHTML}
                        </div>
                    </div>
                    
                    <!-- Skills -->
                    <div>
                        <span class="text-xs font-medium text-gray-500 uppercase tracking-wide">Tech Stack</span>
                        <div class="mt-1">
                            ${skillsHTML}
                        </div>
                    </div>
                </div>
                
                <div class="swipe-label like">INTERESTED</div>
                <div class="swipe-label dislike">PASS</div>
            </div>
        `;
    },

    createEmptyState(filterType) {
        const icon = filterType === 'projects' ? 'ph-rocket-launch' : 'ph-users';
        const title = filterType === 'projects' ? 'No More Projects' : 'No More Collaborators';
        const message = filterType === 'projects' 
            ? 'You\'ve seen all nearby projects. Check back later for new opportunities!'
            : 'You\'ve seen all nearby collaborators. Check back later for new matches!';
        
        return `
            <div class="empty-state">
                <i class="ph ${icon}"></i>
                <h3>${title}</h3>
                <p>${message}</p>
                <button onclick="Swiper.resetFilter()" class="mt-4 px-6 py-2 bg-indigo-600 text-white rounded-full hover:bg-indigo-700 transition">
                    Browse ${filterType === 'projects' ? 'Collaborators' : 'Projects'}
                </button>
            </div>
        `;
    }
};

// Make Card available globally
window.Card = Card;

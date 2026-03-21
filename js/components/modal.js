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
                            ${!isProject ? `<img src="${item.photo}" alt="${item.name}" class="w-16 h-16 rounded-full border-4 border-white shadow-md">` : ''}
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

    showProfileModal(user) {
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

        const html = `
            <div class="modal-overlay" onclick="event.target === this && Modal.close()">
                <div class="modal-content w-full max-w-lg mx-4 max-h-[90vh] overflow-y-auto">
                    <button onclick="Modal.close()" class="absolute top-4 right-4 w-10 h-10 bg-white rounded-full shadow-lg flex items-center justify-center text-gray-500 hover:text-gray-700 z-10">
                        <i class="ph ph-x text-xl"></i>
                    </button>
                    
                    <div class="relative">
                        <div class="w-full h-32 bg-gradient-to-r from-indigo-600 to-purple-600"></div>
                        <div class="absolute -bottom-12 left-6">
                            <img src="${user.photo}" alt="${user.name}" class="w-24 h-24 rounded-full border-4 border-white shadow-md">
                        </div>
                    </div>
                    
                    <div class="p-5 pt-16">
                        <div class="flex items-start justify-between mb-4">
                            <div>
                                <h2 class="text-2xl font-bold text-gray-800">${user.name}</h2>
                            </div>
                            <button class="px-4 py-2 bg-indigo-600 text-white text-sm rounded-lg hover:bg-indigo-700 transition">
                                <i class="ph ph-pencil"></i> Edit
                            </button>
                        </div>
                        
                        <!-- Location -->
                        <div class="flex items-center gap-2 text-sm text-gray-600 mb-4">
                            <i class="ph ph-map-pin"></i>
                            <span>${user.location}</span>
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
                        
                        <div class="border-t pt-4">
                            <h3 class="font-semibold text-gray-800 mb-3">Stats</h3>
                            <div class="grid grid-cols-3 gap-4 text-center">
                                <div class="p-3 bg-gray-50 rounded-lg">
                                    <div class="text-2xl font-bold text-indigo-600">${AppData.matches.length}</div>
                                    <div class="text-xs text-gray-500">Matches</div>
                                </div>
                                <div class="p-3 bg-gray-50 rounded-lg">
                                    <div class="text-2xl font-bold text-indigo-600">${AppData.swiped.users.length}</div>
                                    <div class="text-xs text-gray-500">Viewed</div>
                                </div>
                                <div class="p-3 bg-gray-50 rounded-lg">
                                    <div class="text-2xl font-bold text-indigo-600">${user.skills.length}</div>
                                    <div class="text-xs text-gray-500">Skills</div>
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

    showMatch(item) {
        const popup = document.getElementById('match-popup');
        
        const html = `
            <div class="text-center">
                <h2 class="text-4xl font-bold mb-4">It's a Match! 🎉</h2>
                <p class="text-gray-300 mb-2">You and ${item.name || item.title} are both interested!</p>
                <p class="text-indigo-300 text-sm mb-6">24-hour chat opened</p>
                
                <div class="flex items-center justify-center gap-4 mb-8">
                    <div class="w-28 h-28 rounded-full overflow-hidden border-4 border-white">
                        <img src="${AppData.currentUser.photo}" alt="You" class="w-full h-full object-cover">
                    </div>
                    <i class="ph ph-heart text-4xl text-red-500"></i>
                    <div class="w-28 h-28 rounded-full overflow-hidden border-4 border-white">
                        <img src="${item.photo || item.owner?.photo}" alt="${item.name || item.title}" class="w-full h-full object-cover">
                    </div>
                </div>
                
                <div class="bg-white/10 rounded-xl p-4 mb-6 max-w-xs mx-auto">
                    <p class="text-sm text-gray-300">Your 24-hour structured chat has opened. Use the guided prompts to get to know each other!</p>
                </div>
                
                <div class="flex flex-col gap-3">
                    <button onclick="Modal.closeMatch(); App.navigateTo('messages');" class="px-8 py-3 bg-white text-indigo-600 font-semibold rounded-full hover:bg-gray-100 transition">
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

    close() {
        const container = document.getElementById('modal-container');
        container.innerHTML = '';
    },

    closeMatch() {
        const popup = document.getElementById('match-popup');
        popup.classList.add('hidden');
        popup.innerHTML = '';
    }
};

// Make Modal available globally
window.Modal = Modal;

// Signup Screen Component - Profile creation with skill trees

const Signup = {
    // Form state
    formData: {
        name: '',
        photo: '',
        bio: '',
        location: '',
        availability: '10-15 hrs/week',
        goals: [],
        workStyle: [],
        lookingFor: [],
        skills: [],
        skillTrees: [],
        privateDocument: {
            title: '',
            content: '',
            isPublic: false
        }
    },
    
    // Predefined options
    options: {
        availabilities: ['5-10 hrs/week', '10-15 hrs/week', '15-20 hrs/week', '20+ hrs/week'],
        workStyles: ['Deep Work', 'Async', 'Collaborative', 'Casual', 'Flexible', 'Agile'],
        goalOptions: ['Build a startup', 'Find co-founder', 'Build side projects', 'Learn new skills', 'Meet like-minded people', 'Freelance', 'Network', 'Open source'],
        lookingForOptions: ['Projects', 'Collaborators'],
        skillOptions: [
            { name: 'JavaScript', category: 'Frontend' },
            { name: 'TypeScript', category: 'Frontend' },
            { name: 'React', category: 'Frontend' },
            { name: 'Vue.js', category: 'Frontend' },
            { name: 'Angular', category: 'Frontend' },
            { name: 'HTML/CSS', category: 'Frontend' },
            { name: 'Node.js', category: 'Backend' },
            { name: 'Python', category: 'Backend' },
            { name: 'Java', category: 'Backend' },
            { name: 'Go', category: 'Backend' },
            { name: 'Rust', category: 'Backend' },
            { name: 'PostgreSQL', category: 'Backend' },
            { name: 'MongoDB', category: 'Backend' },
            { name: 'AWS', category: 'DevOps' },
            { name: 'Docker', category: 'DevOps' },
            { name: 'Kubernetes', category: 'DevOps' },
            { name: 'DevOps', category: 'DevOps' },
            { name: 'Machine Learning', category: 'AI/ML' },
            { name: 'Data Science', category: 'AI/ML' },
            { name: 'AI/ML', category: 'AI/ML' },
            { name: 'Product', category: 'Business' },
            { name: 'Strategy', category: 'Business' },
            { name: 'Marketing', category: 'Business' },
            { name: 'Sales', category: 'Business' },
            { name: 'UI/UX', category: 'Design' },
            { name: 'Mobile Dev', category: 'Mobile' },
            { name: 'React Native', category: 'Mobile' }
        ]
    },
    
    currentStep: 0,
    totalSteps: 5,
    
    render() {
        const main = document.querySelector('main');
        main.className = 'pt-20 pb-24';
        
        main.innerHTML = `
            <section class="min-h-screen bg-gray-50 px-4 py-6">
                <div class="max-w-lg mx-auto">
                    <!-- Progress Bar -->
                    <div class="mb-8">
                        <div class="flex justify-between mb-2">
                            <span class="text-sm font-medium text-gray-600">Step ${this.currentStep + 1} of ${this.totalSteps}</span>
                            <span class="text-sm font-medium text-indigo-600">${Math.round(((this.currentStep + 1) / this.totalSteps) * 100)}%</span>
                        </div>
                        <div class="h-2 bg-gray-200 rounded-full overflow-hidden">
                            <div class="h-full bg-indigo-600 rounded-full transition-all duration-300" style="width: ${((this.currentStep + 1) / this.totalSteps) * 100}%"></div>
                        </div>
                    </div>
                    
                    <!-- Form Card -->
                    <div class="bg-white rounded-2xl shadow-sm p-6">
                        ${this.renderCurrentStep()}
                    </div>
                </div>
            </section>
        `;
        
        this.setupEventListeners();
    },
    
    renderCurrentStep() {
        switch(this.currentStep) {
            case 0:
                return this.renderBasicInfo();
            case 1:
                return this.renderGoalsWorkStyle();
            case 2:
                return this.renderSkillTrees();
            case 3:
                return this.renderPrivateDocument();
            case 4:
                return this.renderReview();
            default:
                return this.renderBasicInfo();
        }
    },
    
    renderBasicInfo() {
        return `
            <div class="animate-fade-in">
                <h2 class="text-2xl font-bold text-gray-800 mb-2">Create Your Profile</h2>
                <p class="text-gray-600 mb-6">Let's start with the basics.</p>
                
                <!-- Photo Upload -->
                <div class="mb-6">
                    <label class="block text-sm font-medium text-gray-700 mb-2">Profile Photo</label>
                    <div class="flex items-center gap-4">
                        <div class="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center overflow-hidden">
                            <img id="signup-photo-preview" src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&crop=face" class="w-full h-full object-cover">
                        </div>
                        <input type="text" id="signup-photo" placeholder="Enter photo URL" value="${this.formData.photo}" 
                            class="flex-1 px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent">
                    </div>
                </div>
                
                <!-- Name -->
                <div class="mb-4">
                    <label class="block text-sm font-medium text-gray-700 mb-2">Name</label>
                    <input type="text" id="signup-name" placeholder="Your name" value="${this.formData.name}"
                        class="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent">
                </div>
                
                <!-- Location -->
                <div class="mb-4">
                    <label class="block text-sm font-medium text-gray-700 mb-2">Location</label>
                    <input type="text" id="signup-location" placeholder="City, State" value="${this.formData.location}"
                        class="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent">
                </div>
                
                <!-- Availability -->
                <div class="mb-6">
                    <label class="block text-sm font-medium text-gray-700 mb-2">Availability</label>
                    <div class="grid grid-cols-2 gap-2">
                        ${this.options.availabilities.map(opt => `
                            <button class="availability-btn px-4 py-2 rounded-lg border text-sm font-medium transition ${this.formData.availability === opt ? 'border-indigo-500 bg-indigo-50 text-indigo-700' : 'border-gray-200 text-gray-600 hover:border-indigo-300'}" data-value="${opt}">
                                ${opt}
                            </button>
                        `).join('')}
                    </div>
                </div>
                
                <!-- Bio -->
                <div class="mb-6">
                    <label class="block text-sm font-medium text-gray-700 mb-2">Bio</label>
                    <textarea id="signup-bio" rows="3" placeholder="Tell others about yourself..." 
                        class="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none">${this.formData.bio}</textarea>
                </div>
                
                ${this.renderNavigation(false)}
            </div>
        `;
    },
    
    renderGoalsWorkStyle() {
        return `
            <div class="animate-fade-in">
                <h2 class="text-2xl font-bold text-gray-800 mb-2">Goals & Work Style</h2>
                <p class="text-gray-600 mb-6">What do you want to achieve?</p>
                
                <!-- Goals -->
                <div class="mb-6">
                    <label class="block text-sm font-medium text-gray-700 mb-2">Your Goals (select all that apply)</label>
                    <div class="flex flex-wrap gap-2">
                        ${this.options.goalOptions.map(goal => `
                            <button class="goal-btn px-3 py-2 rounded-full border text-sm font-medium transition ${this.formData.goals.includes(goal) ? 'border-indigo-500 bg-indigo-50 text-indigo-700' : 'border-gray-200 text-gray-600 hover:border-indigo-300'}" data-value="${goal}">
                                ${goal}
                            </button>
                        `).join('')}
                    </div>
                </div>
                
                <!-- Work Style -->
                <div class="mb-6">
                    <label class="block text-sm font-medium text-gray-700 mb-2">Work Style (select all that apply)</label>
                    <div class="flex flex-wrap gap-2">
                        ${this.options.workStyles.map(style => `
                            <button class="workstyle-btn px-3 py-2 rounded-full border text-sm font-medium transition ${this.formData.workStyle.includes(style) ? 'border-green-500 bg-green-50 text-green-700' : 'border-gray-200 text-gray-600 hover:border-green-300'}" data-value="${style}">
                                ${style}
                            </button>
                        `).join('')}
                    </div>
                </div>
                
                <!-- Looking For -->
                <div class="mb-6">
                    <label class="block text-sm font-medium text-gray-700 mb-2">Looking For</label>
                    <div class="flex gap-2">
                        ${this.options.lookingForOptions.map(opt => `
                            <button class="lookingfor-btn flex-1 px-4 py-2 rounded-lg border text-sm font-medium transition ${this.formData.lookingFor.includes(opt) ? 'border-indigo-500 bg-indigo-50 text-indigo-700' : 'border-gray-200 text-gray-600 hover:border-indigo-300'}" data-value="${opt}">
                                ${opt}
                            </button>
                        `).join('')}
                    </div>
                </div>
                
                ${this.renderNavigation(true)}
            </div>
        `;
    },
    
    renderSkillTrees() {
        return `
            <div class="animate-fade-in">
                <h2 class="text-2xl font-bold text-gray-800 mb-2">Skill Trees</h2>
                <p class="text-gray-600 mb-6">Organize your skills by category.</p>
                
                <!-- Skill Trees Container -->
                <div id="skill-trees-container" class="space-y-4 mb-6">
                    ${this.formData.skillTrees.length === 0 ? `
                        <div class="text-center py-8 bg-gray-50 rounded-xl">
                            <i class="ph ph-tree-structure text-4xl text-gray-300 mb-2"></i>
                            <p class="text-gray-500">No skill trees yet</p>
                        </div>
                    ` : this.formData.skillTrees.map((tree, index) => this.renderSkillTree(index)).join('')}
                </div>
                
                <!-- Add Skill Tree -->
                <div class="mb-6">
                    <label class="block text-sm font-medium text-gray-700 mb-2">Add New Skill Tree</label>
                    <div class="flex gap-2">
                        <input type="text" id="new-skill-tree-name" placeholder="e.g., Frontend Development" 
                            class="flex-1 px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent">
                        <button id="add-skill-tree-btn" class="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition">
                            <i class="ph ph-plus"></i>
                        </button>
                    </div>
                </div>
                
                <!-- Quick Add Skills -->
                <div class="mb-6">
                    <label class="block text-sm font-medium text-gray-700 mb-2">Quick Add Skills</label>
                    <div class="flex flex-wrap gap-2 max-h-32 overflow-y-auto">
                        ${this.options.skillOptions.map(skill => `
                            <button class="quick-skill-btn px-2 py-1 rounded border text-xs font-medium transition ${this.isSkillAdded(skill.name) ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'border-gray-200 text-gray-600 hover:border-indigo-300'}" data-name="${skill.name}" ${this.isSkillAdded(skill.name) ? 'disabled' : ''}>
                                ${skill.name}
                            </button>
                        `).join('')}
                    </div>
                </div>
                
                ${this.renderNavigation(true)}
            </div>
        `;
    },
    
    renderSkillTree(index) {
        const tree = this.formData.skillTrees[index];
        return `
            <div class="border border-gray-200 rounded-xl p-4">
                <div class="flex items-center justify-between mb-3">
                    <input type="text" class="text-lg font-semibold text-gray-800 bg-transparent border-b border-transparent hover:border-gray-300 focus:border-indigo-500 focus:outline-none" 
                        value="${tree.name}" data-tree-index="${index}" data-field="name" placeholder="Tree Name">
                    <button class="remove-tree-btn text-red-500 hover:text-red-700" data-tree-index="${index}">
                        <i class="ph ph-trash text-lg"></i>
                    </button>
                </div>
                <div class="space-y-2">
                    ${tree.skills.map((skill, skillIndex) => `
                        <div class="flex items-center gap-2">
                            <input type="text" value="${skill.name}" data-tree-index="${index}" data-skill-index="${skillIndex}" data-field="name"
                                class="flex-1 px-3 py-1 text-sm border border-gray-200 rounded focus:ring-1 focus:ring-indigo-500 focus:border-transparent" placeholder="Skill name">
                            <input type="range" min="0" max="100" value="${skill.level}" data-tree-index="${index}" data-skill-index="${index}" data-field="level"
                                class="w-20 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer skill-slider">
                            <span class="text-xs text-gray-500 w-8 level-display">${skill.level}%</span>
                            <button class="remove-skill-btn text-gray-400 hover:text-red-500" data-tree-index="${index}" data-skill-index="${skillIndex}">
                                <i class="ph ph-x"></i>
                            </button>
                        </div>
                    `).join('')}
                    <button class="add-skill-to-tree-btn text-sm text-indigo-600 hover:text-indigo-700 flex items-center gap-1" data-tree-index="${index}">
                        <i class="ph ph-plus"></i> Add Skill
                    </button>
                </div>
            </div>
        `;
    },
    
    isSkillAdded(skillName) {
        for (const tree of this.formData.skillTrees) {
            for (const skill of tree.skills) {
                if (skill.name === skillName) return true;
            }
        }
        return false;
    },
    
    renderPrivateDocument() {
        return `
            <div class="animate-fade-in">
                <h2 class="text-2xl font-bold text-gray-800 mb-2">Private Document</h2>
                <p class="text-gray-600 mb-6">Add details that will only be shared upon request.</p>
                
                <div class="bg-yellow-50 border border-yellow-200 rounded-xl p-4 mb-6">
                    <div class="flex items-start gap-3">
                        <i class="ph ph-lock text-yellow-600 text-xl mt-0.5"></i>
                        <div>
                            <h4 class="font-medium text-yellow-800">Private Information</h4>
                            <p class="text-sm text-yellow-700">This document is hidden from your public profile. Other users can request to view it after expressing interest.</p>
                        </div>
                    </div>
                </div>
                
                <!-- Document Title -->
                <div class="mb-4">
                    <label class="block text-sm font-medium text-gray-700 mb-2">Document Title</label>
                    <input type="text" id="private-doc-title" placeholder="e.g., Portfolio, Case Studies, Certificates" value="${this.formData.privateDocument.title}"
                        class="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent">
                </div>
                
                <!-- Document Content -->
                <div class="mb-6">
                    <label class="block text-sm font-medium text-gray-700 mb-2">Content</label>
                    <textarea id="private-doc-content" rows="6" placeholder="Describe your private documents, portfolio links, case studies, etc. This will only be visible to those you approve..." 
                        class="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none">${this.formData.privateDocument.content}</textarea>
                </div>
                
                ${this.renderNavigation(true)}
            </div>
        `;
    },
    
    renderReview() {
        // Convert skill trees to flat skills array for display
        const flatSkills = [];
        for (const tree of this.formData.skillTrees) {
            for (const skill of tree.skills) {
                flatSkills.push(skill);
            }
        }
        
        return `
            <div class="animate-fade-in">
                <h2 class="text-2xl font-bold text-gray-800 mb-2">Review Your Profile</h2>
                <p class="text-gray-600 mb-6">Make sure everything looks good!</p>
                
                <!-- Profile Summary -->
                <div class="space-y-4">
                    <!-- Photo & Name -->
                    <div class="flex items-center gap-4 p-4 bg-gray-50 rounded-xl">
                        <img src="${this.formData.photo || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&crop=face'}" class="w-16 h-16 rounded-full object-cover">
                        <div>
                            <h3 class="text-lg font-bold text-gray-800">${this.formData.name || 'Your Name'}</h3>
                            <p class="text-sm text-gray-500">${this.formData.location || 'Location'}</p>
                        </div>
                    </div>
                    
                    <!-- Bio -->
                    <div class="p-4 bg-gray-50 rounded-xl">
                        <h4 class="text-sm font-medium text-gray-500 mb-1">Bio</h4>
                        <p class="text-gray-700">${this.formData.bio || 'No bio added'}</p>
                    </div>
                    
                    <!-- Goals -->
                    <div class="p-4 bg-gray-50 rounded-xl">
                        <h4 class="text-sm font-medium text-gray-500 mb-2">Goals</h4>
                        <div class="flex flex-wrap gap-2">
                            ${this.formData.goals.length > 0 ? this.formData.goals.map(goal => `<span class="px-3 py-1 bg-indigo-50 text-indigo-700 rounded-full text-sm">${goal}</span>`).join('') : '<span class="text-gray-400">No goals selected</span>'}
                        </div>
                    </div>
                    
                    <!-- Work Style -->
                    <div class="p-4 bg-gray-50 rounded-xl">
                        <h4 class="text-sm font-medium text-gray-500 mb-2">Work Style</h4>
                        <div class="flex flex-wrap gap-2">
                            ${this.formData.workStyle.length > 0 ? this.formData.workStyle.map(style => `<span class="px-3 py-1 bg-green-50 text-green-700 rounded-full text-sm">${style}</span>`).join('') : '<span class="text-gray-400">No work style selected</span>'}
                        </div>
                    </div>
                    
                    <!-- Skill Trees -->
                    <div class="p-4 bg-gray-50 rounded-xl">
                        <h4 class="text-sm font-medium text-gray-500 mb-2">Skills (${flatSkills.length})</h4>
                        <div class="space-y-2">
                            ${this.formData.skillTrees.length > 0 ? this.formData.skillTrees.map(tree => `
                                <div>
                                    <p class="text-xs font-medium text-indigo-600 mb-1">${tree.name}</p>
                                    <div class="flex flex-wrap gap-1">
                                        ${tree.skills.map(skill => `<span class="px-2 py-0.5 bg-white border border-gray-200 rounded text-xs">${skill.name} (${skill.level}%)</span>`).join('')}
                                    </div>
                                </div>
                            `).join('') : '<span class="text-gray-400">No skills added</span>'}
                        </div>
                    </div>
                    
                    <!-- Private Document -->
                    <div class="p-4 bg-gray-50 rounded-xl">
                        <h4 class="text-sm font-medium text-gray-500 mb-2">Private Document</h4>
                        <p class="text-gray-700 font-medium">${this.formData.privateDocument.title || 'No title'}</p>
                        <p class="text-sm text-gray-500 line-clamp-2">${this.formData.privateDocument.content || 'No content'}</p>
                    </div>
                </div>
                
                ${this.renderNavigation(true, true)}
            </div>
        `;
    },
    
    renderNavigation(showBack, isLastStep = false) {
        return `
            <div class="flex gap-3 mt-8">
                ${showBack ? `
                    <button id="signup-back" class="flex-1 py-3 border-2 border-gray-300 text-gray-600 font-semibold rounded-xl hover:bg-gray-50 transition">
                        Back
                    </button>
                ` : ''}
                <button id="signup-next" class="flex-1 py-3 ${showBack ? '' : 'w-full'} bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold rounded-xl hover:shadow-lg transition">
                    ${isLastStep ? 'Create Profile' : 'Continue'}
                </button>
            </div>
        `;
    },
    
    setupEventListeners() {
        // Photo URL input
        const photoInput = document.getElementById('signup-photo');
        if (photoInput) {
            photoInput.addEventListener('input', (e) => {
                this.formData.photo = e.target.value;
                const preview = document.getElementById('signup-photo-preview');
                if (preview && e.target.value) {
                    preview.src = e.target.value;
                }
            });
        }
        
        // Name input
        const nameInput = document.getElementById('signup-name');
        if (nameInput) {
            nameInput.addEventListener('input', (e) => {
                this.formData.name = e.target.value;
            });
        }
        
        // Location input
        const locationInput = document.getElementById('signup-location');
        if (locationInput) {
            locationInput.addEventListener('input', (e) => {
                this.formData.location = e.target.value;
            });
        }
        
        // Bio input
        const bioInput = document.getElementById('signup-bio');
        if (bioInput) {
            bioInput.addEventListener('input', (e) => {
                this.formData.bio = e.target.value;
            });
        }
        
        // Availability buttons
        document.querySelectorAll('.availability-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                this.formData.availability = btn.dataset.value;
                this.render();
            });
        });
        
        // Goal buttons
        document.querySelectorAll('.goal-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const goal = btn.dataset.value;
                if (this.formData.goals.includes(goal)) {
                    this.formData.goals = this.formData.goals.filter(g => g !== goal);
                } else {
                    this.formData.goals.push(goal);
                }
                this.render();
            });
        });
        
        // Work style buttons
        document.querySelectorAll('.workstyle-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const style = btn.dataset.value;
                if (this.formData.workStyle.includes(style)) {
                    this.formData.workStyle = this.formData.workStyle.filter(s => s !== style);
                } else {
                    this.formData.workStyle.push(style);
                }
                this.render();
            });
        });
        
        // Looking for buttons
        document.querySelectorAll('.lookingfor-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const opt = btn.dataset.value;
                if (this.formData.lookingFor.includes(opt)) {
                    this.formData.lookingFor = this.formData.lookingFor.filter(o => o !== opt);
                } else {
                    this.formData.lookingFor.push(opt);
                }
                this.render();
            });
        });
        
        // Add skill tree button
        const addSkillTreeBtn = document.getElementById('add-skill-tree-btn');
        if (addSkillTreeBtn) {
            addSkillTreeBtn.addEventListener('click', () => {
                const input = document.getElementById('new-skill-tree-name');
                if (input && input.value.trim()) {
                    this.formData.skillTrees.push({
                        name: input.value.trim(),
                        skills: []
                    });
                    input.value = '';
                    this.render();
                }
            });
        }
        
        // Quick add skill buttons
        document.querySelectorAll('.quick-skill-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                if (btn.disabled) return;
                const skillName = btn.dataset.name;
                // Add to first tree or create new tree
                if (this.formData.skillTrees.length === 0) {
                    this.formData.skillTrees.push({
                        name: 'My Skills',
                        skills: [{ name: skillName, level: 50 }]
                    });
                } else {
                    this.formData.skillTrees[0].skills.push({ name: skillName, level: 50 });
                }
                this.render();
            });
        });
        
        // Skill tree inputs (delegated)
        document.querySelectorAll('.remove-tree-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const index = parseInt(btn.dataset.treeIndex);
                this.formData.skillTrees.splice(index, 1);
                this.render();
            });
        });
        
        // Navigation buttons
        const nextBtn = document.getElementById('signup-next');
        if (nextBtn) {
            nextBtn.addEventListener('click', () => {
                if (this.currentStep < this.totalSteps - 1) {
                    this.currentStep++;
                    this.render();
                } else {
                    this.submitProfile();
                }
            });
        }
        
        const backBtn = document.getElementById('signup-back');
        if (backBtn) {
            backBtn.addEventListener('click', () => {
                if (this.currentStep > 0) {
                    this.currentStep--;
                    this.render();
                }
            });
        }
        
        // Private document inputs
        const docTitle = document.getElementById('private-doc-title');
        if (docTitle) {
            docTitle.addEventListener('input', (e) => {
                this.formData.privateDocument.title = e.target.value;
            });
        }
        
        const docContent = document.getElementById('private-doc-content');
        if (docContent) {
            docContent.addEventListener('input', (e) => {
                this.formData.privateDocument.content = e.target.value;
            });
        }
        
        // Skill tree dynamic inputs
        document.querySelectorAll('.remove-skill-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const treeIndex = parseInt(btn.dataset.treeIndex);
                const skillIndex = parseInt(btn.dataset.skillIndex);
                this.formData.skillTrees[treeIndex].skills.splice(skillIndex, 1);
                this.render();
            });
        });
        
        document.querySelectorAll('.add-skill-to-tree-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const treeIndex = parseInt(btn.dataset.treeIndex);
                this.formData.skillTrees[treeIndex].skills.push({ name: '', level: 50 });
                this.render();
            });
        });
        
        // Skill tree field updates
        document.querySelectorAll('[data-tree-index][data-field]').forEach(input => {
            input.addEventListener('input', (e) => {
                const treeIndex = parseInt(e.target.dataset.treeIndex);
                const field = e.target.dataset.field;
                if (field === 'name') {
                    this.formData.skillTrees[treeIndex].name = e.target.value;
                }
            });
        });
        
        document.querySelectorAll('.skill-slider').forEach(slider => {
            slider.addEventListener('input', (e) => {
                const treeIndex = parseInt(e.target.dataset.skillIndex);
                const level = parseInt(e.target.value);
                if (this.formData.skillTrees[treeIndex] && this.formData.skillTrees[treeIndex].skills[0]) {
                    this.formData.skillTrees[treeIndex].skills[0].level = level;
                    e.target.nextElementSibling.textContent = level + '%';
                }
            });
        });
    },
    
    submitProfile() {
        // Create new user object
        const flatSkills = [];
        for (const tree of this.formData.skillTrees) {
            for (const skill of tree.skills) {
                if (skill.name) flatSkills.push(skill);
            }
        }
        
        // Update AppData.currentUser
        AppData.currentUser = {
            id: 'user-1',
            name: this.formData.name || 'Anonymous User',
            photo: this.formData.photo || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&crop=face',
            bio: this.formData.bio || '',
            location: this.formData.location || '',
            availability: this.formData.availability,
            goals: this.formData.goals,
            workStyle: this.formData.workStyle,
            lookingFor: this.formData.lookingFor,
            skills: flatSkills,
            skillTrees: this.formData.skillTrees,
            privateDocument: {
                title: this.formData.privateDocument.title || 'My Portfolio',
                content: this.formData.privateDocument.content || '',
                isPublic: false
            },
            distance: '0 mi',
            ownedProjects: [],
            interestedProjects: []
        };
        
        // Show success and navigate to discover
        alert('Profile created successfully!');
        
        // Navigate to discover page
        location.reload();
    },
    
    show() {
        this.render();
    }
};

// Make Signup available globally
window.Signup = Signup;

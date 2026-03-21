// Signup/Login Screen Component - Combined auth with tabs

const Auth = {
    activeTab: 'login', // 'login' or 'signup'
    
    // Form state for signup
    signupData: {
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
        photo: '',
        bio: '',
        location: '',
        goals: [],
        workStyle: [],
        lookingFor: ['Projects', 'Collaborators']
    },
    
    // Login form state
    loginData: {
        email: '',
        password: ''
    },
    
    // Predefined options
    options: {
        availabilities: ['5-10 hrs/week', '10-15 hrs/week', '15-20 hrs/week', '20+ hrs/week'],
        workStyles: ['Deep Work', 'Async', 'Collaborative', 'Casual', 'Flexible', 'Agile'],
        goalOptions: ['Build a startup', 'Find co-founder', 'Build side projects', 'Learn new skills', 'Meet like-minded people', 'Freelance', 'Network', 'Open source'],
        lookingForOptions: ['Projects', 'Collaborators']
    },
    
    currentStep: 0,
    totalSteps: 3,
    
    async show() {
        // Always show login page first - don't auto-login
        // User must explicitly log in each time
        
        // Reset signup data when showing auth page (after logout)
        this.signupData = {
            name: '',
            email: '',
            password: '',
            confirmPassword: '',
            photo: '',
            bio: '',
            location: '',
            goals: [],
            workStyle: [],
            lookingFor: ['Projects', 'Collaborators']
        };
        this.currentStep = 0;
        this.activeTab = 'login';
        
        this.render();
    },
    
    render() {
        const main = document.querySelector('main');
        
        // Hide navbar and bottom nav for auth page
        const navbar = document.getElementById('navbar');
        if (navbar) navbar.classList.add('hidden');
        const bottomNav = document.getElementById('bottom-nav');
        if (bottomNav) bottomNav.classList.add('hidden');
        
        main.innerHTML = `
            <section class="min-h-screen bg-gray-50 flex flex-col justify-center px-4 py-8">
                <div class="max-w-md mx-auto w-full">
                    <!-- Logo/Title -->
                    <div class="text-center mb-8">
                        <h1 class="text-3xl font-bold text-indigo-600">CollaMatch</h1>
                        <p class="text-gray-500 mt-2">Find your perfect project partner</p>
                    </div>
                    
                    <!-- Tab Buttons -->
                    <div class="flex bg-gray-200 rounded-xl p-1 mb-6">
                        <button onclick="Auth.switchTab('login')" class="flex-1 py-2 rounded-lg text-sm font-medium transition ${this.activeTab === 'login' ? 'bg-white text-indigo-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}">
                            Login
                        </button>
                        <button onclick="Auth.switchTab('signup')" class="flex-1 py-2 rounded-lg text-sm font-medium transition ${this.activeTab === 'signup' ? 'bg-white text-indigo-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}">
                            Sign Up
                        </button>
                    </div>
                    
                    <!-- Form Card -->
                    <div class="bg-white rounded-2xl shadow-sm p-6">
                        ${this.activeTab === 'login' ? this.renderLoginForm() : this.renderSignupForm()}
                    </div>
                </div>
            </section>
        `;
        
        this.setupEventListeners();
    },
    
    switchTab(tab) {
        this.activeTab = tab;
        this.render();
    },
    
    renderLoginForm() {
        return `
            <div class="animate-fade-in">
                <h2 class="text-2xl font-bold text-gray-800 mb-2">Welcome Back</h2>
                <p class="text-gray-600 mb-6">Sign in to continue</p>
                
                <!-- Email -->
                <div class="mb-4">
                    <label class="block text-sm font-medium text-gray-700 mb-1">Email</label>
                    <input type="email" id="login-email" placeholder="your@email.com" value="${this.loginData.email}"
                        class="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent">
                </div>
                
                <!-- Password -->
                <div class="mb-6">
                    <label class="block text-sm font-medium text-gray-700 mb-1">Password</label>
                    <input type="password" id="login-password" placeholder="Your password" value="${this.loginData.password}"
                        class="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent">
                </div>
                
                <button id="login-btn" class="w-full py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold rounded-xl hover:shadow-lg transition">
                    Login
                </button>
                
                <p class="text-xs text-gray-400 mt-4 text-center">
                    Demo: demo@example.com / password123
                </p>
            </div>
        `;
    },
    
    renderSignupForm() {
        if (this.currentStep === 0) {
            return this.renderSignupBasic();
        } else if (this.currentStep === 1) {
            return this.renderSignupGoals();
        } else {
            return this.renderSignupReview();
        }
    },
    
    renderSignupBasic() {
        return `
            <div class="animate-fade-in">
                <h2 class="text-2xl font-bold text-gray-800 mb-2">Create Account</h2>
                <p class="text-gray-600 mb-6">Let's get started</p>
                
                <!-- Name -->
                <div class="mb-4">
                    <label class="block text-sm font-medium text-gray-700 mb-1">Name</label>
                    <input type="text" id="signup-name" placeholder="Your name" value="${this.signupData.name}"
                        class="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent">
                </div>
                
                <!-- Email -->
                <div class="mb-4">
                    <label class="block text-sm font-medium text-gray-700 mb-1">Email</label>
                    <input type="email" id="signup-email" placeholder="your@email.com" value="${this.signupData.email}"
                        class="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent">
                </div>
                
                <!-- Password -->
                <div class="mb-4">
                    <label class="block text-sm font-medium text-gray-700 mb-1">Password</label>
                    <input type="password" id="signup-password" placeholder="Create password" value="${this.signupData.password}"
                        class="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent">
                </div>
                
                <!-- Confirm Password -->
                <div class="mb-4">
                    <label class="block text-sm font-medium text-gray-700 mb-1">Confirm Password</label>
                    <input type="password" id="signup-confirm-password" placeholder="Confirm password" value="${this.signupData.confirmPassword}"
                        class="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent">
                </div>
                
                <!-- Photo URL -->
                <div class="mb-4">
                    <label class="block text-sm font-medium text-gray-700 mb-1">Photo URL (optional)</label>
                    <input type="text" id="signup-photo" placeholder="https://..." value="${this.signupData.photo}"
                        class="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent">
                </div>
                
                <!-- Location -->
                <div class="mb-4">
                    <label class="block text-sm font-medium text-gray-700 mb-1">Location</label>
                    <input type="text" id="signup-location" placeholder="City, State" value="${this.signupData.location}"
                        class="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent">
                </div>
                
                <button id="signup-next-btn" class="w-full py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold rounded-xl hover:shadow-lg transition">
                    Continue
                </button>
            </div>
        `;
    },
    
    renderSignupGoals() {
        return `
            <div class="animate-fade-in">
                <h2 class="text-2xl font-bold text-gray-800 mb-2">What are you looking for?</h2>
                <p class="text-gray-600 mb-4">Select up to 3 goals</p>
                
                <!-- Goals -->
                <div class="mb-4">
                    <div class="flex flex-wrap gap-2">
                        ${this.options.goalOptions.map(goal => `
                            <button class="goal-btn px-3 py-2 rounded-full border text-sm font-medium transition ${this.signupData.goals.includes(goal) ? 'border-indigo-500 bg-indigo-50 text-indigo-700' : 'border-gray-200 text-gray-600 hover:border-indigo-300'}" data-value="${goal}">
                                ${goal}
                            </button>
                        `).join('')}
                    </div>
                </div>
                
                <!-- Work Style -->
                <div class="mb-4">
                    <label class="block text-sm font-medium text-gray-700 mb-2">Work Style</label>
                    <div class="flex flex-wrap gap-2">
                        ${this.options.workStyles.map(style => `
                            <button class="workstyle-btn px-3 py-2 rounded-full border text-sm font-medium transition ${this.signupData.workStyle.includes(style) ? 'border-green-500 bg-green-50 text-green-700' : 'border-gray-200 text-gray-600 hover:border-green-300'}" data-value="${style}">
                                ${style}
                            </button>
                        `).join('')}
                    </div>
                </div>
                
                <!-- Looking For -->
                <div class="mb-4">
                    <label class="block text-sm font-medium text-gray-700 mb-2">Looking for</label>
                    <div class="flex gap-2">
                        ${this.options.lookingForOptions.map(opt => `
                            <button class="lookingfor-btn flex-1 px-4 py-2 rounded-lg border text-sm font-medium transition ${this.signupData.lookingFor.includes(opt) ? 'border-indigo-500 bg-indigo-50 text-indigo-700' : 'border-gray-200 text-gray-600 hover:border-indigo-300'}" data-value="${opt}">
                                ${opt}
                            </button>
                        `).join('')}
                    </div>
                </div>
                
                <div class="flex gap-3 mt-6">
                    <button id="signup-back" class="flex-1 py-3 border-2 border-gray-300 text-gray-600 font-semibold rounded-xl hover:bg-gray-50 transition">
                        Back
                    </button>
                    <button id="signup-next-btn" class="flex-1 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold rounded-xl hover:shadow-lg transition">
                        Continue
                    </button>
                </div>
            </div>
        `;
    },
    
    renderSignupReview() {
        return `
            <div class="animate-fade-in">
                <h2 class="text-2xl font-bold text-gray-800 mb-2">Review Your Profile</h2>
                <p class="text-gray-600 mb-4">You're almost done!</p>
                
                <div class="space-y-3">
                    <div class="flex items-center gap-4 p-4 bg-gray-50 rounded-xl">
                        <img src="${this.signupData.photo || 'https://ui-avatars.com/api/?name=' + encodeURIComponent(this.signupData.name || 'User') + '&background=6366f1&color=fff&size=200&font-size=0.4&length=1'}" class="w-14 h-14 rounded-full object-cover">
                        <div>
                            <h3 class="text-lg font-bold text-gray-800">${this.signupData.name || 'Your Name'}</h3>
                            <p class="text-sm text-gray-500">${this.signupData.email || 'your@email.com'}</p>
                        </div>
                    </div>
                    
                    <div class="p-3 bg-gray-50 rounded-xl">
                        <p class="text-gray-700 text-sm">${this.signupData.bio || 'No bio'}</p>
                    </div>
                    
                    <div class="p-3 bg-gray-50 rounded-xl">
                        <h4 class="text-xs font-medium text-gray-500 mb-2">Goals</h4>
                        <div class="flex flex-wrap gap-1">
                            ${this.signupData.goals.length > 0 ? this.signupData.goals.map(goal => `<span class="px-2 py-1 bg-indigo-50 text-indigo-700 rounded-full text-xs">${goal}</span>`).join('') : '<span class="text-gray-400 text-xs">No goals selected</span>'}
                        </div>
                    </div>
                    
                    <div class="p-3 bg-gray-50 rounded-xl">
                        <h4 class="text-xs font-medium text-gray-500 mb-2">Work Style</h4>
                        <div class="flex flex-wrap gap-1">
                            ${this.signupData.workStyle.length > 0 ? this.signupData.workStyle.map(style => `<span class="px-2 py-1 bg-green-50 text-green-700 rounded-full text-xs">${style}</span>`).join('') : '<span class="text-gray-400 text-xs">No work style selected</span>'}
                        </div>
                    </div>
                </div>
                
                <p class="text-xs text-gray-400 mt-4 text-center">By signing up, you agree to our terms of service.</p>
                
                <div class="flex gap-3 mt-4">
                    <button id="signup-back" class="flex-1 py-3 border-2 border-gray-300 text-gray-600 font-semibold rounded-xl hover:bg-gray-50 transition">
                        Back
                    </button>
                    <button id="signup-submit" class="flex-1 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold rounded-xl hover:shadow-lg transition">
                        Create Account
                    </button>
                </div>
            </div>
        `;
    },
    
    setupEventListeners() {
        // Login button
        const loginBtn = document.getElementById('login-btn');
        if (loginBtn) {
            loginBtn.addEventListener('click', () => this.handleLogin());
        }
        
        // Signup next button
        const signupNextBtn = document.getElementById('signup-next-btn');
        if (signupNextBtn) {
            signupNextBtn.addEventListener('click', () => this.handleSignupNext());
        }
        
        // Signup back button
        const signupBack = document.getElementById('signup-back');
        if (signupBack) {
            signupBack.addEventListener('click', () => {
                if (this.currentStep > 0) {
                    this.currentStep--;
                    this.renderSignupForm();
                } else {
                    this.switchTab('login');
                }
            });
        }
        
        // Signup submit button
        const signupSubmit = document.getElementById('signup-submit');
        if (signupSubmit) {
            signupSubmit.addEventListener('click', () => this.handleSignupSubmit());
        }
        
        // Goal buttons
        document.querySelectorAll('.goal-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const goal = btn.dataset.value;
                if (this.signupData.goals.includes(goal)) {
                    this.signupData.goals = this.signupData.goals.filter(g => g !== goal);
                } else {
                    if (this.signupData.goals.length < 3) {
                        this.signupData.goals.push(goal);
                    }
                }
                this.renderSignupForm();
            });
        });
        
        // Work style buttons
        document.querySelectorAll('.workstyle-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const style = btn.dataset.value;
                if (this.signupData.workStyle.includes(style)) {
                    this.signupData.workStyle = this.signupData.workStyle.filter(s => s !== style);
                } else {
                    this.signupData.workStyle.push(style);
                }
                this.renderSignupForm();
            });
        });
        
        // Looking for buttons
        document.querySelectorAll('.lookingfor-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const opt = btn.dataset.value;
                if (this.signupData.lookingFor.includes(opt)) {
                    this.signupData.lookingFor = this.signupData.lookingFor.filter(o => o !== opt);
                } else {
                    this.signupData.lookingFor.push(opt);
                }
                this.renderSignupForm();
            });
        });
    },
    
    async handleLogin() {
        const email = document.getElementById('login-email').value.trim();
        const password = document.getElementById('login-password').value;
        
        if (!email || !password) {
            alert('Please enter email and password');
            return;
        }
        
        const user = await Database.login(email, password);
        
        if (user) {
            // Load user data into AppData
            AppData.currentUser = user;
            
            // Show navbar and bottom nav again
            const navbar = document.getElementById('navbar');
            if (navbar) navbar.classList.remove('hidden');
            const bottomNav = document.getElementById('bottom-nav');
            if (bottomNav) bottomNav.classList.remove('hidden');
            
            // Re-render navbar to update profile image
            Navbar.render();
            
            // Go to browse
            Browse.init();
        } else {
            alert('Invalid email or password');
        }
    },
    
    handleSignupNext() {
        if (this.currentStep === 0) {
            // Validate step 1
            const name = document.getElementById('signup-name').value.trim();
            const email = document.getElementById('signup-email').value.trim();
            const password = document.getElementById('signup-password').value;
            const confirmPassword = document.getElementById('signup-confirm-password').value;
            const photo = document.getElementById('signup-photo').value.trim();
            const location = document.getElementById('signup-location').value.trim();
            
            if (!name || !email || !password) {
                alert('Please fill in name, email, and password');
                return;
            }
            
            if (password !== confirmPassword) {
                alert('Passwords do not match');
                return;
            }
            
            this.signupData.name = name;
            this.signupData.email = email;
            this.signupData.password = password;
            this.signupData.photo = photo;
            this.signupData.location = location;
            
            this.currentStep = 1;
        } else if (this.currentStep === 1) {
            this.currentStep = 2;
        }
        
        this.render();
    },
    
    async handleSignupSubmit() {
        // Create user data
        const newUser = {
            email: this.signupData.email,
            password: this.signupData.password,
            name: this.signupData.name,
            photo: this.signupData.photo || 'https://ui-avatars.com/api/?name=' + encodeURIComponent(this.signupData.name || 'User') + '&background=6366f1&color=fff&size=200&font-size=0.4&length=1',
            bio: this.signupData.bio || '',
            location: this.signupData.location || '',
            availability: '10-15 hrs/week',
            goals: this.signupData.goals || [],
            workStyle: this.signupData.workStyle || [],
            lookingFor: this.signupData.lookingFor || ['Projects', 'Collaborators'],
            skills: [],
            skillTrees: [],
            privateDocument: null,
            distance: '0 mi',
            ownedProjects: [],
            interestedProjects: [],
            likesSent: [],
            likesReceived: [],
            contact: {
                email: this.signupData.email,
                linkedin: '',
                twitter: ''
            }
        };
        
        // Register user
        const result = await Database.register(newUser);
        
        if (result.error) {
            alert(result.error);
            return;
        }
        
        // Load user into AppData
        AppData.currentUser = result;
        
        // Show navbar and bottom nav again
        const navbar = document.getElementById('navbar');
        if (navbar) navbar.classList.remove('hidden');
        const bottomNav = document.getElementById('bottom-nav');
        if (bottomNav) bottomNav.classList.remove('hidden');
        
        // Re-render navbar to update profile image
        Navbar.render();
        
        alert('Account created! Welcome to CollaMatch!');
        
        // Go to browse
        Browse.init();
    }
};

// Make Auth available globally
window.Auth = Auth;

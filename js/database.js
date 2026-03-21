// IndexedDB Database Service for CollaMatch
// Provides CRUD operations for all data entities

const DB_NAME = 'CollaMatchDB';
const DB_VERSION = 1;

const Database = {
    db: null,
    
    // Initialize the database
    async init() {
        return new Promise((resolve, reject) => {
            const request = indexedDB.open(DB_NAME, DB_VERSION);
            
            request.onerror = (event) => {
                console.error('IndexedDB error:', event.target.error);
                reject(event.target.error);
            };
            
            request.onsuccess = (event) => {
                this.db = event.target.result;
                console.log('Database opened successfully');
                resolve(this.db);
            };
            
            request.onupgradeneeded = (event) => {
                const db = event.target.result;
                
                // Create object stores
                if (!db.objectStoreNames.contains('users')) {
                    const usersStore = db.createObjectStore('users', { keyPath: 'id' });
                    usersStore.createIndex('email', 'email', { unique: false });
                }
                
                if (!db.objectStoreNames.contains('projects')) {
                    const projectsStore = db.createObjectStore('projects', { keyPath: 'id' });
                    projectsStore.createIndex('ownerId', 'owner.id', { unique: false });
                }
                
                if (!db.objectStoreNames.contains('matches')) {
                    db.createObjectStore('matches', { keyPath: 'id' });
                }
                
                if (!db.objectStoreNames.contains('chats')) {
                    const chatsStore = db.createObjectStore('chats', { keyPath: 'id' });
                    chatsStore.createIndex('participantId', 'participant.id', { unique: false });
                }
                
                if (!db.objectStoreNames.contains('currentUser')) {
                    db.createObjectStore('currentUser', { keyPath: 'id' });
                }
                
                console.log('Database schema created');
            };
        });
    },
    
    // Generic CRUD methods
    async getAll(storeName) {
        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction(storeName, 'readonly');
            const store = transaction.objectStore(storeName);
            const request = store.getAll();
            
            request.onsuccess = () => resolve(request.result);
            request.onerror = () => reject(request.error);
        });
    },
    
    async getById(storeName, id) {
        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction(storeName, 'readonly');
            const store = transaction.objectStore(storeName);
            const request = store.get(id);
            
            request.onsuccess = () => resolve(request.result);
            request.onerror = () => reject(request.error);
        });
    },
    
    async getByIndex(storeName, indexName, value) {
        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction(storeName, 'readonly');
            const store = transaction.objectStore(storeName);
            const index = store.index(indexName);
            const request = index.getAll(value);
            
            request.onsuccess = () => resolve(request.result);
            request.onerror = () => reject(request.error);
        });
    },
    
    async add(storeName, data) {
        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction(storeName, 'readwrite');
            const store = transaction.objectStore(storeName);
            const request = store.put(data);
            
            request.onsuccess = () => resolve(request.result);
            request.onerror = () => reject(request.error);
        });
    },
    
    async delete(storeName, id) {
        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction(storeName, 'readwrite');
            const store = transaction.objectStore(storeName);
            const request = store.delete(id);
            
            request.onsuccess = () => resolve();
            request.onerror = () => reject(request.error);
        });
    },
    
    async clear(storeName) {
        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction(storeName, 'readwrite');
            const store = transaction.objectStore(storeName);
            const request = store.clear();
            
            request.onsuccess = () => resolve();
            request.onerror = () => reject(request.error);
        });
    },
    
    // User methods
    async getCurrentUser() {
        const users = await this.getById('currentUser', 'current');
        return users || null;
    },
    
    async saveCurrentUser(user) {
        // Save to currentUser store
        user.id = 'current'; // Use 'current' as key for current user
        await this.add('currentUser', user);
        
        // Also update the user's record in the 'users' store with their actual ID
        const userId = user.originalId || user.id;
        if (userId && userId !== 'current') {
            const existingUser = await this.getById('users', userId);
            if (existingUser) {
                // Update the user's data in users store
                Object.assign(existingUser, user);
                existingUser.id = userId; // Restore original ID
                await this.add('users', existingUser);
            }
        }
        return user;
    },
    
    async setCurrentUserId(userId) {
        const user = await this.getById('users', userId);
        if (user) {
            user.id = 'current';
            await this.add('currentUser', user);
        }
        return user;
    },
    
    async login(email, password) {
        // Get all users and find by email and password
        const users = await this.getAll('users');
        const user = users.find(u => u.email === email && u.password === password);
        if (user) {
            // Store original ID before setting as current
            const originalId = user.id;
            user.id = 'current';
            user.originalId = originalId; // Keep track of original ID
            await this.add('currentUser', user);
            return user;
        }
        return null;
    },
    
    async register(userData) {
        // Check if email already exists
        const users = await this.getAll('users');
        const existingUser = users.find(u => u.email === userData.email);
        if (existingUser) {
            return { error: 'Email already exists' };
        }
        
        // Create new user with unique ID
        const newUser = {
            id: 'user_' + Date.now(),
            ...userData,
            createdAt: new Date().toISOString()
        };
        
        // Add to users table
        await this.add('users', newUser);
        
        // Set as current user
        newUser.id = 'current';
        await this.add('currentUser', newUser);
        
        return newUser;
    },
    
    async logout() {
        // Clear current user from IndexedDB
        const tx = this.db.transaction(['currentUser'], 'readwrite');
        tx.objectStore('currentUser').clear();
        return true;
    },
    
    async getCollaborators() {
        return this.getAll('users');
    },
    
    async addCollaborator(user) {
        return this.add('users', user);
    },
    
    async updateUser(user) {
        return this.add('users', user);
    },
    
    // Project methods
    async getProjects() {
        return this.getAll('projects');
    },
    
    async getProjectsByOwner(ownerId) {
        return this.getByIndex('projects', 'ownerId', ownerId);
    },
    
    async getProject(id) {
        return this.getById('projects', id);
    },
    
    async saveProject(project) {
        return this.add('projects', project);
    },
    
    async deleteProject(id) {
        return this.delete('projects', id);
    },
    
    // Match methods
    async getMatches() {
        return this.getAll('matches');
    },
    
    async addMatch(match) {
        return this.add('matches', match);
    },
    
    // Chat methods
    async getChats() {
        return this.getAll('chats');
    },
    
    async getChat(id) {
        return this.getById('chats', id);
    },
    
    async saveChat(chat) {
        return this.add('chats', chat);
    },
    
    async deleteChat(id) {
        return this.delete('chats', id);
    },
    
    // Seed initial data
    async seedData() {
        // Check if we already have data
        const existingUsers = await this.getAll('users');
        if (existingUsers.length > 0) {
            console.log('Data already seeded');
            return;
        }
        
        console.log('Seeding initial data...');
        
        // Seed demo current user (for login demo)
        const demoUser = {
            id: 'user-1',
            email: 'demo@example.com',
            password: 'password123',
            name: 'Alex Chen',
            photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&crop=face',
            goals: ['Build a startup', 'Find co-founder', 'Build side projects'],
            workStyle: ['Deep Work', 'Collaborative'],
            availability: '15-20 hrs/week',
            skills: [
                { name: 'React', level: 90 },
                { name: 'Node.js', level: 85 },
                { name: 'TypeScript', level: 80 },
                { name: 'Product', level: 70 },
                { name: 'Leadership', level: 75 }
            ],
            bio: 'Full-stack developer with a passion for building products. Looking for collaborators on innovative projects!',
            location: 'San Francisco, CA',
            distance: '0 mi',
            distanceValue: 0,
            lookingFor: ['Projects', 'Collaborators'],
            privateDocument: {
                title: 'Project Portfolio',
                content: 'Built 3 SaaS products with combined 10K+ users. Previously led engineering team at Series A startup.',
                isPublic: false
            },
            ownedProjects: ['proj-4', 'proj-5'],
            interestedProjects: ['proj-1', 'proj-2', 'proj-3'],
            likesSent: [
                { targetId: 'user-2', targetType: 'user', timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString() },
                { targetId: 'user-3', targetType: 'user', timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString() },
                { targetId: 'user-4', targetType: 'user', timestamp: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString() }
            ],
            likesReceived: [
                { fromId: 'user-2', fromType: 'user', timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString() },
                { fromId: 'user-3', fromType: 'user', timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString() },
                { fromId: 'user-4', fromType: 'user', timestamp: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString() }
            ],
            contact: { email: 'demo@example.com', linkedin: '', twitter: '' }
        };
        
        await this.add('users', demoUser);
        
        // Set as current user for demo
        demoUser.id = 'current';
        await this.add('currentUser', demoUser);
        
        // Seed collaborators
        const collaborators = [
            {
                id: 'user-2',
                email: 'sarah@example.com',
                password: 'password123',
                name: 'Sarah Johnson',
                photo: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=200&fit=crop&crop=face',
                goals: ['Build a startup', 'Meet like-minded people', 'Work on ML projects'],
                workStyle: ['Deep Work', 'Collaborative'],
                availability: '20+ hrs/week',
                skills: [
                    { name: 'Machine Learning', level: 95 },
                    { name: 'Python', level: 90 },
                    { name: 'Data Science', level: 88 },
                    { name: 'Research', level: 85 },
                    { name: 'Teaching', level: 70 }
                ],
                bio: 'ML researcher excited about applying AI to real-world problems. Want to collaborate on meaningful projects!',
                location: 'San Francisco, CA',
                distance: '0.5 mi',
                distanceValue: 0.5,
                lookingFor: ['Projects'],
                privateDocument: {
                    title: 'ML Research Portfolio',
                    content: 'Published papers: "Neural Networks for Image Classification" (2023), "Transformers in NLP" (2022). Research experience at Stanford AI Lab. Available upon request.',
                    isPublic: false
                },
                ownedProjects: ['proj-1'],
                interestedProjects: [],
                likesSent: [
                    { targetId: 'user-1', targetType: 'user', timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString() }
                ],
                likesReceived: [],
                contact: { email: 'sarah@example.com', linkedin: '', twitter: '' }
            },
            {
                id: 'user-3',
                email: 'michael@example.com',
                password: 'password123',
                name: 'Michael Park',
                photo: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&h=200&fit=crop&crop=face',
                goals: ['Launch e-commerce business', 'Learn marketing', 'Build side projects'],
                workStyle: ['Async', 'Casual'],
                availability: '5-10 hrs/week',
                skills: [
                    { name: 'Marketing', level: 85 },
                    { name: 'Content', level: 80 },
                    { name: 'Social Media', level: 75 },
                    { name: 'Sales', level: 65 },
                    { name: 'React', level: 40 }
                ],
                bio: 'Marketer turned developer. Looking to build something on the side while working full-time.',
                location: 'Oakland, CA',
                distance: '3.2 mi',
                distanceValue: 3.2,
                lookingFor: ['Collaborators'],
                privateDocument: {
                    title: 'Marketing Case Studies',
                    content: 'Managed $500K+ ad campaigns for tech startups. Created content strategy that grew follower count by 300%. Available upon request.',
                    isPublic: false
                },
                ownedProjects: ['proj-2'],
                interestedProjects: ['proj-4'],
                likesSent: [
                    { targetId: 'user-1', targetType: 'user', timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString() }
                ],
                likesReceived: [],
                contact: { email: 'michael@example.com', linkedin: '', twitter: '' }
            },
            {
                id: 'user-4',
                email: 'emily@example.com',
                password: 'password123',
                name: 'Emily Davis',
                photo: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&h=200&fit=crop&crop=face',
                goals: ['Create educational apps', 'Work on health tech', 'Freelance'],
                workStyle: ['Flexible', 'Async'],
                availability: '15-20 hrs/week',
                skills: [
                    { name: 'React Native', level: 90 },
                    { name: 'UI/UX', level: 85 },
                    { name: 'Mobile Dev', level: 88 },
                    { name: 'Firebase', level: 70 },
                    { name: 'Node.js', level: 55 }
                ],
                bio: 'Mobile developer passionate about creating apps that help people. Want to collaborate on health/wellness projects!',
                location: 'Berkeley, CA',
                distance: '5.1 mi',
                distanceValue: 5.1,
                lookingFor: ['Projects'],
                privateDocument: {
                    title: 'Mobile App Portfolio',
                    content: 'Built 5+ apps with 100K+ combined downloads. Featured in App Store "Best New Apps" section. Available upon request.',
                    isPublic: false
                },
                ownedProjects: ['proj-3'],
                interestedProjects: ['proj-5'],
                likesSent: [
                    { targetId: 'user-1', targetType: 'user', timestamp: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString() }
                ],
                likesReceived: [],
                contact: { email: 'emily@example.com', linkedin: '', twitter: '' }
            },
            {
                id: 'user-5',
                email: 'kevin@example.com',
                password: 'password123',
                name: 'Kevin Zhang',
                photo: 'https://images.unsplash.com/photo-1507591064344-4c6ce005b128?w=200&h=200&fit=crop&crop=face',
                goals: ['Build developer tools', 'Open source contributions', 'Learn Rust'],
                workStyle: ['Deep Work', 'Async'],
                availability: '20+ hrs/week',
                skills: [
                    { name: 'TypeScript', level: 95 },
                    { name: 'Rust', level: 75 },
                    { name: 'Go', level: 80 },
                    { name: 'DevOps', level: 70 },
                    { name: 'Testing', level: 85 }
                ],
                bio: 'Full-stack developer focused on developer experience. Love building tools that other developers use!',
                location: 'San Jose, CA',
                distance: '8.4 mi',
                distanceValue: 8.4,
                lookingFor: ['Collaborators'],
                privateDocument: {
                    title: 'Open Source Contributions',
                    content: 'Core contributor to VS Code extensions with 50K+ downloads. Maintained several npm packages. Available upon request.',
                    isPublic: false
                },
                ownedProjects: [],
                interestedProjects: ['proj-1', 'proj-2'],
                likesSent: [],
                likesReceived: [],
                contact: { email: 'kevin@example.com', linkedin: '', twitter: '' }
            },
            {
                id: 'user-6',
                email: 'amanda@example.com',
                password: 'password123',
                name: 'Amanda Lee',
                photo: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&h=200&fit=crop&crop=face',
                goals: ['Find co-founder', 'Build consumer app', 'Network'],
                workStyle: ['Collaborative', 'Casual'],
                availability: '10-15 hrs/week',
                skills: [
                    { name: 'Product', level: 90 },
                    { name: 'Strategy', level: 85 },
                    { name: 'Analytics', level: 80 },
                    { name: 'Communication', level: 88 },
                    { name: 'Coding', level: 30 }
                ],
                bio: 'Product manager looking for a technical co-founder to build something big together!',
                location: 'Palo Alto, CA',
                distance: '6.7 mi',
                distanceValue: 6.7,
                lookingFor: ['Collaborators'],
                privateDocument: {
                    title: 'Product Management Experience',
                    content: 'Led product at Series B startup. Launched features used by 1M+ users. MBA from Wharton. Available upon request.',
                    isPublic: false
                },
                ownedProjects: [],
                interestedProjects: ['proj-3', 'proj-4'],
                likesSent: [],
                likesReceived: [],
                contact: { email: 'amanda@example.com', linkedin: '', twitter: '' }
            }
        ];
        
        for (const user of collaborators) {
            await this.add('users', user);
        }
        
        // Seed projects
        const projects = [
            {
                id: 'proj-1',
                title: 'AI Task Manager',
                type: 'project',
                goals: ['Build AI-powered productivity tool', 'Find users', 'Launch MVP'],
                workStyle: ['Agile', 'Collaborative'],
                teamNeeds: ['ML Engineer', 'Designer'],
                skills: [
                    { name: 'React', level: 80 },
                    { name: 'Python', level: 75 },
                    { name: 'AI/ML', level: 70 },
                    { name: 'Firebase', level: 65 }
                ],
                description: 'Building an intelligent task management app that uses AI to prioritize and organize your workflow.',
                owner: {
                    id: 'user-2',
                    name: 'Sarah Johnson',
                    photo: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=face'
                },
                location: 'San Francisco, CA',
                distance: '0.5 mi',
                distanceValue: 0.5,
                postedDate: '2 days ago',
                privateDocument: {
                    title: 'Technical Specs & Roadmap',
                    content: 'Detailed technical architecture, MVP roadmap with 3-month milestones, and revenue projections. Available upon request.',
                    isPublic: false
                }
            },
            {
                id: 'proj-2',
                title: 'Sustainable E-commerce',
                type: 'project',
                goals: ['Launch eco marketplace', 'Grow to 1000 users', 'Profitability'],
                workStyle: ['Async', 'Casual'],
                teamNeeds: ['Backend Dev', 'Marketing'],
                skills: [
                    { name: 'Next.js', level: 75 },
                    { name: 'Stripe', level: 70 },
                    { name: 'PostgreSQL', level: 65 },
                    { name: 'Marketing', level: 80 }
                ],
                description: 'Eco-friendly marketplace connecting sustainable brands with conscious consumers.',
                owner: {
                    id: 'user-3',
                    name: 'Michael Park',
                    photo: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=face'
                },
                location: 'Oakland, CA',
                distance: '3.2 mi',
                distanceValue: 3.2,
                postedDate: '5 days ago',
                privateDocument: {
                    title: 'Business Plan',
                    content: 'Market analysis, competitor research, and financial projections. Currently seeking $50K seed funding. Available upon request.',
                    isPublic: false
                }
            },
            {
                id: 'proj-3',
                title: 'Health & Wellness App',
                type: 'project',
                goals: ['Help people track wellness', 'Build engaged community', 'Series A'],
                workStyle: ['Deep Work', 'Flexible'],
                teamNeeds: ['Mobile Dev', 'Health Expert'],
                skills: [
                    { name: 'React Native', level: 85 },
                    { name: 'Node.js', level: 70 },
                    { name: 'Health API', level: 60 },
                    { name: 'UX Research', level: 75 }
                ],
                description: 'Mobile app for tracking mental health and wellness with AI-powered insights.',
                owner: {
                    id: 'user-4',
                    name: 'Emily Davis',
                    photo: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face'
                },
                location: 'Berkeley, CA',
                distance: '5.1 mi',
                distanceValue: 5.1,
                postedDate: '1 week ago',
                privateDocument: {
                    title: 'User Research & Analytics',
                    content: 'Beta test results from 500 users showing 85% retention rate. Detailed feature analytics and heatmaps. Available upon request.',
                    isPublic: false
                }
            },
            {
                id: 'proj-4',
                title: 'Developer Productivity Tool',
                type: 'project',
                goals: ['Build CLI tool', 'Get 1000 users', 'Open source'],
                workStyle: ['Deep Work', 'Async'],
                teamNeeds: ['DevOps', 'Rust Developer'],
                skills: [
                    { name: 'Rust', level: 80 },
                    { name: 'CLI', level: 85 },
                    { name: 'Testing', level: 75 },
                    { name: 'Documentation', level: 70 }
                ],
                description: 'A command-line tool that helps developers automate repetitive tasks and boost productivity.',
                owner: {
                    id: 'user-1',
                    name: 'Alex Chen',
                    photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face'
                },
                location: 'San Francisco, CA',
                distance: '0 mi',
                distanceValue: 0,
                postedDate: '3 days ago',
                privateDocument: {
                    title: 'Development Roadmap',
                    content: 'Q2 2026 roadmap with feature priorities, technical debt list, and contributor guidelines. Available upon request.',
                    isPublic: false
                }
            },
            {
                id: 'proj-5',
                title: 'AI Code Review Assistant',
                type: 'project',
                goals: ['Build AI code reviewer', 'Launch beta', 'Get feedback'],
                workStyle: ['Collaborative', 'Agile'],
                teamNeeds: ['ML Engineer', 'Full-stack Dev'],
                skills: [
                    { name: 'Python', level: 90 },
                    { name: 'LLM', level: 85 },
                    { name: 'FastAPI', level: 80 },
                    { name: 'GitHub API', level: 75 }
                ],
                description: 'AI-powered code review assistant that helps developers write better code faster.',
                owner: {
                    id: 'user-1',
                    name: 'Alex Chen',
                    photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face'
                },
                location: 'San Francisco, CA',
                distance: '0 mi',
                distanceValue: 0,
                postedDate: '1 week ago',
                privateDocument: {
                    title: 'AI Model Documentation',
                    content: 'Training data sources, model architecture details, and performance benchmarks. Available upon request.',
                    isPublic: false
                }
            }
        ];
        
        for (const project of projects) {
            await this.add('projects', project);
        }
        
        console.log('Initial data seeded successfully');
    },
    
    // Load all data into AppData for backward compatibility
    async loadToAppData() {
        // Load current user
        const currentUser = await this.getCurrentUser();
        if (currentUser) {
            AppData.currentUser = currentUser;
        }
        
        // Load collaborators
        AppData.collaborators = await this.getCollaborators();
        
        // Load projects
        AppData.projects = await this.getProjects();
        
        // Get current user ID - use originalId if available
        const currentUserId = currentUser?.id;
        const currentUserIdAlt = currentUser?.originalId || (currentUserId === 'current' ? 'user-1' : currentUserId);
        
        // First, try to load existing chats from database
        const existingChats = await this.getChats();
        
        // Dynamically generate matches based on likes
        // A match exists when both users liked each other
        const matches = [];
        
        // Get all collaborators who liked the current user (likesReceived)
        const usersWhoLikedCurrent = AppData.collaborators.filter(collab => {
            if (!collab.likesSent) return false;
            return collab.likesSent.some(like => 
                like.targetId === currentUserId || 
                like.targetId === currentUserIdAlt ||
                like.targetId === 'current'
            );
        });
        
        // For each user who liked current user, check if current user also liked them
        usersWhoLikedCurrent.forEach(userWhoLiked => {
            // Check if current user also liked this user back
            const currentUserLikedThem = currentUser?.likesSent?.some(like =>
                like.targetId === userWhoLiked.id
            );
            
            if (currentUserLikedThem) {
                // It's a match! Create a match entry
                const matchId = 'match-' + userWhoLiked.id;
                const chatId = 'chat-' + userWhoLiked.id;
                
                // Check if we have existing chat in database
                const existingChat = existingChats.find(c => c.id === chatId);
                
                matches.push({
                    id: matchId,
                    user: {
                        id: userWhoLiked.id,
                        name: userWhoLiked.name,
                        photo: userWhoLiked.photo,
                        bio: userWhoLiked.bio,
                        location: userWhoLiked.location,
                        skills: userWhoLiked.skills?.slice(0, 3) || []
                    },
                    matchedAt: new Date().toISOString(),
                    chatId: chatId,
                    decision: existingChat?.decision || null
                });
            }
        });
        
        AppData.matches = matches;
        
        // Generate chats - use existing from DB or create new
        const chats = [];
        matches.forEach(match => {
            const existingChat = existingChats.find(c => c.id === match.chatId);
            
            if (existingChat) {
                // Use existing chat from database
                chats.push(existingChat);
            } else {
                // Create new chat
                chats.push({
                    id: match.chatId,
                    matchId: match.id,
                    participant: match.user,
                    messages: [],
                    createdAt: new Date().toISOString(),
                    expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
                    decision: null,
                    contactExchanged: false,
                    unread: 0,
                    status: 'active'
                });
            }
        });
        
        AppData.chats = chats;
        
        // Initialize swiped arrays if not present
        if (!AppData.swiped) {
            AppData.swiped = { users: [], projects: [] };
        }
        
        console.log('Data loaded to AppData');
    },
    
    // Sync AppData changes back to database
    async syncFromAppData() {
        // Save current user
        if (AppData.currentUser) {
            await this.saveCurrentUser(AppData.currentUser);
        }
        
        // Save all collaborators
        for (const user of AppData.collaborators) {
            await this.add('users', user);
        }
        
        // Save all projects
        for (const project of AppData.projects) {
            await this.add('projects', project);
        }
        
        // Save all matches
        for (const match of AppData.matches) {
            await this.add('matches', match);
        }
        
        // Save all chats
        for (const chat of AppData.chats) {
            await this.add('chats', chat);
        }
        
        console.log('Data synced to database');
    }
};

// Initialize database when script loads
Database.init().then(() => {
    Database.seedData().then(() => {
        Database.loadToAppData();
    });
});

// Make Database available globally
window.Database = Database;

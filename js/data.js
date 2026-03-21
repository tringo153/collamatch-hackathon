// Mock Data for Projects and Collaborators - New Design
// Focus: Goals, Work Style, Intent (no CVs/experience filters)

const AppData = {
    // Current user profile
    currentUser: {
        id: 'user-1',
        name: 'Alex Chen',
        photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&crop=face',
        goals: ['Build a SaaS product', 'Find co-founder', 'Learn new skills'],
        workStyle: ['Deep Work', 'Async'],
        availability: '10-15 hrs/week',
        skills: [
            { name: 'JavaScript', level: 90 },
            { name: 'React', level: 85 },
            { name: 'Node.js', level: 70 },
            { name: 'Python', level: 60 },
            { name: 'Design', level: 45 }
        ],
        bio: 'Passionate about building products that make a difference. Looking for collaborators who want to build something meaningful!',
        location: 'San Francisco, CA',
        distance: '0 mi',
        lookingFor: ['Projects', 'Collaborators'],
        // Private document - only visible to owner or through request
        privateDocument: {
            title: 'Personal Portfolio',
            content: 'Detailed case studies of my previous projects, including: 1) E-commerce platform built with React and Node.js, 2) AI-powered productivity app, 3) Open source contributions to major frameworks. Available upon request.',
            isPublic: false
        },
        // Projects owned by this user
        ownedProjects: ['proj-4', 'proj-5'],
        // Projects user has pressed interested on
        interestedProjects: ['proj-1', 'proj-3'],
        // Skill tree structure
        skillTrees: [
            {
                name: 'Frontend Development',
                skills: [
                    { name: 'HTML/CSS', level: 95 },
                    { name: 'JavaScript', level: 90 },
                    { name: 'React', level: 85 },
                    { name: 'Vue.js', level: 60 },
                    { name: 'TypeScript', level: 75 }
                ]
            },
            {
                name: 'Backend Development',
                skills: [
                    { name: 'Node.js', level: 70 },
                    { name: 'Python', level: 60 },
                    { name: 'PostgreSQL', level: 65 },
                    { name: 'MongoDB', level: 55 }
                ]
            }
        ]
    },

    // Users/Collaborators data (no CVs, no years of experience)
    collaborators: [
        {
            id: 'user-2',
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
            // Private document - hidden by default
            privateDocument: {
                title: 'ML Research Portfolio',
                content: 'Published papers: "Neural Networks for Image Classification" (2023), "Transformers in NLP" (2022). Research experience at Stanford AI Lab. Available upon request.',
                isPublic: false
            },
            // Projects owned by this user
            ownedProjects: ['proj-1'],
            // Projects user has pressed interested on
            interestedProjects: []
        },
        {
            id: 'user-3',
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
            interestedProjects: ['proj-4']
        },
        {
            id: 'user-4',
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
            interestedProjects: ['proj-5']
        },
        {
            id: 'user-5',
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
            interestedProjects: ['proj-1', 'proj-2']
        },
        {
            id: 'user-6',
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
            interestedProjects: ['proj-3', 'proj-4']
        }
    ],

    // Projects data (no CVs/experience filters needed)
    projects: [
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
            // Private document for project
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
    ],

    // Matches storage
    matches: [],

    // Swiped items storage
    swiped: {
        users: [],
        projects: []
    }
};

// Guided prompts for 24-hour structured chat
const ChatPrompts = {
    getPrompts() {
        return [
            {
                id: 1,
                title: 'Introduce Yourself',
                questions: [
                    'What brings you to this project?',
                    'What does success look like for you in 3 months?'
                ]
            },
            {
                id: 2,
                title: 'Work Style',
                questions: [
                    'How do you prefer to communicate?',
                    'What are your peak productivity hours?'
                ]
            },
            {
                id: 3,
                title: 'Collaboration',
                questions: [
                    'How do you handle disagreements?',
                    'What kind of feedback do you prefer?'
                ]
            },
            {
                id: 4,
                title: 'Next Steps',
                questions: [
                    'What\'s the first thing we should build?',
                    'How should we stay in touch after this chat?'
                ]
            }
        ];
    }
};

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = AppData;
}

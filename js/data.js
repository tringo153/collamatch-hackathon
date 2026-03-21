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
        lookingFor: ['Projects', 'Collaborators']
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
            lookingFor: ['Projects']
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
            lookingFor: ['Collaborators']
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
            lookingFor: ['Projects']
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
            lookingFor: ['Collaborators']
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
            lookingFor: ['Collaborators']
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
                name: 'Sarah Johnson',
                photo: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=face'
            },
            location: 'San Francisco, CA',
            distance: '0.5 mi',
            postedDate: '2 days ago'
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
                name: 'Michael Park',
                photo: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=face'
            },
            location: 'Oakland, CA',
            distance: '3.2 mi',
            postedDate: '5 days ago'
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
                name: 'Emily Davis',
                photo: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face'
            },
            location: 'Berkeley, CA',
            distance: '5.1 mi',
            postedDate: '1 week ago'
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

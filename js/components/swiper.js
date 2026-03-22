// Swiper Component - Updated with simple Interested/Pass buttons instead of swiping

const Swiper = {
    currentFilter: 'collaborators', // 'collaborators' or 'projects'
    cards: [],
    currentIndex: 0,
    isAnimating: false,
    startX: 0,
    startY: 0,
    currentX: 0,
    currentY: 0,
    currentCard: null,

    init() {
        this.loadCards();
        this.renderCards();
        this.attachEventListeners();
    },

    loadCards() {
        const swipedIds = [...AppData.swiped.users, ...AppData.swiped.projects];
        
        if (this.currentFilter === 'collaborators') {
            this.cards = AppData.collaborators.filter(u => !swipedIds.includes(u.id));
        } else {
            this.cards = AppData.projects.filter(p => !swipedIds.includes(p.id));
        }
        
        this.currentIndex = 0;
    },

    renderCards() {
        const container = document.getElementById('card-stack');
        
        if (this.cards.length === 0) {
            container.innerHTML = Card.createEmptyState(this.currentFilter);
            return;
        }

        // Show only top 2 cards
        let html = '';
        for (let i = Math.min(1, this.cards.length - 1); i >= 0; i--) {
            const item = this.cards[i];
            if (item.type === 'project') {
                html += Card.createProjectCard(item, i);
            } else {
                html += Card.createUserCard(item, i);
            }
        }
        
        container.innerHTML = html;
        
        // Setup touch/mouse events for top card
        const topCard = container.querySelector('.swipe-card[data-index="0"]');
        if (topCard) {
            this.setupCardEvents(topCard);
        }
    },

    setupCardEvents(card) {
        this.currentCard = card;

        // Mouse events
        card.addEventListener('mousedown', this.onDragStart.bind(this));
        card.addEventListener('mousemove', this.onDragMove.bind(this));
        card.addEventListener('mouseup', this.onDragEnd.bind(this));
        card.addEventListener('mouseleave', this.onDragEnd.bind(this));

        // Touch events
        card.addEventListener('touchstart', this.onDragStart.bind(this));
        card.addEventListener('touchmove', this.onDragMove.bind(this));
        card.addEventListener('touchend', this.onDragEnd.bind(this));

        // Click to open modal
        card.addEventListener('click', (e) => {
            if (!card.classList.contains('swiping') && Math.abs(this.currentX) < 10) {
                const index = parseInt(card.dataset.index);
                Modal.show(this.cards[index]);
            }
        });
    },

    onDragStart(e) {
        if (this.isAnimating) return;
        
        const card = e.currentTarget;
        card.classList.remove('like', 'dislike', 'super-like');
        
        const point = e.touches ? e.touches[0] : e;
        this.startX = point.clientX;
        this.startY = point.clientY;
        this.currentX = 0;
        this.currentY = 0;
        
        card.classList.add('swiping');
    },

    onDragMove(e) {
        if (!this.currentCard || !this.currentCard.classList.contains('swiping')) return;
        
        e.preventDefault();
        
        const point = e.touches ? e.touches[0] : e;
        this.currentX = point.clientX - this.startX;
        this.currentY = point.clientY - this.startY;
        
        const rotate = this.currentX * 0.05;
        this.currentCard.style.transform = `translate(${this.currentX}px, ${this.currentY}px) rotate(${rotate}deg)`;
        
        // Show/hide labels
        const likeLabel = this.currentCard.querySelector('.swipe-label.like');
        const dislikeLabel = this.currentCard.querySelector('.swipe-label.dislike');
        
        if (likeLabel && dislikeLabel) {
            likeLabel.style.opacity = Math.max(0, Math.min(1, this.currentX / 100));
            dislikeLabel.style.opacity = Math.max(0, Math.min(1, -this.currentX / 100));
        }
    },

    onDragEnd(e) {
        if (!this.currentCard || !this.currentCard.classList.contains('swiping')) return;
        
        this.currentCard.classList.remove('swiping');
        
        const threshold = 100;
        
        if (this.currentX > threshold) {
            this.animateSwipe('like');
        } else if (this.currentX < -threshold) {
            this.animateSwipe('dislike');
        } else {
            // Reset position
            this.currentCard.style.transform = '';
            const likeLabel = this.currentCard.querySelector('.swipe-label.like');
            const dislikeLabel = this.currentCard.querySelector('.swipe-label.dislike');
            if (likeLabel) likeLabel.style.opacity = 0;
            if (dislikeLabel) dislikeLabel.style.opacity = 0;
        }
        
        this.currentX = 0;
        this.currentY = 0;
    },

    animateSwipe(direction) {
        if (this.isAnimating) return;
        this.isAnimating = true;
        
        const card = this.currentCard;
        card.classList.add(direction);
        
        const cardId = card.dataset.id;
        const cardIndex = parseInt(card.dataset.index);
        const cardType = card.dataset.type; // 'user' or 'project'
        const item = this.cards[cardIndex];
        
        setTimeout(() => {
            this.handleSwipe(item, direction, cardType);
            this.cards.splice(cardIndex, 1);
            this.renderCards();
            this.isAnimating = false;
        }, 300);
    },

    handleSwipe(item, direction, cardType) {
        const storageKey = cardType === 'project' ? 'projects' : 'users';
        AppData.swiped[storageKey].push(item.id);
        
        if (direction === 'like') {
            // When liking a user (collaborator), check if they have projects
            if (cardType === 'user') {
                const userProjects = item.ownedProjects || [];
                
                if (userProjects.length > 0) {
                    // User has projects - show project selection popup
                    // First, get the actual project objects
                    const availableProjects = AppData.projects.filter(p => userProjects.includes(p.id));
                    
                    // Show the project selection modal
                    setTimeout(() => {
                        Modal.showProjectSelection(item, availableProjects);
                    }, 300);
                } else {
                    // No projects, proceed with normal match logic
                    this.createMatch(item);
                }
            } else {
                // Liking a project - use Browse.processLike for proper match and chat creation
                Browse.processLike(item.id, 'project');
            }
        }
    },

    // Create a match with the item
    createMatch(item) {
        // Simulate a match (in real app, this would check if the other person liked us)
        const isMatch = Math.random() > 0.5;
        
        if (isMatch) {
            AppData.matches.push({
                id: item.id,
                item: item,
                matchedAt: new Date().toISOString(),
                expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString() // 24 hours
            });
            
            setTimeout(() => {
                Modal.showMatch(item);
            }, 500);
        }
    },

    // Simple button actions (no dragging required)
    like() {
        if (!this.currentCard || this.isAnimating) return;
        this.animateSwipe('like');
    },

    pass() {
        if (!this.currentCard || this.isAnimating) return;
        this.animateSwipe('dislike');
    },

    changeFilter(filter) {
        this.currentFilter = filter;
        
        // Update button states
        const collaboratorsBtn = document.getElementById('filter-collaborators');
        const projectsBtn = document.getElementById('filter-projects');
        
        if (filter === 'collaborators') {
            collaboratorsBtn?.classList.add('active');
            projectsBtn?.classList.remove('active');
        } else {
            collaboratorsBtn?.classList.remove('active');
            projectsBtn?.classList.add('active');
        }
        
        this.loadCards();
        this.renderCards();
    },

    resetFilter() {
        const newFilter = this.currentFilter === 'collaborators' ? 'projects' : 'collaborators';
        this.changeFilter(newFilter);
    },

    sendMessage(matchId) {
        console.log('Opening chat with match:', matchId);
    },

    attachEventListeners() {
        // Filter buttons
        document.getElementById('filter-collaborators')?.addEventListener('click', () => {
            this.changeFilter('collaborators');
        });
        
        document.getElementById('filter-projects')?.addEventListener('click', () => {
            this.changeFilter('projects');
        });
        
        // Action buttons - Changed labels
        document.getElementById('btn-like')?.addEventListener('click', () => this.like());
        document.getElementById('btn-pass')?.addEventListener('click', () => this.pass());
        
        // Keyboard support
        document.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowLeft') this.pass();
            if (e.key === 'ArrowRight') this.like();
        });
    }
};

// Make Swiper available globally
window.Swiper = Swiper;

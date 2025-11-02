document.addEventListener('DOMContentLoaded', function() {
    initMobileMenu();
    initAuth();
    initSearch();
    initBookDetails();
    initComments();
    initProfile();
    checkAuthState();
});

function initMobileMenu() {
    const mobileMenu = document.getElementById('mobile-menu');
    const navMenu = document.getElementById('nav-menu');

    if (mobileMenu) {
        mobileMenu.addEventListener('click', function() {
            navMenu.classList.toggle('active');

            const bars = mobileMenu.querySelectorAll('.bar');
            bars[0].style.transform = navMenu.classList.contains('active')
                ? 'rotate(-45deg) translate(-5px, 6px)'
                : 'none';
            bars[1].style.opacity = navMenu.classList.contains('active') ? '0' : '1';
            bars[2].style.transform = navMenu.classList.contains('active')
                ? 'rotate(45deg) translate(-5px, -6px)'
                : 'none';
        });
    }
}

function initAuth() {
    const loginForm = document.getElementById('login-form');
    const registerForm = document.getElementById('register-form');

    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();

            const email = document.getElementById('login-email').value;
            const password = document.getElementById('login-password').value;

            if (email && password) {
                const user = {
                    email: email,
                    name: email.split('@')[0],
                    loggedIn: true
                };

                localStorage.setItem('currentUser', JSON.stringify(user));

                showNotification('Muvaffaqiyatli kirdingiz!', 'success');

                setTimeout(() => {
                    window.location.href = 'index.html';
                }, 1000);
            }
        });
    }

    if (registerForm) {
        registerForm.addEventListener('submit', function(e) {
            e.preventDefault();

            const name = document.getElementById('register-name').value;
            const email = document.getElementById('register-email').value;
            const password = document.getElementById('register-password').value;
            const confirmPassword = document.getElementById('register-confirm-password').value;

            if (password !== confirmPassword) {
                showNotification('Parollar mos emas!', 'error');
                return;
            }

            if (name && email && password) {
                const user = {
                    name: name,
                    email: email,
                    loggedIn: true
                };

                localStorage.setItem('currentUser', JSON.stringify(user));

                showNotification('Ro\'yxatdan o\'tdingiz!', 'success');

                setTimeout(() => {
                    window.location.href = 'index.html';
                }, 1000);
            }
        });
    }

    const logoutLink = document.getElementById('logout-link');
    if (logoutLink) {
        logoutLink.addEventListener('click', function(e) {
            e.preventDefault();
            localStorage.removeItem('currentUser');
            showNotification('Tizimdan chiqdingiz', 'success');
            setTimeout(() => {
                window.location.href = 'index.html';
            }, 1000);
        });
    }
}

function checkAuthState() {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    const loginLink = document.getElementById('login-link');
    const logoutLink = document.getElementById('logout-link');
    const profileLink = document.getElementById('profile-link');

    if (currentUser && currentUser.loggedIn) {
        if (loginLink) loginLink.style.display = 'none';
        if (logoutLink) logoutLink.style.display = 'block';
        if (profileLink) profileLink.style.display = 'block';
    } else {
        if (loginLink) loginLink.style.display = 'block';
        if (logoutLink) logoutLink.style.display = 'none';
        if (profileLink) profileLink.style.display = 'none';
    }
}

function initSearch() {
    const searchInput = document.getElementById('search-input');
    const searchBtn = document.getElementById('search-btn');
    const booksGrid = document.getElementById('books-grid');

    if (searchBtn && searchInput) {
        searchBtn.addEventListener('click', performSearch);
        searchInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                performSearch();
            }
        });
    }

    function performSearch() {
        const searchTerm = searchInput.value.toLowerCase().trim();

        if (!booksGrid) return;

        const bookCards = booksGrid.querySelectorAll('.book-card');

        bookCards.forEach(card => {
            const title = card.querySelector('.book-title').textContent.toLowerCase();
            const description = card.querySelector('.book-description').textContent.toLowerCase();

            if (title.includes(searchTerm) || description.includes(searchTerm) || searchTerm === '') {
                card.style.display = 'block';
                card.style.animation = 'fadeInUp 0.4s ease';
            } else {
                card.style.display = 'none';
            }
        });
    }
}

function initBookDetails() {
    const detailButtons = document.querySelectorAll('.details-btn');

    detailButtons.forEach(button => {
        button.addEventListener('click', function() {
            const bookId = this.getAttribute('data-book-id');
            const bookCard = this.closest('.book-card');
            const title = bookCard.querySelector('.book-title').textContent;
            const description = bookCard.querySelector('.book-description').textContent;
            const image = bookCard.querySelector('.book-image img').src;

            const bookData = {
                id: bookId,
                title: title,
                description: description,
                image: image
            };

            localStorage.setItem('selectedBook', JSON.stringify(bookData));

            window.location.href = 'book-detail.html';
        });
    });

    if (window.location.pathname.includes('book-detail.html')) {
        const bookData = JSON.parse(localStorage.getItem('selectedBook'));

        if (bookData) {
            document.getElementById('book-detail-title').textContent = bookData.title;
            document.getElementById('book-detail-description').textContent = bookData.description;
            document.getElementById('book-detail-image').src = bookData.image;
        }
    }
}

function initComments() {
    const submitCommentBtn = document.getElementById('submit-comment');
    const commentInput = document.getElementById('comment-input');
    const commentsList = document.getElementById('comments-list');

    if (submitCommentBtn) {
        submitCommentBtn.addEventListener('click', function() {
            const commentText = commentInput.value.trim();

            if (commentText === '') {
                showNotification('Komment bo\'sh bo\'lmasligi kerak!', 'error');
                return;
            }

            const currentUser = JSON.parse(localStorage.getItem('currentUser'));

            if (!currentUser || !currentUser.loggedIn) {
                showNotification('Komment qoldirish uchun tizimga kiring!', 'error');
                setTimeout(() => {
                    window.location.href = 'login.html';
                }, 1500);
                return;
            }

            const userName = currentUser.name || 'Foydalanuvchi';
            const firstLetter = userName.charAt(0).toUpperCase();

            const commentCard = document.createElement('div');
            commentCard.className = 'comment-card';
            commentCard.style.animation = 'fadeInUp 0.4s ease';
            commentCard.innerHTML = `
                <div class="comment-header">
                    <div class="comment-avatar">${firstLetter}</div>
                    <div class="comment-author">
                        <h4>${userName}</h4>
                        <span class="comment-date">Hozir</span>
                    </div>
                </div>
                <p class="comment-text">${commentText}</p>
            `;

            commentsList.insertBefore(commentCard, commentsList.firstChild);

            commentInput.value = '';

            showNotification('Komment qo\'shildi!', 'success');
        });
    }
}

function initProfile() {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));

    if (window.location.pathname.includes('profile.html')) {
        if (!currentUser || !currentUser.loggedIn) {
            window.location.href = 'login.html';
            return;
        }

        const profileName = document.getElementById('profile-name');
        const profileEmail = document.getElementById('profile-email');
        const avatarLetter = document.getElementById('avatar-letter');
        const profileFullname = document.getElementById('profile-fullname');
        const profileEmailInput = document.getElementById('profile-email-input');

        if (profileName) profileName.textContent = currentUser.name || 'Foydalanuvchi';
        if (profileEmail) profileEmail.textContent = currentUser.email || '';
        if (avatarLetter) avatarLetter.textContent = (currentUser.name || 'U').charAt(0).toUpperCase();
        if (profileFullname) profileFullname.value = currentUser.name || '';
        if (profileEmailInput) profileEmailInput.value = currentUser.email || '';
    }

    const profileForm = document.getElementById('profile-form');
    if (profileForm) {
        profileForm.addEventListener('submit', function(e) {
            e.preventDefault();

            const updatedUser = {
                ...currentUser,
                name: document.getElementById('profile-fullname').value,
                email: document.getElementById('profile-email-input').value,
                phone: document.getElementById('profile-phone').value,
                location: document.getElementById('profile-location').value,
                bio: document.getElementById('profile-bio').value
            };

            localStorage.setItem('currentUser', JSON.stringify(updatedUser));

            showNotification('Profil yangilandi!', 'success');

            setTimeout(() => {
                location.reload();
            }, 1000);
        });
    }

    const passwordForm = document.getElementById('password-form');
    if (passwordForm) {
        passwordForm.addEventListener('submit', function(e) {
            e.preventDefault();

            const newPassword = document.getElementById('new-password').value;
            const confirmNewPassword = document.getElementById('confirm-new-password').value;

            if (newPassword !== confirmNewPassword) {
                showNotification('Yangi parollar mos emas!', 'error');
                return;
            }

            showNotification('Parol yangilandi!', 'success');

            passwordForm.reset();
        });
    }
}

function showNotification(message, type) {
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }

    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;

    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: ${type === 'success' ? 'linear-gradient(135deg, #00d4ff 0%, #0066ff 100%)' : 'linear-gradient(135deg, #ff4444 0%, #cc0000 100%)'};
        color: white;
        padding: 1rem 2rem;
        border-radius: 10px;
        box-shadow: 0 10px 40px rgba(0, 0, 0, 0.3);
        z-index: 10000;
        animation: slideInRight 0.4s ease;
        font-weight: 600;
    `;

    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideInRight {
            from {
                transform: translateX(400px);
                opacity: 0;
            }
            to {
                transform: translateX(0);
                opacity: 1;
            }
        }
    `;
    document.head.appendChild(style);

    document.body.appendChild(notification);

    setTimeout(() => {
        notification.style.animation = 'slideInRight 0.4s ease reverse';
        setTimeout(() => {
            notification.remove();
        }, 400);
    }, 3000);
}
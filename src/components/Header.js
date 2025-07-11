// Header Component
import { AuthService } from '../services/auth.js';

export class Header {
    constructor() {
        this.authService = new AuthService();
    }

    render(title = 'Dashboard') {
        const user = this.authService.getCurrentUser();
        
        return `
            <header class="header">
                <div class="header-left">
                    <button class="menu-toggle" id="menu-toggle">
                        ☰
                    </button>
                    <h1 class="header-title">${title}</h1>
                </div>
                <div class="header-right">
                    <div class="user-info">
                        <div class="user-avatar">
                            ${user ? user.name.charAt(0).toUpperCase() : 'U'}
                        </div>
                        <div>
                            <div class="user-name">${user ? user.name : 'User'}</div>
                            <div class="user-role">${user ? user.role : 'Guest'}</div>
                        </div>
                    </div>
                    <button class="btn btn-secondary btn-sm" id="logout-btn">
                        Logout
                    </button>
                </div>
            </header>
        `;
    }

    setupEventListeners() {
        // Logout button
        document.addEventListener('click', (e) => {
            if (e.target.id === 'logout-btn') {
                this.authService.logout();
                window.location.href = '/login';
            }
        });

        // Mobile menu toggle
        document.addEventListener('click', (e) => {
            if (e.target.id === 'menu-toggle') {
                const sidebar = document.getElementById('sidebar');
                sidebar.classList.toggle('open');
            }
        });
    }
}
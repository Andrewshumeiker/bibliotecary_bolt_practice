// Sidebar Component
import { AuthService } from '../services/auth.js';

export class Sidebar {
    constructor() {
        this.authService = new AuthService();
    }

    render() {
        const user = this.authService.getCurrentUser();
        const isAdmin = user && user.role === 'admin';
        
        return `
            <div class="sidebar" id="sidebar">
                <div class="sidebar-header">
                    <h2>Admin Panel</h2>
                </div>
                <nav>
                    <ul class="sidebar-nav">
                        ${isAdmin ? `
                            <li>
                                <a href="/dashboard" class="nav-link" data-route="/dashboard">
                                    <span>📊</span>
                                    Dashboard
                                </a>
                            </li>
                            <li>
                                <a href="/users" class="nav-link" data-route="/users">
                                    <span>👥</span>
                                    Users
                                </a>
                            </li>
                            <li>
                                <a href="/courses" class="nav-link" data-route="/courses">
                                    <span>📚</span>
                                    Courses
                                </a>
                            </li>
                        ` : `
                            <li>
                                <a href="/public" class="nav-link" data-route="/public">
                                    <span>🏠</span>
                                    Home
                                </a>
                            </li>
                            <li>
                                <a href="/my-courses" class="nav-link" data-route="/my-courses">
                                    <span>📖</span>
                                    My Courses
                                </a>
                            </li>
                        `}
                    </ul>
                </nav>
            </div>
        `;
    }

    setupEventListeners() {
        // Handle navigation clicks
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('nav-link') || e.target.closest('.nav-link')) {
                e.preventDefault();
                const link = e.target.closest('.nav-link');
                const route = link.getAttribute('data-route');
                
                // Update active state
                document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
                link.classList.add('active');
                
                // Navigate to route
                if (window.app && window.app.router) {
                    window.app.router.navigate(route);
                }
            }
        });
    }
}
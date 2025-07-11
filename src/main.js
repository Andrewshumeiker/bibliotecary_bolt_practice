// Main Application Entry Point
import { AuthService } from './services/auth.js';
import { Router } from './utils/router.js';
import { StorageService } from './utils/storage.js';

class App {
    constructor() {
        this.authService = new AuthService();
        this.router = new Router();
        // Make router globally accessible
        window.app = this;
        this.init();
    }

    init() {
        this.setupRouter();
        this.checkAuthStatus();
        this.setupEventListeners();
    }

    setupRouter() {
        // Define routes
        this.router.addRoute('/', () => this.showLoginPage());
        this.router.addRoute('/login', () => this.showLoginPage());
        this.router.addRoute('/register', () => this.showRegisterPage());
        this.router.addRoute('/dashboard', () => this.showDashboard());
        this.router.addRoute('/users', () => this.showUsersPage());
        this.router.addRoute('/courses', () => this.showCoursesPage());
        this.router.addRoute('/public', () => this.showPublicPage());
        this.router.addRoute('/my-courses', () => this.showMyCoursesPage());

        // Start router
        this.router.start();
    }

    checkAuthStatus() {
        const user = this.authService.getCurrentUser();
        if (user) {
            // User is logged in, redirect to appropriate page
            if (user.role === 'admin') {
                this.router.navigate('/dashboard');
            } else {
                this.router.navigate('/public');
            }
        } else {
            // User is not logged in, show login page
            this.router.navigate('/login');
        }
    }

    setupEventListeners() {
        // Handle browser back/forward buttons
        window.addEventListener('popstate', () => {
            this.router.handleRouteChange();
        });

        // Handle mobile menu toggle
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('menu-toggle')) {
                this.toggleMobileMenu();
            }
        });
    }

    toggleMobileMenu() {
        const sidebar = document.querySelector('.sidebar');
        const mainContent = document.querySelector('.main-content');
        
        if (sidebar && mainContent) {
            sidebar.classList.toggle('open');
            mainContent.classList.toggle('full-width');
        }
    }

    async showLoginPage() {
        const { LoginPage } = await import('./pages/LoginPage.js');
        const loginPage = new LoginPage();
        loginPage.render();
    }

    async showRegisterPage() {
        const { RegisterPage } = await import('./pages/RegisterPage.js');
        const registerPage = new RegisterPage();
        registerPage.render();
    }

    async showDashboard() {
        if (!this.authService.isAuthenticated() || this.authService.getCurrentUser().role !== 'admin') {
            this.router.navigate('/login');
            return;
        }

        const { DashboardPage } = await import('./pages/DashboardPage.js');
        const dashboardPage = new DashboardPage();
        dashboardPage.render();
    }

    async showUsersPage() {
        if (!this.authService.isAuthenticated() || this.authService.getCurrentUser().role !== 'admin') {
            this.router.navigate('/login');
            return;
        }

        const { UsersPage } = await import('./pages/UsersPage.js');
        const usersPage = new UsersPage();
        usersPage.render();
    }

    async showCoursesPage() {
        if (!this.authService.isAuthenticated() || this.authService.getCurrentUser().role !== 'admin') {
            this.router.navigate('/login');
            return;
        }

        const { CoursesPage } = await import('./pages/CoursesPage.js');
        const coursesPage = new CoursesPage();
        coursesPage.render();
    }

    async showPublicPage() {
        if (!this.authService.isAuthenticated()) {
            this.router.navigate('/login');
            return;
        }

        const { PublicPage } = await import('./pages/PublicPage.js');
        const publicPage = new PublicPage();
        publicPage.render();
    }

    async showMyCoursesPage() {
        if (!this.authService.isAuthenticated()) {
            this.router.navigate('/login');
            return;
        }

        const { MyCoursesPage } = await import('./pages/MyCoursesPage.js');
        const myCoursesPage = new MyCoursesPage();
        myCoursesPage.render();
    }
}

// Initialize the application
document.addEventListener('DOMContentLoaded', () => {
    new App();
});
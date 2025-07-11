// Login Page
import { AuthService } from '../services/auth.js';
import { ValidationService } from '../utils/validation.js';

export class LoginPage {
    constructor() {
        this.authService = new AuthService();
    }

    render() {
        const app = document.getElementById('app');
        app.innerHTML = `
            <div class="auth-container">
                <div class="auth-card">
                    <div class="auth-header">
                        <h1>Welcome Back</h1>
                        <p>Sign in to your account</p>
                    </div>
                    <form id="login-form">
                        <div class="form-group">
                            <label for="email" class="form-label">Email Address</label>
                            <input type="email" id="email" class="form-input" required>
                            <div class="form-error" id="email-error"></div>
                        </div>
                        <div class="form-group">
                            <label for="password" class="form-label">Password</label>
                            <input type="password" id="password" class="form-input" required>
                            <div class="form-error" id="password-error"></div>
                        </div>
                        <button type="submit" class="btn btn-primary btn-full">
                            <span class="btn-text">Sign In</span>
                            <span class="loading-spinner d-none"></span>
                        </button>
                    </form>
                    <div class="text-center mt-4">
                        <p>Don't have an account? <a href="/register" class="text-primary">Create one</a></p>
                    </div>
                    <div class="mt-3">
                        <div class="alert alert-info">
                            <strong>Demo Credentials:</strong><br>
                            Admin: admin@admin.com / admin123<br>
                            Visitor: john@example.com / visitor123
                        </div>
                    </div>
                </div>
            </div>
        `;

        this.setupEventListeners();
    }

    setupEventListeners() {
        const form = document.getElementById('login-form');
        const emailInput = document.getElementById('email');
        const passwordInput = document.getElementById('password');

        // Form submission
        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            await this.handleLogin();
        });

        // Real-time validation
        emailInput.addEventListener('blur', () => {
            this.validateEmail();
        });

        passwordInput.addEventListener('blur', () => {
            this.validatePassword();
        });

        // Handle register link
        document.addEventListener('click', (e) => {
            if (e.target.getAttribute('href') === '/register') {
                e.preventDefault();
                if (window.app && window.app.router) {
                    window.app.router.navigate('/register');
                }
            }
        });
    }

    validateEmail() {
        const email = document.getElementById('email').value;
        const emailError = document.getElementById('email-error');
        const emailInput = document.getElementById('email');

        if (!ValidationService.validateEmail(email)) {
            emailError.textContent = 'Please enter a valid email address';
            emailInput.classList.add('error');
            return false;
        } else {
            emailError.textContent = '';
            emailInput.classList.remove('error');
            return true;
        }
    }

    validatePassword() {
        const password = document.getElementById('password').value;
        const passwordError = document.getElementById('password-error');
        const passwordInput = document.getElementById('password');

        if (!ValidationService.validatePassword(password)) {
            passwordError.textContent = 'Password must be at least 6 characters long';
            passwordInput.classList.add('error');
            return false;
        } else {
            passwordError.textContent = '';
            passwordInput.classList.remove('error');
            return true;
        }
    }

    async handleLogin() {
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        const submitBtn = document.querySelector('button[type="submit"]');
        const btnText = submitBtn.querySelector('.btn-text');
        const loadingSpinner = submitBtn.querySelector('.loading-spinner');

        // Validate form
        const isEmailValid = this.validateEmail();
        const isPasswordValid = this.validatePassword();

        if (!isEmailValid || !isPasswordValid) {
            return;
        }

        try {
            // Show loading state
            submitBtn.disabled = true;
            btnText.textContent = 'Signing In...';
            loadingSpinner.classList.remove('d-none');

            const user = await this.authService.login(email, password);

            // Redirect based on user role
            if (user.role === 'admin') {
                window.app.router.navigate('/dashboard');
            } else {
                window.app.router.navigate('/public');
            }
        } catch (error) {
            // Show error message
            const errorDiv = document.createElement('div');
            errorDiv.className = 'alert alert-error';
            errorDiv.textContent = error.message;
            
            const form = document.getElementById('login-form');
            form.insertBefore(errorDiv, form.firstChild);
            
            // Remove error after 5 seconds
            setTimeout(() => {
                errorDiv.remove();
            }, 5000);
        } finally {
            // Reset loading state
            submitBtn.disabled = false;
            btnText.textContent = 'Sign In';
            loadingSpinner.classList.add('d-none');
        }
    }
}
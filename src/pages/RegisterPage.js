// Register Page
import { AuthService } from '../services/auth.js';
import { ValidationService } from '../utils/validation.js';

export class RegisterPage {
    constructor() {
        this.authService = new AuthService();
    }

    render() {
        const app = document.getElementById('app');
        app.innerHTML = `
            <div class="auth-container">
                <div class="auth-card">
                    <div class="auth-header">
                        <h1>Create Account</h1>
                        <p>Join our platform today</p>
                    </div>
                    <form id="register-form">
                        <div class="form-group">
                            <label for="name" class="form-label">Full Name</label>
                            <input type="text" id="name" class="form-input" required>
                            <div class="form-error" id="name-error"></div>
                        </div>
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
                        <div class="form-group">
                            <label for="phone" class="form-label">Phone Number</label>
                            <input type="tel" id="phone" class="form-input" required>
                            <div class="form-error" id="phone-error"></div>
                        </div>
                        <div class="form-group">
                            <label for="enrollNumber" class="form-label">Enrollment Number</label>
                            <input type="text" id="enrollNumber" class="form-input" required>
                            <div class="form-error" id="enrollNumber-error"></div>
                        </div>
                        <div class="form-group">
                            <label for="role" class="form-label">Role</label>
                            <select id="role" class="form-select" required>
                                <option value="">Select Role</option>
                                <option value="visitor">Visitor</option>
                                <option value="admin">Administrator</option>
                            </select>
                            <div class="form-error" id="role-error"></div>
                        </div>
                        <button type="submit" class="btn btn-primary btn-full">
                            <span class="btn-text">Create Account</span>
                            <span class="loading-spinner d-none"></span>
                        </button>
                    </form>
                    <div class="text-center mt-4">
                        <p>Already have an account? <a href="/login" class="text-primary">Sign in</a></p>
                    </div>
                </div>
            </div>
        `;

        this.setupEventListeners();
    }

    setupEventListeners() {
        const form = document.getElementById('register-form');
        const inputs = form.querySelectorAll('.form-input, .form-select');

        // Form submission
        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            await this.handleRegister();
        });

        // Real-time validation
        inputs.forEach(input => {
            input.addEventListener('blur', () => {
                this.validateField(input.id);
            });
        });

        // Handle login link
        document.addEventListener('click', (e) => {
            if (e.target.getAttribute('href') === '/login') {
                e.preventDefault();
                window.app.router.navigate('/login');
            }
        });
    }

    validateField(fieldId) {
        const field = document.getElementById(fieldId);
        const error = document.getElementById(`${fieldId}-error`);
        const value = field.value.trim();

        let isValid = true;
        let errorMessage = '';

        switch (fieldId) {
            case 'name':
                if (!value || value.length < 2) {
                    isValid = false;
                    errorMessage = 'Name must be at least 2 characters long';
                }
                break;
            case 'email':
                if (!ValidationService.validateEmail(value)) {
                    isValid = false;
                    errorMessage = 'Please enter a valid email address';
                }
                break;
            case 'password':
                if (!ValidationService.validatePassword(value)) {
                    isValid = false;
                    errorMessage = 'Password must be at least 6 characters long';
                }
                break;
            case 'phone':
                if (!ValidationService.validatePhone(value)) {
                    isValid = false;
                    errorMessage = 'Please enter a valid phone number';
                }
                break;
            case 'enrollNumber':
                if (!ValidationService.validateEnrollNumber(value)) {
                    isValid = false;
                    errorMessage = 'Enrollment number must be at least 10 characters long';
                }
                break;
            case 'role':
                if (!value || !['admin', 'visitor'].includes(value)) {
                    isValid = false;
                    errorMessage = 'Please select a valid role';
                }
                break;
        }

        if (isValid) {
            error.textContent = '';
            field.classList.remove('error');
        } else {
            error.textContent = errorMessage;
            field.classList.add('error');
        }

        return isValid;
    }

    validateForm() {
        const fields = ['name', 'email', 'password', 'phone', 'enrollNumber', 'role'];
        let isValid = true;

        fields.forEach(fieldId => {
            if (!this.validateField(fieldId)) {
                isValid = false;
            }
        });

        return isValid;
    }

    async handleRegister() {
        const submitBtn = document.querySelector('button[type="submit"]');
        const btnText = submitBtn.querySelector('.btn-text');
        const loadingSpinner = submitBtn.querySelector('.loading-spinner');

        // Validate form
        if (!this.validateForm()) {
            return;
        }

        // Get form data
        const formData = {
            name: ValidationService.sanitizeInput(document.getElementById('name').value),
            email: ValidationService.sanitizeInput(document.getElementById('email').value),
            password: document.getElementById('password').value,
            phone: ValidationService.sanitizeInput(document.getElementById('phone').value),
            enrollNumber: ValidationService.sanitizeInput(document.getElementById('enrollNumber').value),
            role: document.getElementById('role').value
        };

        try {
            // Show loading state
            submitBtn.disabled = true;
            btnText.textContent = 'Creating Account...';
            loadingSpinner.classList.remove('d-none');

            const user = await this.authService.register(formData);

            // Show success message
            const successDiv = document.createElement('div');
            successDiv.className = 'alert alert-success';
            successDiv.textContent = 'Account created successfully! Redirecting...';
            
            const form = document.getElementById('register-form');
            form.insertBefore(successDiv, form.firstChild);

            // Redirect after short delay
            setTimeout(() => {
                if (user.role === 'admin') {
                    window.app.router.navigate('/dashboard');
                } else {
                    window.app.router.navigate('/public');
                }
            }, 2000);
        } catch (error) {
            // Show error message
            const errorDiv = document.createElement('div');
            errorDiv.className = 'alert alert-error';
            errorDiv.textContent = error.message;
            
            const form = document.getElementById('register-form');
            form.insertBefore(errorDiv, form.firstChild);
            
            // Remove error after 5 seconds
            setTimeout(() => {
                errorDiv.remove();
            }, 5000);
        } finally {
            // Reset loading state
            submitBtn.disabled = false;
            btnText.textContent = 'Create Account';
            loadingSpinner.classList.add('d-none');
        }
    }
}
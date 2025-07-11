// Authentication Service
import { StorageService } from '../utils/storage.js';
import { ValidationService } from '../utils/validation.js';

export class AuthService {
    constructor() {
        this.baseUrl = 'http://localhost:3000';
        this.currentUser = null;
        this.loadCurrentUser();
    }

    loadCurrentUser() {
        const userData = StorageService.getItem('currentUser');
        if (userData) {
            this.currentUser = userData;
        }
    }

    async login(email, password) {
        try {
            // Validate input
            if (!ValidationService.validateEmail(email)) {
                throw new Error('Please enter a valid email address');
            }

            if (!ValidationService.validatePassword(password)) {
                throw new Error('Password must be at least 6 characters long');
            }

            // Get users from API
            const response = await fetch(`${this.baseUrl}/users`);
            
            if (!response.ok) {
                throw new Error('Failed to connect to server');
            }

            const users = await response.json();
            
            // Find user with matching email and password
            const user = users.find(u => u.email === email && u.password === password);
            
            if (!user) {
                throw new Error('Invalid email or password');
            }

            // Store user data
            this.currentUser = user;
            StorageService.setItem('currentUser', user);

            return user;
        } catch (error) {
            throw new Error(error.message || 'Login failed');
        }
    }

    async register(userData) {
        try {
            // Validate input
            const validationResult = ValidationService.validateUser(userData);
            if (!validationResult.isValid) {
                throw new Error(validationResult.errors.join(', '));
            }

            // Check if user already exists
            const response = await fetch(`${this.baseUrl}/users`);
            const users = await response.json();
            
            const existingUser = users.find(u => u.email === userData.email);
            if (existingUser) {
                throw new Error('User with this email already exists');
            }

            // Create new user
            const newUser = {
                ...userData,
                id: Date.now(), // Simple ID generation
                dateOfAdmission: new Date().toLocaleDateString('en-GB', {
                    day: '2-digit',
                    month: 'short',
                    year: 'numeric'
                })
            };

            const createResponse = await fetch(`${this.baseUrl}/users`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(newUser)
            });

            if (!createResponse.ok) {
                throw new Error('Failed to create user');
            }

            const createdUser = await createResponse.json();
            
            // Auto-login after registration
            this.currentUser = createdUser;
            StorageService.setItem('currentUser', createdUser);

            return createdUser;
        } catch (error) {
            throw new Error(error.message || 'Registration failed');
        }
    }

    logout() {
        this.currentUser = null;
        StorageService.removeItem('currentUser');
    }

    isAuthenticated() {
        return this.currentUser !== null;
    }

    getCurrentUser() {
        return this.currentUser;
    }

    isAdmin() {
        return this.currentUser && this.currentUser.role === 'admin';
    }

    isVisitor() {
        return this.currentUser && this.currentUser.role === 'visitor';
    }
}
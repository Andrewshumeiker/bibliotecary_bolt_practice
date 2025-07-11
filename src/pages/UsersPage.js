// Users Page
import { Header } from '../components/Header.js';
import { Sidebar } from '../components/Sidebar.js';
import { Modal } from '../components/Modal.js';
import { UsersService } from '../services/users.js';
import { ValidationService } from '../utils/validation.js';

export class UsersPage {
    constructor() {
        this.header = new Header();
        this.sidebar = new Sidebar();
        this.usersService = new UsersService();
        this.users = [];
        this.filteredUsers = [];
        this.currentSearch = '';
        this.currentFilter = 'all';
    }

    async render() {
        const app = document.getElementById('app');
        app.innerHTML = `
            <div class="dashboard-container">
                ${this.sidebar.render()}
                <div class="main-content">
                    ${this.header.render('Users Management')}
                    <div class="content-area">
                        <div class="page-header">
                            <h2 class="page-title">Users</h2>
                            <button class="btn btn-primary" id="add-user-btn">
                                <span>+</span>
                                Add User
                            </button>
                        </div>
                        
                        <div class="search-filter-bar">
                            <input 
                                type="text" 
                                class="form-input search-input" 
                                placeholder="Search users..." 
                                id="search-users"
                            >
                            <select class="form-select" id="filter-users">
                                <option value="all">All Users</option>
                                <option value="admin">Administrators</option>
                                <option value="visitor">Visitors</option>
                            </select>
                        </div>
                        
                        <div class="card">
                            <div class="card-body">
                                <div class="table-container">
                                    <table class="table">
                                        <thead>
                                            <tr>
                                                <th>ID</th>
                                                <th>Name</th>
                                                <th>Email</th>
                                                <th>Role</th>
                                                <th>Phone</th>
                                                <th>Enrollment</th>
                                                <th>Date Joined</th>
                                                <th>Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody id="users-tbody">
                                            <tr>
                                                <td colspan="8" class="text-center">
                                                    <div class="loading-spinner"></div>
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;

        this.setupEventListeners();
        await this.loadUsers();
    }

    setupEventListeners() {
        this.header.setupEventListeners();
        this.sidebar.setupEventListeners();
        
        // Update active navigation
        document.querySelectorAll('.nav-link').forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('data-route') === '/users') {
                link.classList.add('active');
            }
        });

        // Add user button
        document.getElementById('add-user-btn').addEventListener('click', () => {
            this.showUserModal();
        });

        // Search and filter
        document.getElementById('search-users').addEventListener('input', (e) => {
            this.currentSearch = e.target.value.toLowerCase();
            this.filterUsers();
        });

        document.getElementById('filter-users').addEventListener('change', (e) => {
            this.currentFilter = e.target.value;
            this.filterUsers();
        });

        // Table actions
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('edit-user-btn')) {
                const userId = parseInt(e.target.dataset.userId);
                this.showUserModal(userId);
            } else if (e.target.classList.contains('delete-user-btn')) {
                const userId = parseInt(e.target.dataset.userId);
                this.deleteUser(userId);
            }
        });
    }

    async loadUsers() {
        try {
            this.users = await this.usersService.getUsers();
            this.filteredUsers = [...this.users];
            this.renderUsersTable();
        } catch (error) {
            console.error('Error loading users:', error);
            this.showError('Failed to load users');
        }
    }

    filterUsers() {
        this.filteredUsers = this.users.filter(user => {
            const matchesSearch = user.name.toLowerCase().includes(this.currentSearch) ||
                                user.email.toLowerCase().includes(this.currentSearch) ||
                                user.enrollNumber.toLowerCase().includes(this.currentSearch);
            
            const matchesFilter = this.currentFilter === 'all' || user.role === this.currentFilter;
            
            return matchesSearch && matchesFilter;
        });
        
        this.renderUsersTable();
    }

    renderUsersTable() {
        const tbody = document.getElementById('users-tbody');
        
        if (this.filteredUsers.length === 0) {
            tbody.innerHTML = `
                <tr>
                    <td colspan="8" class="text-center">No users found</td>
                </tr>
            `;
            return;
        }

        tbody.innerHTML = this.filteredUsers.map(user => `
            <tr>
                <td>${user.id}</td>
                <td>${user.name}</td>
                <td>${user.email}</td>
                <td>
                    <span class="badge badge-${user.role === 'admin' ? 'primary' : 'secondary'}">
                        ${user.role}
                    </span>
                </td>
                <td>${user.phone}</td>
                <td>${user.enrollNumber}</td>
                <td>${user.dateOfAdmission}</td>
                <td>
                    <div class="d-flex gap-2">
                        <button class="btn btn-sm btn-secondary edit-user-btn" data-user-id="${user.id}">
                            Edit
                        </button>
                        <button class="btn btn-sm btn-danger delete-user-btn" data-user-id="${user.id}">
                            Delete
                        </button>
                    </div>
                </td>
            </tr>
        `).join('');
    }

    showUserModal(userId = null) {
        const isEdit = userId !== null;
        const user = isEdit ? this.users.find(u => u.id === userId) : null;

        const form = document.createElement('div');
        form.innerHTML = `
            <form id="user-form">
                <div class="form-group">
                    <label for="user-name" class="form-label">Full Name</label>
                    <input type="text" id="user-name" class="form-input" value="${user ? user.name : ''}" required>
                    <div class="form-error" id="user-name-error"></div>
                </div>
                <div class="form-group">
                    <label for="user-email" class="form-label">Email Address</label>
                    <input type="email" id="user-email" class="form-input" value="${user ? user.email : ''}" required>
                    <div class="form-error" id="user-email-error"></div>
                </div>
                <div class="form-group">
                    <label for="user-password" class="form-label">Password ${isEdit ? '(leave blank to keep current)' : ''}</label>
                    <input type="password" id="user-password" class="form-input" ${!isEdit ? 'required' : ''}>
                    <div class="form-error" id="user-password-error"></div>
                </div>
                <div class="form-group">
                    <label for="user-phone" class="form-label">Phone Number</label>
                    <input type="tel" id="user-phone" class="form-input" value="${user ? user.phone : ''}" required>
                    <div class="form-error" id="user-phone-error"></div>
                </div>
                <div class="form-group">
                    <label for="user-enrollNumber" class="form-label">Enrollment Number</label>
                    <input type="text" id="user-enrollNumber" class="form-input" value="${user ? user.enrollNumber : ''}" required>
                    <div class="form-error" id="user-enrollNumber-error"></div>
                </div>
                <div class="form-group">
                    <label for="user-role" class="form-label">Role</label>
                    <select id="user-role" class="form-select" required>
                        <option value="">Select Role</option>
                        <option value="visitor" ${user && user.role === 'visitor' ? 'selected' : ''}>Visitor</option>
                        <option value="admin" ${user && user.role === 'admin' ? 'selected' : ''}>Administrator</option>
                    </select>
                    <div class="form-error" id="user-role-error"></div>
                </div>
            </form>
        `;

        const footer = document.createElement('div');
        footer.className = 'd-flex gap-2';
        footer.innerHTML = `
            <button class="btn btn-secondary" id="cancel-user-btn">Cancel</button>
            <button class="btn btn-primary" id="save-user-btn">
                <span class="btn-text">${isEdit ? 'Update' : 'Create'} User</span>
                <span class="loading-spinner d-none"></span>
            </button>
        `;

        const modal = new Modal(
            isEdit ? 'Edit User' : 'Add New User',
            form,
            { footer }
        );

        modal.render();

        // Setup modal event listeners
        document.getElementById('cancel-user-btn').addEventListener('click', () => {
            modal.close();
        });

        document.getElementById('save-user-btn').addEventListener('click', async () => {
            await this.saveUser(modal, userId);
        });

        // Form validation
        const inputs = form.querySelectorAll('.form-input, .form-select');
        inputs.forEach(input => {
            input.addEventListener('blur', () => {
                this.validateUserField(input.id);
            });
        });
    }

    validateUserField(fieldId) {
        const field = document.getElementById(fieldId);
        const error = document.getElementById(`${fieldId}-error`);
        const value = field.value.trim();

        let isValid = true;
        let errorMessage = '';

        switch (fieldId) {
            case 'user-name':
                if (!value || value.length < 2) {
                    isValid = false;
                    errorMessage = 'Name must be at least 2 characters long';
                }
                break;
            case 'user-email':
                if (!ValidationService.validateEmail(value)) {
                    isValid = false;
                    errorMessage = 'Please enter a valid email address';
                }
                break;
            case 'user-password':
                if (value && !ValidationService.validatePassword(value)) {
                    isValid = false;
                    errorMessage = 'Password must be at least 6 characters long';
                }
                break;
            case 'user-phone':
                if (!ValidationService.validatePhone(value)) {
                    isValid = false;
                    errorMessage = 'Please enter a valid phone number';
                }
                break;
            case 'user-enrollNumber':
                if (!ValidationService.validateEnrollNumber(value)) {
                    isValid = false;
                    errorMessage = 'Enrollment number must be at least 10 characters long';
                }
                break;
            case 'user-role':
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

    async saveUser(modal, userId = null) {
        const isEdit = userId !== null;
        const saveBtn = document.getElementById('save-user-btn');
        const btnText = saveBtn.querySelector('.btn-text');
        const loadingSpinner = saveBtn.querySelector('.loading-spinner');

        // Validate form
        const fields = ['user-name', 'user-email', 'user-phone', 'user-enrollNumber', 'user-role'];
        if (!isEdit) {
            fields.push('user-password');
        }

        let isValid = true;
        fields.forEach(fieldId => {
            if (!this.validateUserField(fieldId)) {
                isValid = false;
            }
        });

        if (!isValid) {
            return;
        }

        // Get form data
        const formData = {
            name: ValidationService.sanitizeInput(document.getElementById('user-name').value),
            email: ValidationService.sanitizeInput(document.getElementById('user-email').value),
            phone: ValidationService.sanitizeInput(document.getElementById('user-phone').value),
            enrollNumber: ValidationService.sanitizeInput(document.getElementById('user-enrollNumber').value),
            role: document.getElementById('user-role').value
        };

        const password = document.getElementById('user-password').value;
        if (password) {
            formData.password = password;
        }

        try {
            // Show loading state
            saveBtn.disabled = true;
            btnText.textContent = `${isEdit ? 'Updating' : 'Creating'}...`;
            loadingSpinner.classList.remove('d-none');

            if (isEdit) {
                // Keep existing data for fields not being updated
                const existingUser = this.users.find(u => u.id === userId);
                const updatedUser = {
                    ...existingUser,
                    ...formData
                };
                
                await this.usersService.updateUser(userId, updatedUser);
                this.showSuccess('User updated successfully');
            } else {
                await this.usersService.createUser(formData);
                this.showSuccess('User created successfully');
            }

            modal.close();
            await this.loadUsers();
        } catch (error) {
            console.error('Error saving user:', error);
            this.showError(error.message || 'Failed to save user');
        } finally {
            // Reset loading state
            saveBtn.disabled = false;
            btnText.textContent = `${isEdit ? 'Update' : 'Create'} User`;
            loadingSpinner.classList.add('d-none');
        }
    }

    async deleteUser(userId) {
        const user = this.users.find(u => u.id === userId);
        if (!user) return;

        const confirmed = await Modal.confirm(
            `Are you sure you want to delete user "${user.name}"? This action cannot be undone.`,
            'Delete User'
        );

        if (!confirmed) return;

        try {
            await this.usersService.deleteUser(userId);
            this.showSuccess('User deleted successfully');
            await this.loadUsers();
        } catch (error) {
            console.error('Error deleting user:', error);
            this.showError('Failed to delete user');
        }
    }

    showSuccess(message) {
        const successDiv = document.createElement('div');
        successDiv.className = 'alert alert-success';
        successDiv.textContent = message;
        
        const contentArea = document.querySelector('.content-area');
        contentArea.insertBefore(successDiv, contentArea.firstChild);
        
        setTimeout(() => {
            successDiv.remove();
        }, 5000);
    }

    showError(message) {
        const errorDiv = document.createElement('div');
        errorDiv.className = 'alert alert-error';
        errorDiv.textContent = message;
        
        const contentArea = document.querySelector('.content-area');
        contentArea.insertBefore(errorDiv, contentArea.firstChild);
        
        setTimeout(() => {
            errorDiv.remove();
        }, 5000);
    }
}
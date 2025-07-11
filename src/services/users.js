// Users Service
export class UsersService {
    constructor() {
        this.baseUrl = 'http://localhost:3000';
    }

    async getUsers() {
        try {
            const response = await fetch(`${this.baseUrl}/users`);
            if (!response.ok) {
                throw new Error('Failed to fetch users');
            }
            return await response.json();
        } catch (error) {
            throw new Error(error.message || 'Failed to fetch users');
        }
    }

    async createUser(userData) {
        try {
            const response = await fetch(`${this.baseUrl}/users`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    ...userData,
                    id: Date.now(),
                    dateOfAdmission: new Date().toLocaleDateString('en-GB', {
                        day: '2-digit',
                        month: 'short',
                        year: 'numeric'
                    })
                })
            });

            if (!response.ok) {
                throw new Error('Failed to create user');
            }

            return await response.json();
        } catch (error) {
            throw new Error(error.message || 'Failed to create user');
        }
    }

    async updateUser(id, userData) {
        try {
            const response = await fetch(`${this.baseUrl}/users/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(userData)
            });

            if (!response.ok) {
                throw new Error('Failed to update user');
            }

            return await response.json();
        } catch (error) {
            throw new Error(error.message || 'Failed to update user');
        }
    }

    async deleteUser(id) {
        try {
            const response = await fetch(`${this.baseUrl}/users/${id}`, {
                method: 'DELETE'
            });

            if (!response.ok) {
                throw new Error('Failed to delete user');
            }

            return true;
        } catch (error) {
            throw new Error(error.message || 'Failed to delete user');
        }
    }

    async getUserById(id) {
        try {
            const response = await fetch(`${this.baseUrl}/users/${id}`);
            if (!response.ok) {
                throw new Error('Failed to fetch user');
            }
            return await response.json();
        } catch (error) {
            throw new Error(error.message || 'Failed to fetch user');
        }
    }
}
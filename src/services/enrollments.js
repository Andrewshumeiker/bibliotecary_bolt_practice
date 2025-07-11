// Enrollments Service
export class EnrollmentsService {
    constructor() {
        this.baseUrl = 'http://localhost:3000';
    }

    async getEnrollments() {
        try {
            const response = await fetch(`${this.baseUrl}/enrollments`);
            if (!response.ok) {
                throw new Error('Failed to fetch enrollments');
            }
            return await response.json();
        } catch (error) {
            throw new Error(error.message || 'Failed to fetch enrollments');
        }
    }

    async createEnrollment(userId, courseId) {
        try {
            // Check if enrollment already exists
            const existingEnrollments = await this.getEnrollments();
            const existingEnrollment = existingEnrollments.find(
                e => e.userId === userId && e.courseId === courseId
            );

            if (existingEnrollment) {
                throw new Error('Already enrolled in this course');
            }

            const response = await fetch(`${this.baseUrl}/enrollments`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    id: Date.now(),
                    userId,
                    courseId
                })
            });

            if (!response.ok) {
                throw new Error('Failed to create enrollment');
            }

            return await response.json();
        } catch (error) {
            throw new Error(error.message || 'Failed to create enrollment');
        }
    }

    async deleteEnrollment(id) {
        try {
            const response = await fetch(`${this.baseUrl}/enrollments/${id}`, {
                method: 'DELETE'
            });

            if (!response.ok) {
                throw new Error('Failed to delete enrollment');
            }

            return true;
        } catch (error) {
            throw new Error(error.message || 'Failed to delete enrollment');
        }
    }

    async getUserEnrollments(userId) {
        try {
            const enrollments = await this.getEnrollments();
            return enrollments.filter(e => e.userId === userId);
        } catch (error) {
            throw new Error(error.message || 'Failed to fetch user enrollments');
        }
    }

    async getCourseEnrollments(courseId) {
        try {
            const enrollments = await this.getEnrollments();
            return enrollments.filter(e => e.courseId === courseId);
        } catch (error) {
            throw new Error(error.message || 'Failed to fetch course enrollments');
        }
    }

    async isUserEnrolled(userId, courseId) {
        try {
            const enrollments = await this.getEnrollments();
            return enrollments.some(e => e.userId === userId && e.courseId === courseId);
        } catch (error) {
            console.error('Error checking enrollment:', error);
            return false;
        }
    }
}
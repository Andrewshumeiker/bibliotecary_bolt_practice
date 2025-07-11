// Courses Service
export class CoursesService {
    constructor() {
        this.baseUrl = 'http://localhost:3000';
    }

    async getCourses() {
        try {
            const response = await fetch(`${this.baseUrl}/courses`);
            if (!response.ok) {
                throw new Error('Failed to fetch courses');
            }
            return await response.json();
        } catch (error) {
            throw new Error(error.message || 'Failed to fetch courses');
        }
    }

    async createCourse(courseData) {
        try {
            const response = await fetch(`${this.baseUrl}/courses`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    ...courseData,
                    id: Date.now()
                })
            });

            if (!response.ok) {
                throw new Error('Failed to create course');
            }

            return await response.json();
        } catch (error) {
            throw new Error(error.message || 'Failed to create course');
        }
    }

    async updateCourse(id, courseData) {
        try {
            const response = await fetch(`${this.baseUrl}/courses/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(courseData)
            });

            if (!response.ok) {
                throw new Error('Failed to update course');
            }

            return await response.json();
        } catch (error) {
            throw new Error(error.message || 'Failed to update course');
        }
    }

    async deleteCourse(id) {
        try {
            const response = await fetch(`${this.baseUrl}/courses/${id}`, {
                method: 'DELETE'
            });

            if (!response.ok) {
                throw new Error('Failed to delete course');
            }

            return true;
        } catch (error) {
            throw new Error(error.message || 'Failed to delete course');
        }
    }

    async getCourseById(id) {
        try {
            const response = await fetch(`${this.baseUrl}/courses/${id}`);
            if (!response.ok) {
                throw new Error('Failed to fetch course');
            }
            return await response.json();
        } catch (error) {
            throw new Error(error.message || 'Failed to fetch course');
        }
    }
}
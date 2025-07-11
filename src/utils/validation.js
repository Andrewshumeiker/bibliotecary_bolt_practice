// Validation Service
export class ValidationService {
    static validateEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    static validatePassword(password) {
        return password && password.length >= 6;
    }

    static validatePhone(phone) {
        const phoneRegex = /^[\d\s\-\+\(\)]+$/;
        return phone && phoneRegex.test(phone) && phone.length >= 10;
    }

    static validateEnrollNumber(enrollNumber) {
        return enrollNumber && enrollNumber.length >= 10;
    }

    static validateUser(userData) {
        const errors = [];

        if (!userData.name || userData.name.trim().length < 2) {
            errors.push('Name must be at least 2 characters long');
        }

        if (!this.validateEmail(userData.email)) {
            errors.push('Please enter a valid email address');
        }

        if (!this.validatePassword(userData.password)) {
            errors.push('Password must be at least 6 characters long');
        }

        if (!this.validatePhone(userData.phone)) {
            errors.push('Please enter a valid phone number');
        }

        if (!this.validateEnrollNumber(userData.enrollNumber)) {
            errors.push('Enrollment number must be at least 10 characters long');
        }

        if (!userData.role || !['admin', 'visitor'].includes(userData.role)) {
            errors.push('Please select a valid role');
        }

        return {
            isValid: errors.length === 0,
            errors
        };
    }

    static validateCourse(courseData) {
        const errors = [];

        if (!courseData.title || courseData.title.trim().length < 3) {
            errors.push('Course title must be at least 3 characters long');
        }

        if (!courseData.description || courseData.description.trim().length < 10) {
            errors.push('Course description must be at least 10 characters long');
        }

        if (!courseData.startDate) {
            errors.push('Please select a start date');
        }

        if (!courseData.duration || courseData.duration.trim().length < 1) {
            errors.push('Please enter course duration');
        }

        return {
            isValid: errors.length === 0,
            errors
        };
    }

    static sanitizeInput(input) {
        if (typeof input !== 'string') return input;
        return input.trim().replace(/[<>]/g, '');
    }
}
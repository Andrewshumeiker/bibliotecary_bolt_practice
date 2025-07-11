// Courses Page
import { Header } from '../components/Header.js';
import { Sidebar } from '../components/Sidebar.js';
import { Modal } from '../components/Modal.js';
import { CoursesService } from '../services/courses.js';
import { EnrollmentsService } from '../services/enrollments.js';
import { ValidationService } from '../utils/validation.js';

export class CoursesPage {
    constructor() {
        this.header = new Header();
        this.sidebar = new Sidebar();
        this.coursesService = new CoursesService();
        this.enrollmentsService = new EnrollmentsService();
        this.courses = [];
        this.filteredCourses = [];
        this.currentSearch = '';
    }

    async render() {
        const app = document.getElementById('app');
        app.innerHTML = `
            <div class="dashboard-container">
                ${this.sidebar.render()}
                <div class="main-content">
                    ${this.header.render('Courses Management')}
                    <div class="content-area">
                        <div class="page-header">
                            <h2 class="page-title">Courses</h2>
                            <button class="btn btn-primary" id="add-course-btn">
                                <span>+</span>
                                Add Course
                            </button>
                        </div>
                        
                        <div class="search-filter-bar">
                            <input 
                                type="text" 
                                class="form-input search-input" 
                                placeholder="Search courses..." 
                                id="search-courses"
                            >
                        </div>
                        
                        <div class="card">
                            <div class="card-body">
                                <div class="table-container">
                                    <table class="table">
                                        <thead>
                                            <tr>
                                                <th>ID</th>
                                                <th>Title</th>
                                                <th>Description</th>
                                                <th>Start Date</th>
                                                <th>Duration</th>
                                                <th>Enrollments</th>
                                                <th>Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody id="courses-tbody">
                                            <tr>
                                                <td colspan="7" class="text-center">
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
        await this.loadCourses();
    }

    setupEventListeners() {
        this.header.setupEventListeners();
        this.sidebar.setupEventListeners();
        
        // Update active navigation
        document.querySelectorAll('.nav-link').forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('data-route') === '/courses') {
                link.classList.add('active');
            }
        });

        // Add course button
        document.getElementById('add-course-btn').addEventListener('click', () => {
            this.showCourseModal();
        });

        // Search
        document.getElementById('search-courses').addEventListener('input', (e) => {
            this.currentSearch = e.target.value.toLowerCase();
            this.filterCourses();
        });

        // Table actions
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('edit-course-btn')) {
                const courseId = parseInt(e.target.dataset.courseId);
                this.showCourseModal(courseId);
            } else if (e.target.classList.contains('delete-course-btn')) {
                const courseId = parseInt(e.target.dataset.courseId);
                this.deleteCourse(courseId);
            }
        });
    }

    async loadCourses() {
        try {
            const [courses, enrollments] = await Promise.all([
                this.coursesService.getCourses(),
                this.enrollmentsService.getEnrollments()
            ]);

            this.courses = courses.map(course => ({
                ...course,
                enrollmentCount: enrollments.filter(e => e.courseId === course.id).length
            }));

            this.filteredCourses = [...this.courses];
            this.renderCoursesTable();
        } catch (error) {
            console.error('Error loading courses:', error);
            this.showError('Failed to load courses');
        }
    }

    filterCourses() {
        this.filteredCourses = this.courses.filter(course => {
            return course.title.toLowerCase().includes(this.currentSearch) ||
                   course.description.toLowerCase().includes(this.currentSearch) ||
                   course.duration.toLowerCase().includes(this.currentSearch);
        });
        
        this.renderCoursesTable();
    }

    renderCoursesTable() {
        const tbody = document.getElementById('courses-tbody');
        
        if (this.filteredCourses.length === 0) {
            tbody.innerHTML = `
                <tr>
                    <td colspan="7" class="text-center">No courses found</td>
                </tr>
            `;
            return;
        }

        tbody.innerHTML = this.filteredCourses.map(course => `
            <tr>
                <td>${course.id}</td>
                <td>${course.title}</td>
                <td>${course.description.substring(0, 50)}${course.description.length > 50 ? '...' : ''}</td>
                <td>${course.startDate}</td>
                <td>${course.duration}</td>
                <td>
                    <span class="badge badge-info">${course.enrollmentCount} enrolled</span>
                </td>
                <td>
                    <div class="d-flex gap-2">
                        <button class="btn btn-sm btn-secondary edit-course-btn" data-course-id="${course.id}">
                            Edit
                        </button>
                        <button class="btn btn-sm btn-danger delete-course-btn" data-course-id="${course.id}">
                            Delete
                        </button>
                    </div>
                </td>
            </tr>
        `).join('');
    }

    showCourseModal(courseId = null) {
        const isEdit = courseId !== null;
        const course = isEdit ? this.courses.find(c => c.id === courseId) : null;

        const form = document.createElement('div');
        form.innerHTML = `
            <form id="course-form">
                <div class="form-group">
                    <label for="course-title" class="form-label">Course Title</label>
                    <input type="text" id="course-title" class="form-input" value="${course ? course.title : ''}" required>
                    <div class="form-error" id="course-title-error"></div>
                </div>
                <div class="form-group">
                    <label for="course-description" class="form-label">Description</label>
                    <textarea id="course-description" class="form-textarea" required>${course ? course.description : ''}</textarea>
                    <div class="form-error" id="course-description-error"></div>
                </div>
                <div class="form-group">
                    <label for="course-startDate" class="form-label">Start Date</label>
                    <input type="date" id="course-startDate" class="form-input" value="${course ? this.formatDateForInput(course.startDate) : ''}" required>
                    <div class="form-error" id="course-startDate-error"></div>
                </div>
                <div class="form-group">
                    <label for="course-duration" class="form-label">Duration</label>
                    <input type="text" id="course-duration" class="form-input" value="${course ? course.duration : ''}" placeholder="e.g., 4 weeks" required>
                    <div class="form-error" id="course-duration-error"></div>
                </div>
            </form>
        `;

        const footer = document.createElement('div');
        footer.className = 'd-flex gap-2';
        footer.innerHTML = `
            <button class="btn btn-secondary" id="cancel-course-btn">Cancel</button>
            <button class="btn btn-primary" id="save-course-btn">
                <span class="btn-text">${isEdit ? 'Update' : 'Create'} Course</span>
                <span class="loading-spinner d-none"></span>
            </button>
        `;

        const modal = new Modal(
            isEdit ? 'Edit Course' : 'Add New Course',
            form,
            { footer }
        );

        modal.render();

        // Setup modal event listeners
        document.getElementById('cancel-course-btn').addEventListener('click', () => {
            modal.close();
        });

        document.getElementById('save-course-btn').addEventListener('click', async () => {
            await this.saveCourse(modal, courseId);
        });

        // Form validation
        const inputs = form.querySelectorAll('.form-input, .form-textarea');
        inputs.forEach(input => {
            input.addEventListener('blur', () => {
                this.validateCourseField(input.id);
            });
        });
    }

    validateCourseField(fieldId) {
        const field = document.getElementById(fieldId);
        const error = document.getElementById(`${fieldId}-error`);
        const value = field.value.trim();

        let isValid = true;
        let errorMessage = '';

        switch (fieldId) {
            case 'course-title':
                if (!value || value.length < 3) {
                    isValid = false;
                    errorMessage = 'Course title must be at least 3 characters long';
                }
                break;
            case 'course-description':
                if (!value || value.length < 10) {
                    isValid = false;
                    errorMessage = 'Course description must be at least 10 characters long';
                }
                break;
            case 'course-startDate':
                if (!value) {
                    isValid = false;
                    errorMessage = 'Please select a start date';
                }
                break;
            case 'course-duration':
                if (!value || value.length < 1) {
                    isValid = false;
                    errorMessage = 'Please enter course duration';
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

    async saveCourse(modal, courseId = null) {
        const isEdit = courseId !== null;
        const saveBtn = document.getElementById('save-course-btn');
        const btnText = saveBtn.querySelector('.btn-text');
        const loadingSpinner = saveBtn.querySelector('.loading-spinner');

        // Validate form
        const fields = ['course-title', 'course-description', 'course-startDate', 'course-duration'];
        let isValid = true;
        fields.forEach(fieldId => {
            if (!this.validateCourseField(fieldId)) {
                isValid = false;
            }
        });

        if (!isValid) {
            return;
        }

        // Get form data
        const formData = {
            title: ValidationService.sanitizeInput(document.getElementById('course-title').value),
            description: ValidationService.sanitizeInput(document.getElementById('course-description').value),
            startDate: this.formatDateForDisplay(document.getElementById('course-startDate').value),
            duration: ValidationService.sanitizeInput(document.getElementById('course-duration').value)
        };

        try {
            // Show loading state
            saveBtn.disabled = true;
            btnText.textContent = `${isEdit ? 'Updating' : 'Creating'}...`;
            loadingSpinner.classList.remove('d-none');

            if (isEdit) {
                await this.coursesService.updateCourse(courseId, formData);
                this.showSuccess('Course updated successfully');
            } else {
                await this.coursesService.createCourse(formData);
                this.showSuccess('Course created successfully');
            }

            modal.close();
            await this.loadCourses();
        } catch (error) {
            console.error('Error saving course:', error);
            this.showError(error.message || 'Failed to save course');
        } finally {
            // Reset loading state
            saveBtn.disabled = false;
            btnText.textContent = `${isEdit ? 'Update' : 'Create'} Course`;
            loadingSpinner.classList.add('d-none');
        }
    }

    async deleteCourse(courseId) {
        const course = this.courses.find(c => c.id === courseId);
        if (!course) return;

        const confirmed = await Modal.confirm(
            `Are you sure you want to delete course "${course.title}"? This action cannot be undone.`,
            'Delete Course'
        );

        if (!confirmed) return;

        try {
            await this.coursesService.deleteCourse(courseId);
            this.showSuccess('Course deleted successfully');
            await this.loadCourses();
        } catch (error) {
            console.error('Error deleting course:', error);
            this.showError('Failed to delete course');
        }
    }

    formatDateForInput(dateString) {
        // Convert "10-Jul-2025" to "2025-07-10"
        const date = new Date(dateString);
        if (isNaN(date.getTime())) {
            return '';
        }
        return date.toISOString().split('T')[0];
    }

    formatDateForDisplay(dateString) {
        // Convert "2025-07-10" to "10-Jul-2025"
        const date = new Date(dateString);
        if (isNaN(date.getTime())) {
            return dateString;
        }
        return date.toLocaleDateString('en-GB', {
            day: '2-digit',
            month: 'short',
            year: 'numeric'
        });
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
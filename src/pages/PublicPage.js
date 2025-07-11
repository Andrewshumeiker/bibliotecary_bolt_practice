// Public Page (Visitor View)
import { Header } from '../components/Header.js';
import { Sidebar } from '../components/Sidebar.js';
import { CoursesService } from '../services/courses.js';
import { EnrollmentsService } from '../services/enrollments.js';
import { AuthService } from '../services/auth.js';

export class PublicPage {
    constructor() {
        this.header = new Header();
        this.sidebar = new Sidebar();
        this.coursesService = new CoursesService();
        this.enrollmentsService = new EnrollmentsService();
        this.authService = new AuthService();
        this.courses = [];
        this.userEnrollments = [];
    }

    async render() {
        const app = document.getElementById('app');
        app.innerHTML = `
            <div class="dashboard-container">
                ${this.sidebar.render()}
                <div class="main-content">
                    ${this.header.render('Available Courses')}
                    <div class="content-area">
                        <div class="page-header">
                            <h2 class="page-title">Explore Courses</h2>
                        </div>
                        
                        <div class="search-filter-bar">
                            <input 
                                type="text" 
                                class="form-input search-input" 
                                placeholder="Search courses..." 
                                id="search-courses"
                            >
                        </div>
                        
                        <div class="course-grid" id="course-grid">
                            <div class="course-card">
                                <div class="course-card-body">
                                    <div class="loading-spinner"></div>
                                    <p class="text-center mt-2">Loading courses...</p>
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
            if (link.getAttribute('data-route') === '/public') {
                link.classList.add('active');
            }
        });

        // Search
        document.getElementById('search-courses').addEventListener('input', (e) => {
            this.filterCourses(e.target.value.toLowerCase());
        });

        // Course actions
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('enroll-btn')) {
                const courseId = parseInt(e.target.dataset.courseId);
                this.enrollInCourse(courseId);
            } else if (e.target.classList.contains('unenroll-btn')) {
                const courseId = parseInt(e.target.dataset.courseId);
                this.unenrollFromCourse(courseId);
            }
        });
    }

    async loadCourses() {
        try {
            const user = this.authService.getCurrentUser();
            const [courses, enrollments] = await Promise.all([
                this.coursesService.getCourses(),
                this.enrollmentsService.getUserEnrollments(user.id)
            ]);

            this.courses = courses;
            this.userEnrollments = enrollments;
            this.renderCourses();
        } catch (error) {
            console.error('Error loading courses:', error);
            this.showError('Failed to load courses');
        }
    }

    filterCourses(searchTerm) {
        const filteredCourses = this.courses.filter(course => {
            return course.title.toLowerCase().includes(searchTerm) ||
                   course.description.toLowerCase().includes(searchTerm) ||
                   course.duration.toLowerCase().includes(searchTerm);
        });
        
        this.renderCourses(filteredCourses);
    }

    renderCourses(coursesToRender = this.courses) {
        const grid = document.getElementById('course-grid');
        
        if (coursesToRender.length === 0) {
            grid.innerHTML = `
                <div class="course-card">
                    <div class="course-card-body text-center">
                        <p>No courses found</p>
                    </div>
                </div>
            `;
            return;
        }

        grid.innerHTML = coursesToRender.map(course => {
            const isEnrolled = this.userEnrollments.some(e => e.courseId === course.id);
            
            return `
                <div class="course-card">
                    <div class="course-card-body">
                        <h3 class="course-title">${course.title}</h3>
                        <p class="course-description">${course.description}</p>
                        <div class="course-meta">
                            <span>📅 ${course.startDate}</span>
                            <span>⏱️ ${course.duration}</span>
                        </div>
                        <div class="course-actions">
                            ${isEnrolled ? `
                                <button class="btn btn-danger btn-sm unenroll-btn" data-course-id="${course.id}">
                                    Unenroll
                                </button>
                                <span class="badge badge-success">Enrolled</span>
                            ` : `
                                <button class="btn btn-primary btn-sm enroll-btn" data-course-id="${course.id}">
                                    Enroll Now
                                </button>
                            `}
                        </div>
                    </div>
                </div>
            `;
        }).join('');
    }

    async enrollInCourse(courseId) {
        const user = this.authService.getCurrentUser();
        const course = this.courses.find(c => c.id === courseId);
        
        if (!course) {
            this.showError('Course not found');
            return;
        }

        try {
            await this.enrollmentsService.createEnrollment(user.id, courseId);
            this.showSuccess(`Successfully enrolled in "${course.title}"`);
            await this.loadCourses(); // Refresh to update UI
        } catch (error) {
            console.error('Error enrolling in course:', error);
            this.showError(error.message || 'Failed to enroll in course');
        }
    }

    async unenrollFromCourse(courseId) {
        const user = this.authService.getCurrentUser();
        const course = this.courses.find(c => c.id === courseId);
        const enrollment = this.userEnrollments.find(e => e.courseId === courseId);
        
        if (!course || !enrollment) {
            this.showError('Enrollment not found');
            return;
        }

        try {
            await this.enrollmentsService.deleteEnrollment(enrollment.id);
            this.showSuccess(`Successfully unenrolled from "${course.title}"`);
            await this.loadCourses(); // Refresh to update UI
        } catch (error) {
            console.error('Error unenrolling from course:', error);
            this.showError(error.message || 'Failed to unenroll from course');
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
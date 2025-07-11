// My Courses Page
import { Header } from '../components/Header.js';
import { Sidebar } from '../components/Sidebar.js';
import { CoursesService } from '../services/courses.js';
import { EnrollmentsService } from '../services/enrollments.js';
import { AuthService } from '../services/auth.js';

export class MyCoursesPage {
    constructor() {
        this.header = new Header();
        this.sidebar = new Sidebar();
        this.coursesService = new CoursesService();
        this.enrollmentsService = new EnrollmentsService();
        this.authService = new AuthService();
        this.enrolledCourses = [];
    }

    async render() {
        const app = document.getElementById('app');
        app.innerHTML = `
            <div class="dashboard-container">
                ${this.sidebar.render()}
                <div class="main-content">
                    ${this.header.render('My Courses')}
                    <div class="content-area">
                        <div class="page-header">
                            <h2 class="page-title">My Enrolled Courses</h2>
                        </div>
                        
                        <div class="course-grid" id="enrolled-courses-grid">
                            <div class="course-card">
                                <div class="course-card-body">
                                    <div class="loading-spinner"></div>
                                    <p class="text-center mt-2">Loading your courses...</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;

        this.setupEventListeners();
        await this.loadEnrolledCourses();
    }

    setupEventListeners() {
        this.header.setupEventListeners();
        this.sidebar.setupEventListeners();
        
        // Update active navigation
        document.querySelectorAll('.nav-link').forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('data-route') === '/my-courses') {
                link.classList.add('active');
            }
        });

        // Course actions
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('unenroll-btn')) {
                const courseId = parseInt(e.target.dataset.courseId);
                this.unenrollFromCourse(courseId);
            }
        });
    }

    async loadEnrolledCourses() {
        try {
            const user = this.authService.getCurrentUser();
            const [allCourses, userEnrollments] = await Promise.all([
                this.coursesService.getCourses(),
                this.enrollmentsService.getUserEnrollments(user.id)
            ]);

            // Get only enrolled courses
            this.enrolledCourses = allCourses.filter(course => 
                userEnrollments.some(enrollment => enrollment.courseId === course.id)
            ).map(course => ({
                ...course,
                enrollmentId: userEnrollments.find(e => e.courseId === course.id).id
            }));

            this.renderEnrolledCourses();
        } catch (error) {
            console.error('Error loading enrolled courses:', error);
            this.showError('Failed to load your courses');
        }
    }

    renderEnrolledCourses() {
        const grid = document.getElementById('enrolled-courses-grid');
        
        if (this.enrolledCourses.length === 0) {
            grid.innerHTML = `
                <div class="course-card">
                    <div class="course-card-body text-center">
                        <h3>No Courses Yet</h3>
                        <p>You haven't enrolled in any courses yet. Visit the <a href="/public" class="text-primary">explore page</a> to find courses.</p>
                    </div>
                </div>
            `;
            return;
        }

        grid.innerHTML = this.enrolledCourses.map(course => `
            <div class="course-card">
                <div class="course-card-body">
                    <h3 class="course-title">${course.title}</h3>
                    <p class="course-description">${course.description}</p>
                    <div class="course-meta">
                        <span>📅 ${course.startDate}</span>
                        <span>⏱️ ${course.duration}</span>
                    </div>
                    <div class="course-actions">
                        <button class="btn btn-danger btn-sm unenroll-btn" data-course-id="${course.id}">
                            Unenroll
                        </button>
                        <span class="badge badge-success">Enrolled</span>
                    </div>
                </div>
            </div>
        `).join('');
    }

    async unenrollFromCourse(courseId) {
        const course = this.enrolledCourses.find(c => c.id === courseId);
        
        if (!course) {
            this.showError('Course not found');
            return;
        }

        try {
            await this.enrollmentsService.deleteEnrollment(course.enrollmentId);
            this.showSuccess(`Successfully unenrolled from "${course.title}"`);
            await this.loadEnrolledCourses(); // Refresh to update UI
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
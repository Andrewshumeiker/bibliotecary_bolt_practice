// Dashboard Page
import { Header } from '../components/Header.js';
import { Sidebar } from '../components/Sidebar.js';
import { UsersService } from '../services/users.js';
import { CoursesService } from '../services/courses.js';
import { EnrollmentsService } from '../services/enrollments.js';

export class DashboardPage {
    constructor() {
        this.header = new Header();
        this.sidebar = new Sidebar();
        this.usersService = new UsersService();
        this.coursesService = new CoursesService();
        this.enrollmentsService = new EnrollmentsService();
    }

    async render() {
        const app = document.getElementById('app');
        app.innerHTML = `
            <div class="dashboard-container">
                ${this.sidebar.render()}
                <div class="main-content">
                    ${this.header.render('Dashboard')}
                    <div class="content-area">
                        <div class="page-header">
                            <h2 class="page-title">Dashboard Overview</h2>
                        </div>
                        <div class="stats-grid" id="stats-grid">
                            <div class="stat-card">
                                <div class="stat-value" id="total-users">
                                    <div class="loading-spinner"></div>
                                </div>
                                <div class="stat-label">Total Users</div>
                            </div>
                            <div class="stat-card">
                                <div class="stat-value" id="total-courses">
                                    <div class="loading-spinner"></div>
                                </div>
                                <div class="stat-label">Total Courses</div>
                            </div>
                            <div class="stat-card">
                                <div class="stat-value" id="total-enrollments">
                                    <div class="loading-spinner"></div>
                                </div>
                                <div class="stat-label">Total Enrollments</div>
                            </div>
                            <div class="stat-card">
                                <div class="stat-value" id="admin-users">
                                    <div class="loading-spinner"></div>
                                </div>
                                <div class="stat-label">Admin Users</div>
                            </div>
                        </div>
                        
                        <div class="card">
                            <div class="card-header">
                                <h3 class="card-title">Recent Activity</h3>
                            </div>
                            <div class="card-body">
                                <div class="table-container">
                                    <table class="table">
                                        <thead>
                                            <tr>
                                                <th>User</th>
                                                <th>Course</th>
                                                <th>Action</th>
                                                <th>Date</th>
                                            </tr>
                                        </thead>
                                        <tbody id="recent-activity">
                                            <tr>
                                                <td colspan="4" class="text-center">
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
        await this.loadDashboardData();
    }

    setupEventListeners() {
        this.header.setupEventListeners();
        this.sidebar.setupEventListeners();
        
        // Update active navigation
        document.querySelectorAll('.nav-link').forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('data-route') === '/dashboard') {
                link.classList.add('active');
            }
        });
    }

    async loadDashboardData() {
        try {
            // Load all data concurrently
            const [users, courses, enrollments] = await Promise.all([
                this.usersService.getUsers(),
                this.coursesService.getCourses(),
                this.enrollmentsService.getEnrollments()
            ]);

            // Update stats
            document.getElementById('total-users').textContent = users.length;
            document.getElementById('total-courses').textContent = courses.length;
            document.getElementById('total-enrollments').textContent = enrollments.length;
            
            const adminUsers = users.filter(user => user.role === 'admin');
            document.getElementById('admin-users').textContent = adminUsers.length;

            // Update recent activity
            await this.loadRecentActivity(users, courses, enrollments);
        } catch (error) {
            console.error('Error loading dashboard data:', error);
            this.showError('Failed to load dashboard data');
        }
    }

    async loadRecentActivity(users, courses, enrollments) {
        const tbody = document.getElementById('recent-activity');
        
        try {
            // Create recent activity data (simulated)
            const recentActivities = enrollments.slice(-5).map(enrollment => {
                const user = users.find(u => u.id === enrollment.userId);
                const course = courses.find(c => c.id === enrollment.courseId);
                
                return {
                    user: user ? user.name : 'Unknown User',
                    course: course ? course.title : 'Unknown Course',
                    action: 'Enrolled',
                    date: new Date().toLocaleDateString()
                };
            });

            if (recentActivities.length === 0) {
                tbody.innerHTML = `
                    <tr>
                        <td colspan="4" class="text-center">No recent activity</td>
                    </tr>
                `;
                return;
            }

            tbody.innerHTML = recentActivities.map(activity => `
                <tr>
                    <td>${activity.user}</td>
                    <td>${activity.course}</td>
                    <td>
                        <span class="badge badge-success">${activity.action}</span>
                    </td>
                    <td>${activity.date}</td>
                </tr>
            `).join('');
        } catch (error) {
            tbody.innerHTML = `
                <tr>
                    <td colspan="4" class="text-center text-error">Failed to load recent activity</td>
                </tr>
            `;
        }
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
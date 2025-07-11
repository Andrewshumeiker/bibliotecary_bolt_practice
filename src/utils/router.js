// Simple Router
export class Router {
    constructor() {
        this.routes = new Map();
    }

    addRoute(path, handler) {
        this.routes.set(path, handler);
    }

    navigate(path) {
        history.pushState(null, null, path);
        this.handleRouteChange();
    }

    handleRouteChange() {
        const path = window.location.pathname;
        const handler = this.routes.get(path);
        
        if (handler) {
            handler();
        } else {
            // Fallback to home
            this.navigate('/');
        }
    }

    start() {
        this.handleRouteChange();
    }
}
// Modal Component
export class Modal {
    constructor(title, content, options = {}) {
        this.title = title;
        this.content = content;
        this.options = {
            size: 'medium',
            closable: true,
            ...options
        };
        this.overlay = null;
        this.modal = null;
    }

    render() {
        // Create overlay
        this.overlay = document.createElement('div');
        this.overlay.className = 'modal-overlay';
        
        // Create modal
        this.modal = document.createElement('div');
        this.modal.className = `modal modal-${this.options.size}`;
        
        // Modal header
        const header = document.createElement('div');
        header.className = 'modal-header';
        
        const title = document.createElement('h3');
        title.className = 'modal-title';
        title.textContent = this.title;
        
        header.appendChild(title);
        
        if (this.options.closable) {
            const closeBtn = document.createElement('button');
            closeBtn.className = 'modal-close';
            closeBtn.innerHTML = '×';
            closeBtn.onclick = () => this.close();
            header.appendChild(closeBtn);
        }
        
        // Modal body
        const body = document.createElement('div');
        body.className = 'modal-body';
        
        if (typeof this.content === 'string') {
            body.innerHTML = this.content;
        } else {
            body.appendChild(this.content);
        }
        
        // Assemble modal
        this.modal.appendChild(header);
        this.modal.appendChild(body);
        
        // Add footer if provided
        if (this.options.footer) {
            const footer = document.createElement('div');
            footer.className = 'modal-footer';
            footer.appendChild(this.options.footer);
            this.modal.appendChild(footer);
        }
        
        this.overlay.appendChild(this.modal);
        
        // Add to DOM
        const container = document.getElementById('modal-container');
        container.appendChild(this.overlay);
        
        // Show modal
        setTimeout(() => {
            this.overlay.classList.add('active');
        }, 10);
        
        // Close on overlay click
        this.overlay.onclick = (e) => {
            if (e.target === this.overlay) {
                this.close();
            }
        };
        
        // Handle ESC key
        this.handleEscKey = (e) => {
            if (e.key === 'Escape' && this.options.closable) {
                this.close();
            }
        };
        
        document.addEventListener('keydown', this.handleEscKey);
        
        return this.overlay;
    }

    close() {
        if (this.overlay) {
            this.overlay.classList.remove('active');
            
            setTimeout(() => {
                if (this.overlay && this.overlay.parentNode) {
                    this.overlay.parentNode.removeChild(this.overlay);
                }
                document.removeEventListener('keydown', this.handleEscKey);
            }, 300);
        }
    }

    static confirm(message, title = 'Confirm') {
        return new Promise((resolve) => {
            const content = document.createElement('div');
            content.innerHTML = `<p>${message}</p>`;
            
            const footer = document.createElement('div');
            footer.className = 'd-flex gap-2';
            
            const cancelBtn = document.createElement('button');
            cancelBtn.className = 'btn btn-secondary';
            cancelBtn.textContent = 'Cancel';
            
            const confirmBtn = document.createElement('button');
            confirmBtn.className = 'btn btn-danger';
            confirmBtn.textContent = 'Confirm';
            
            footer.appendChild(cancelBtn);
            footer.appendChild(confirmBtn);
            
            const modal = new Modal(title, content, { 
                footer,
                closable: true
            });
            
            modal.render();
            
            cancelBtn.onclick = () => {
                modal.close();
                resolve(false);
            };
            
            confirmBtn.onclick = () => {
                modal.close();
                resolve(true);
            };
        });
    }
}
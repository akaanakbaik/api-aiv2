class NotificationSystem {
  constructor() {
    this.element = document.getElementById('notification');
    this.hideTimeout = null;
    this.init();
  }

  init() {
    let startY = 0;
    let startX = 0;
    let currentY = 0;
    let currentX = 0;
    let isDragging = false;

    this.element.addEventListener('touchstart', (e) => {
      startY = e.touches[0].clientY;
      startX = e.touches[0].clientX;
      isDragging = true;
    }, { passive: true });

    this.element.addEventListener('touchmove', (e) => {
      if (!isDragging) return;
      currentY = e.touches[0].clientY;
      currentX = e.touches[0].clientX;
      
      const deltaY = currentY - startY;
      const deltaX = Math.abs(currentX - startX);
      
      if (deltaY < -50 || deltaX > 100) {
        this.hide();
        isDragging = false;
      }
    }, { passive: true });

    this.element.addEventListener('touchend', () => {
      isDragging = false;
    });

    this.element.addEventListener('click', () => {
      this.hide();
    });
  }

  show(message, type = 'info') {
    this.clearTimeout();
    this.element.textContent = message;
    this.element.className = `notification ${type} show`;
    
    this.hideTimeout = setTimeout(() => {
      this.hide();
    }, 1500);
  }

  success(message) {
    this.show(message, 'success');
  }

  error(message) {
    this.show(message, 'error');
  }

  hide() {
    this.element.classList.remove('show');
    this.clearTimeout();
  }

  clearTimeout() {
    if (this.hideTimeout) {
      clearTimeout(this.hideTimeout);
      this.hideTimeout = null;
    }
  }
}

window.notification = new NotificationSystem();

/**
 * Interactive Bubble Background for AI Creations Section
 * Features:
 * - Floating bubbles with vivid colors
 * - Mouse interaction: Repel force
 * - Click interaction: Explosion effect
 */

class BubbleBackground {
    constructor(containerId) {
        this.container = document.getElementById(containerId);
        if (!this.container) return;

        this.canvas = document.createElement('canvas');
        this.ctx = this.canvas.getContext('2d');
        // Ensure canvas is positioned absolutely behind content
        this.canvas.style.position = 'absolute';
        this.canvas.style.top = '0';
        this.canvas.style.left = '0';
        this.canvas.style.width = '100%';
        this.canvas.style.height = '100%';
        this.canvas.style.zIndex = '0';
        // Allow canvas to receive mouse events for interaction
        // Note: Content like links/buttons in .container (z-index: 2) will still be clickable
        this.canvas.style.pointerEvents = 'auto';
        this.container.appendChild(this.canvas);

        this.bubbles = [];
        this.bubbleCount = 50; // Number of bubbles
        this.mouse = { x: null, y: null };
        this.clickPulse = { x: null, y: null, force: 0, active: false };

        // Vibrant colors (Blue, Purple, Red, Orange) with transparency
        this.colors = [
            'rgba(0, 122, 255, 0.6)',   // Blue
            'rgba(88, 86, 214, 0.6)',   // Purple
            'rgba(255, 36, 66, 0.6)',   // Red (XHS)
            'rgba(255, 149, 0, 0.6)'    // Orange
        ];

        this.init();
        this.animate();
        this.addEventListeners();
    }

    init() {
        this.resize();
        this.createBubbles();
    }

    resize() {
        this.canvas.width = this.container.offsetWidth;
        this.canvas.height = this.container.offsetHeight;
    }

    createBubbles() {
        this.bubbles = [];
        // Adjust bubble count based on screen size
        const count = window.innerWidth < 768 ? 30 : 60;

        for (let i = 0; i < count; i++) {
            this.bubbles.push(new Bubble(this.canvas, this.colors));
        }
    }

    addEventListeners() {
        window.addEventListener('resize', () => {
            this.resize();
            this.createBubbles();
        });

        this.container.addEventListener('mousemove', (e) => {
            const rect = this.canvas.getBoundingClientRect();
            this.mouse.x = e.clientX - rect.left;
            this.mouse.y = e.clientY - rect.top;
        });

        this.container.addEventListener('mouseleave', () => {
            this.mouse.x = null;
            this.mouse.y = null;
        });

        this.container.addEventListener('click', (e) => {
            const rect = this.canvas.getBoundingClientRect();
            this.clickPulse.x = e.clientX - rect.left;
            this.clickPulse.y = e.clientY - rect.top;
            this.clickPulse.force = 20; // Explosion force
            this.clickPulse.active = true;

            // Reset pulse after a short time
            setTimeout(() => {
                this.clickPulse.active = false;
            }, 300);
        });
    }

    animate() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        this.bubbles.forEach(bubble => {
            bubble.update(this.mouse, this.clickPulse);
            bubble.draw(this.ctx);
        });

        requestAnimationFrame(this.animate.bind(this));
    }
}

class Bubble {
    constructor(canvas, colors) {
        this.canvas = canvas;
        this.radius = Math.random() * 20 + 10; // Radius 10-30
        this.x = Math.random() * (canvas.width - this.radius * 2) + this.radius;
        this.y = Math.random() * (canvas.height - this.radius * 2) + this.radius;
        this.dx = (Math.random() - 0.5) * 1; // Slow horizontal drift
        this.dy = (Math.random() - 0.5) * 1; // Slow vertical drift
        this.color = colors[Math.floor(Math.random() * colors.length)];
        this.originalRadius = this.radius;
    }

    draw(ctx) {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
        ctx.fillStyle = this.color;
        ctx.fill();

        // Add a shine effect
        ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
        ctx.beginPath();
        ctx.arc(this.x - this.radius * 0.3, this.y - this.radius * 0.3, this.radius * 0.2, 0, Math.PI * 2, false);
        ctx.fill();
    }

    update(mouse, clickPulse) {
        // Wall collision
        if (this.x + this.radius > this.canvas.width || this.x - this.radius < 0) {
            this.dx = -this.dx;
        }
        if (this.y + this.radius > this.canvas.height || this.y - this.radius < 0) {
            this.dy = -this.dy;
        }

        // Mouse interaction (Repel)
        if (mouse.x != null) {
            const distMouse = Math.hypot(mouse.x - this.x, mouse.y - this.y);
            const mouseRange = 100;

            if (distMouse < mouseRange) {
                const angle = Math.atan2(this.y - mouse.y, this.x - mouse.x);
                const force = (mouseRange - distMouse) / mouseRange;
                this.dx += Math.cos(angle) * force * 0.5;
                this.dy += Math.sin(angle) * force * 0.5;
            }
        }

        // Click interaction (Explosion)
        if (clickPulse.active) {
            const distClick = Math.hypot(clickPulse.x - this.x, clickPulse.y - this.y);
            const clickRange = 200;

            if (distClick < clickRange) {
                const angle = Math.atan2(this.y - clickPulse.y, this.x - clickPulse.x);
                const force = (clickRange - distClick) / clickRange * clickPulse.force;
                this.dx += Math.cos(angle) * force * 0.5;
                this.dy += Math.sin(angle) * force * 0.5;
            }
        }

        // Friction (to slow down after repulsion)
        this.dx *= 0.98;
        this.dy *= 0.98;

        // Keep a minimum speed for floating
        if (Math.abs(this.dx) < 0.2) this.dx = Math.sign(this.dx) * 0.2;
        if (Math.abs(this.dy) < 0.2) this.dy = Math.sign(this.dy) * 0.2;

        this.x += this.dx;
        this.y += this.dy;
    }
}

// Initialize on load
document.addEventListener('DOMContentLoaded', () => {
    new BubbleBackground('creations');
});

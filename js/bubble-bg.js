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
        this.bubbleCount = 15; // Reduced count for larger bubbles
        this.mouse = { x: null, y: null };
        this.clickPulse = { x: null, y: null, force: 0, active: false };

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
        // Increase bubble count for density: 20 for mobile, 40 for desktop
        const count = window.innerWidth < 768 ? 20 : 40;

        for (let i = 0; i < count; i++) {
            this.bubbles.push(new Bubble(this.canvas));
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
    constructor(canvas) {
        this.canvas = canvas;
        // Much larger bubbles: 40px - 120px radius
        this.radius = Math.random() * 80 + 40;
        this.x = Math.random() * (canvas.width - this.radius * 2) + this.radius;
        this.y = Math.random() * (canvas.height - this.radius * 2) + this.radius;
        this.dx = (Math.random() - 0.5) * 1.5; // Slightly faster drift for large bubbles
        this.dy = (Math.random() - 0.5) * 1.5;
        this.originalRadius = this.radius;
    }

    draw(ctx) {
        // 3D Bubble Body (Radial Gradient for curvature)
        const gradient = ctx.createRadialGradient(
            this.x - this.radius * 0.3,
            this.y - this.radius * 0.3,
            this.radius * 0.1,
            this.x,
            this.y,
            this.radius
        );

        // Transparent center to thicker blueish edges
        gradient.addColorStop(0, 'rgba(255, 255, 255, 0.05)');
        gradient.addColorStop(0.8, 'rgba(200, 230, 255, 0.1)');
        gradient.addColorStop(1, 'rgba(0, 122, 255, 0.15)');

        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);

        // Deep Shadow for 3D "pop" off the page
        ctx.shadowBlur = 25;
        ctx.shadowColor = 'rgba(0, 80, 200, 0.15)';

        ctx.fillStyle = gradient;
        ctx.fill();

        // Reset shadow
        ctx.shadowBlur = 0;

        // Rim Light (Bottom Right) - Adds definition to the dark side
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.4)';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0.2 * Math.PI, 2.3 * Math.PI, true); // Partial arc
        ctx.stroke();

        // Main Specular Highlight (Top Left - Glossy)
        ctx.fillStyle = 'rgba(255, 255, 255, 0.95)';
        ctx.beginPath();
        ctx.ellipse(
            this.x - this.radius * 0.45,
            this.y - this.radius * 0.45,
            this.radius * 0.25,
            this.radius * 0.12,
            Math.PI / 4,
            0,
            Math.PI * 2
        );
        ctx.fill();

        // Secondary Highlight (Small dot)
        ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
        ctx.beginPath();
        ctx.arc(
            this.x - this.radius * 0.55,
            this.y - this.radius * 0.55,
            this.radius * 0.04,
            0,
            Math.PI * 2,
            false
        );
        ctx.fill();

        // Bottom Reflection (Caustics simulation)
        ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
        ctx.beginPath();
        ctx.arc(
            this.x + this.radius * 0.4,
            this.y + this.radius * 0.4,
            this.radius * 0.1,
            0,
            Math.PI * 2,
            false
        );
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

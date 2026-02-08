/**
 * Automatic Snake Game Background for Vibe Coding Section
 * Features:
 * - Autonomous snake that plays itself
 * - Pixel-style grid visuals
 * - Resets on collision
 */

class SnakeBackground {
    constructor(containerId) {
        this.container = document.getElementById(containerId);
        if (!this.container) return;

        this.canvas = document.createElement('canvas');
        this.ctx = this.canvas.getContext('2d');

        // Style canvas to be absolute background
        this.canvas.style.position = 'absolute';
        this.canvas.style.top = '0';
        this.canvas.style.left = '0';
        this.canvas.style.width = '100%';
        this.canvas.style.height = '100%';
        this.canvas.style.zIndex = '0';
        this.canvas.style.pointerEvents = 'none'; // Background only

        this.container.appendChild(this.canvas);

        this.gridSize = 30; // Pixel size
        this.tileCountX = 0;
        this.tileCountY = 0;

        this.snake = [];
        this.food = { x: 0, y: 0 };
        this.dx = 0;
        this.dy = 0;
        this.score = 0;

        this.speed = 100; // ms per frame
        this.lastTime = 0;

        this.init();

        // Start animation loop
        requestAnimationFrame(this.gameLoop.bind(this));
    }

    init() {
        this.resize();
        window.addEventListener('resize', this.resize.bind(this));
        this.resetGame();
    }

    resize() {
        this.canvas.width = this.container.offsetWidth;
        this.canvas.height = this.container.offsetHeight;

        this.tileCountX = Math.ceil(this.canvas.width / this.gridSize);
        this.tileCountY = Math.ceil(this.canvas.height / this.gridSize);
    }

    resetGame() {
        // Start in middle
        const startX = Math.floor(this.tileCountX / 2);
        const startY = Math.floor(this.tileCountY / 2);

        this.snake = [
            { x: startX, y: startY },
            { x: startX - 1, y: startY },
            { x: startX - 2, y: startY }
        ];

        this.dx = 1;
        this.dy = 0;

        this.spawnFood();
    }

    spawnFood() {
        this.food = {
            x: Math.floor(Math.random() * this.tileCountX),
            y: Math.floor(Math.random() * this.tileCountY)
        };

        // Don't spawn on snake
        for (let part of this.snake) {
            if (this.food.x === part.x && this.food.y === part.y) {
                this.spawnFood();
                break;
            }
        }
    }

    gameLoop(timestamp) {
        if (timestamp - this.lastTime > this.speed) {
            this.update();
            this.draw();
            this.lastTime = timestamp;
        }
        requestAnimationFrame(this.gameLoop.bind(this));
    }

    update() {
        // AI Logic: Determine next move
        this.decideDirection();

        // Move head
        const head = { x: this.snake[0].x + this.dx, y: this.snake[0].y + this.dy };

        // Check Wall Collision - Just wrap around for background effect? 
        // Or die? Let's die/reset for "game" feel, or wrap for "ambient" feel.
        // Let's reset to keep it simple and clean.
        if (head.x < 0 || head.x >= this.tileCountX || head.y < 0 || head.y >= this.tileCountY) {
            this.resetGame();
            return;
        }

        // Check Self Collision
        for (let part of this.snake) {
            if (head.x === part.x && head.y === part.y) {
                this.resetGame();
                return;
            }
        }

        this.snake.unshift(head);

        // Check Food
        if (head.x === this.food.x && head.y === this.food.y) {
            // Ate food
            this.spawnFood();
            // Don't pop tail, so we grow
        } else {
            this.snake.pop();
        }
    }

    decideDirection() {
        // Simple AI: Move towards food
        // Priority: Try horizontal, then vertical, ensuring no 180 turn

        const head = this.snake[0];
        const distX = this.food.x - head.x;
        const distY = this.food.y - head.y;

        // Try X dir
        if (distX !== 0) {
            const desiredDx = distX > 0 ? 1 : -1;
            if (desiredDx !== -this.dx) { // Don't reverse
                // Check if this move kills us (simple 1-step lookahead)
                if (!this.willCollide(head.x + desiredDx, head.y)) {
                    this.dx = desiredDx;
                    this.dy = 0;
                    return;
                }
            }
        }

        // Try Y dir
        if (distY !== 0) {
            const desiredDy = distY > 0 ? 1 : -1;
            if (desiredDy !== -this.dy) {
                if (!this.willCollide(head.x, head.y + desiredDy)) {
                    this.dx = 0;
                    this.dy = desiredDy;
                    return;
                }
            }
        }

        // If target direction is blocked, try any safe direction
        const moves = [
            { dx: 0, dy: -1 }, // Up
            { dx: 0, dy: 1 },  // Down
            { dx: -1, dy: 0 }, // Left
            { dx: 1, dy: 0 }   // Right
        ];

        for (let move of moves) {
            if (move.dx === -this.dx && move.dy === -this.dy) continue; // No reverse
            if (!this.willCollide(head.x + move.dx, head.y + move.dy)) {
                this.dx = move.dx;
                this.dy = move.dy;
                return;
            }
        }

        // If all blocked, just keep going (will die/reset)
    }

    willCollide(x, y) {
        // Walls
        if (x < 0 || x >= this.tileCountX || y < 0 || y >= this.tileCountY) return true;
        // Body
        for (let part of this.snake) {
            if (x === part.x && y === part.y) return true;
        }
        return false;
    }

    draw() {
        // Clear entire canvas
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        // Grid is handled by CSS (style.css #projects background-image)
        // We only draw elements on top

        // Draw Food
        this.ctx.fillStyle = '#ff3b30'; // Apple red
        this.ctx.fillRect(
            this.food.x * this.gridSize + 2,
            this.food.y * this.gridSize + 2,
            this.gridSize - 4,
            this.gridSize - 4
        );

        // Draw Snake
        this.ctx.fillStyle = '#8e8e93'; // System Gray
        for (let i = 0; i < this.snake.length; i++) {
            const part = this.snake[i];
            const isHead = i === 0;

            this.ctx.fillStyle = isHead ? '#636366' : '#8e8e93'; // Darker head

            this.ctx.fillRect(
                part.x * this.gridSize + 1,
                part.y * this.gridSize + 1,
                this.gridSize - 2,
                this.gridSize - 2
            );
        }
    }
}

// Initialize on load
document.addEventListener('DOMContentLoaded', () => {
    new SnakeBackground('projects');
});

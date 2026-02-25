document.addEventListener('DOMContentLoaded', () => {
    // 1. Splash Exit
    const gateBtn = document.getElementById('gate-btn');
    gateBtn.addEventListener('click', () => {
        document.getElementById('splash-screen').style.opacity = '0';
        setTimeout(() => document.getElementById('splash-screen').style.display = 'none', 500);
    });

    // 2. Mouse-Responsive Neural Network Background
    const canvas = document.getElementById('canvas');
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    let particles = [];
    const mouse = { x: null, y: null, radius: 180 };

    window.addEventListener('mousemove', (e) => {
        mouse.x = e.x;
        mouse.y = e.y;
    });

    class Particle {
        constructor() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.vx = (Math.random() - 0.5) * 0.4;
            this.vy = (Math.random() - 0.5) * 0.4;
            this.baseX = this.x;
            this.baseY = this.y;
        }
        update() {
            // Drift movement
            this.x += this.vx;
            this.y += this.vy;
            if (this.x < 0 || this.x > canvas.width) this.vx *= -1;
            if (this.y < 0 || this.y > canvas.height) this.vy *= -1;

            // Mouse reaction
            let dx = mouse.x - this.x;
            let dy = mouse.y - this.y;
            let distance = Math.sqrt(dx * dx + dy * dy);
            if (distance < mouse.radius) {
                this.x -= dx / 20;
                this.y -= dy / 20;
            }
        }
        draw() {
            ctx.fillStyle = 'rgba(0, 242, 254, 0.6)';
            ctx.beginPath();
            ctx.arc(this.x, this.y, 2, 0, Math.PI * 2);
            ctx.fill();
        }
    }

    function init() {
        particles = [];
        for (let i = 0; i < 90; i++) particles.push(new Particle());
    }

    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        particles.forEach((p, i) => {
            p.update();
            p.draw();
            // Connection logic
            for (let j = i; j < particles.length; j++) {
                let dx = p.x - particles[j].x;
                let dy = p.y - particles[j].y;
                let dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < 150) {
                    ctx.strokeStyle = `rgba(0, 242, 254, ${1 - dist / 150})`;
                    ctx.lineWidth = 0.5;
                    ctx.beginPath();
                    ctx.moveTo(p.x, p.y);
                    ctx.lineTo(particles[j].x, particles[j].y);
                    ctx.stroke();
                }
            }
        });
        requestAnimationFrame(animate);
    }

    init();
    animate();

    // Responsive Canvas
    window.addEventListener('resize', () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        init();
    });
    // --- ADD THIS AT THE BOTTOM OF YOUR JS ---

    const contactForm = document.querySelector('.terminal-form'); // Targets your contact form
    
    if (contactForm) {
        contactForm.addEventListener("submit", async function(event) {
            event.preventDefault(); // Prevents the page from reloading
            
            const submitBtn = contactForm.querySelector('button');
            const originalBtnText = submitBtn.innerHTML;
            
            // Visual feedback for the user
            submitBtn.innerHTML = "TRANSMITTING...";
            submitBtn.disabled = true;

            const data = new FormData(event.target);

            fetch("https://formspree.io/f/xjgejzgq", {
                method: 'POST',
                body: data,
                headers: {
                    'Accept': 'application/json'
                }
            }).then(response => {
                if (response.ok) {
                    // Hide the form and show a success message
                    contactForm.innerHTML = `
                        <div style="text-align: center; padding: 20px; animation: fadeInUp 0.5s forwards;">
                            <h3 style="color: var(--accent); margin-bottom: 10px;">TRANSMISSION SUCCESSFUL</h3>
                            <p style="color: white; font-size: 0.9rem;">Packet received. I will respond shortly.</p>
                        </div>
                    `;
                } else {
                    // Handle server errors
                    submitBtn.innerHTML = "RETRY TRANSMISSION";
                    submitBtn.disabled = false;
                    alert("System Error: Could not transmit data.");
                }
            }).catch(error => {
                // Handle network errors
                submitBtn.innerHTML = "RETRY TRANSMISSION";
                submitBtn.disabled = false;
                alert("Network Error: Please check your connection.");
            });
        });
    }
});
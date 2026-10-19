// Oscilloscope Canvas Animation
const canvas = document.getElementById('oscilloscope');
if (canvas) {
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    // Resize canvas on window resize
    window.addEventListener('resize', () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    });

    // Oscilloscope settings
    const centerY = canvas.height / 2;
    let time = 0;
    const amplitude = 100;
    const frequency = 0.02;
    const points = [];

    // Draw grid
    const drawGrid = () => {
        ctx.strokeStyle = 'rgba(0, 0, 0, 0.2)';
        ctx.lineWidth = 1;

        // Vertical lines
        for (let x = 0; x < canvas.width; x += 50) {
            ctx.beginPath();
            ctx.moveTo(x, 0);
            ctx.lineTo(x, canvas.height);
            ctx.stroke();
        }

        // Horizontal lines
        for (let y = 0; y < canvas.height; y += 50) {
            ctx.beginPath();
            ctx.moveTo(0, y);
            ctx.lineTo(canvas.width, y);
            ctx.stroke();
        }

        // Center line
        ctx.strokeStyle = 'rgba(0, 0, 0, 0.4)';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(0, centerY);
        ctx.lineTo(canvas.width, centerY);
        ctx.stroke();
    };

    // Draw waveform
    const drawWaveform = () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        drawGrid();

        // Multiple waveforms
        const waveforms = [
            { freq: 0.02, amp: 100, color: 'rgba(26, 26, 26, 0.8)', offset: 0 },
            { freq: 0.015, amp: 80, color: 'rgba(51, 51, 51, 0.8)', offset: Math.PI / 4 },
            { freq: 0.025, amp: 60, color: 'rgba(0, 0, 0, 0.8)', offset: Math.PI / 2 }
        ];

        waveforms.forEach(wave => {
            ctx.strokeStyle = wave.color;
            ctx.lineWidth = 2;
            ctx.beginPath();

            for (let x = 0; x < canvas.width; x++) {
                const y = centerY + 
                    Math.sin(x * wave.freq + time + wave.offset) * wave.amp +
                    Math.sin(x * wave.freq * 2 + time * 2) * (wave.amp * 0.3);
                
                if (x === 0) {
                    ctx.moveTo(x, y);
                } else {
                    ctx.lineTo(x, y);
                }
            }

            ctx.stroke();

            // Add glow effect
            ctx.shadowBlur = 20;
            ctx.shadowColor = wave.color;
            ctx.stroke();
            ctx.shadowBlur = 0;
        });

        // Draw moving trace
        const traceX = (time * 50) % canvas.width;
        ctx.fillStyle = 'rgba(26, 26, 26, 0.9)';
        ctx.beginPath();
        ctx.arc(traceX, centerY + Math.sin(traceX * frequency + time) * amplitude, 5, 0, Math.PI * 2);
        ctx.fill();

        time += 0.1;
        requestAnimationFrame(drawWaveform);
    };

    drawWaveform();
}

// IoT Device Connection Animation
const createConnectionLines = () => {
    const devices = document.querySelectorAll('.device');
    const container = document.querySelector('.iot-devices');
    
    if (!container || devices.length === 0) return;

    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('class', 'connection-lines');
    svg.style.position = 'absolute';
    svg.style.top = '0';
    svg.style.left = '0';
    svg.style.width = '100%';
    svg.style.height = '100%';
    svg.style.pointerEvents = 'none';
    svg.style.zIndex = '1';
    container.appendChild(svg);

    const drawConnections = () => {
        svg.innerHTML = '';
        const positions = Array.from(devices).map(device => {
            const rect = device.getBoundingClientRect();
            const containerRect = container.getBoundingClientRect();
            return {
                x: rect.left - containerRect.left + rect.width / 2,
                y: rect.top - containerRect.top + rect.height / 2
            };
        });

        // Connect devices in a network pattern
        for (let i = 0; i < positions.length; i++) {
            for (let j = i + 1; j < positions.length; j++) {
                const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
                line.setAttribute('x1', positions[i].x);
                line.setAttribute('y1', positions[i].y);
                line.setAttribute('x2', positions[j].x);
                line.setAttribute('y2', positions[j].y);
                line.setAttribute('stroke', 'rgba(0, 0, 0, 0.3)');
                line.setAttribute('stroke-width', '2');
                line.setAttribute('stroke-dasharray', '5,5');
                
                // Animate the dash
                let offset = 0;
                const animateDash = () => {
                    offset += 2;
                    line.setAttribute('stroke-dashoffset', offset);
                    requestAnimationFrame(animateDash);
                };
                animateDash();
                
                svg.appendChild(line);
            }
        }
    };

    drawConnections();
    window.addEventListener('resize', drawConnections);
};

// Initialize IoT connections when devices are visible
const iotObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            createConnectionLines();
            iotObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.5 });

const iotDevices = document.querySelector('.iot-devices');
if (iotDevices) {
    iotObserver.observe(iotDevices);
}

// Add pulse effect to cards on hover
document.querySelectorAll('.profile-card, .activity-card').forEach(card => {
    card.addEventListener('mouseenter', function() {
        this.style.transform = 'translateY(-10px) scale(1.02)';
    });
    
    card.addEventListener('mouseleave', function() {
        this.style.transform = 'translateY(0) scale(1)';
    });
});

// Parallax effect for hero section
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const hero = document.querySelector('.hero');
    if (hero) {
        const heroContent = hero.querySelector('.hero-content');
        if (heroContent && scrolled < window.innerHeight) {
            heroContent.style.transform = `translateY(${scrolled * 0.5}px)`;
            heroContent.style.opacity = 1 - (scrolled / window.innerHeight) * 0.5;
        }
    }
});

// Add ripple effect to buttons
document.querySelectorAll('.btn').forEach(button => {
    button.addEventListener('click', function(e) {
        const ripple = document.createElement('span');
        const rect = this.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = e.clientX - rect.left - size / 2;
        const y = e.clientY - rect.top - size / 2;
        
        ripple.style.width = ripple.style.height = size + 'px';
        ripple.style.left = x + 'px';
        ripple.style.top = y + 'px';
        ripple.classList.add('ripple');
        
        this.appendChild(ripple);
        
        setTimeout(() => {
            ripple.remove();
        }, 600);
    });
});

// Add CSS for ripple effect
const style = document.createElement('style');
style.textContent = `
    .btn {
        position: relative;
        overflow: hidden;
    }
    .ripple {
        position: absolute;
        border-radius: 50%;
        background: rgba(255, 255, 255, 0.6);
        transform: scale(0);
        animation: ripple-animation 600ms linear;
        pointer-events: none;
    }
    @keyframes ripple-animation {
        to {
            transform: scale(4);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);


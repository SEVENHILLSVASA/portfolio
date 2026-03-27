// ─── MATRIX CANVAS ───────────────────────────────────────────────
const canvas = document.getElementById("matrix");
const ctx    = canvas.getContext("2d");

function resizeCanvas() {
    canvas.width  = window.innerWidth;
    canvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener("resize", resizeCanvas);

const letters  = "01";
const fontSize = 14;
let drops      = [];

function initDrops() {
    const columns = Math.floor(canvas.width / fontSize);
    drops = Array(columns).fill(1);
}
initDrops();
window.addEventListener("resize", initDrops);

function drawMatrix() {
    ctx.fillStyle = "rgba(10,15,13,0.05)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = "#00ffcc";
    ctx.font      = fontSize + "px monospace";

    for (let i = 0; i < drops.length; i++) {
        const text = letters[Math.random() * letters.length | 0];
        ctx.fillText(text, i * fontSize, drops[i] * fontSize);

        if (drops[i] * fontSize > canvas.height && Math.random() > 0.975)
            drops[i] = 0;

        drops[i]++;
    }
}
setInterval(drawMatrix, 35);


// ─── TYPING EFFECT ───────────────────────────────────────────────
const typingEl = document.getElementById("typing");
const phrases  = [
    "Cybersecurity Specialist",
    "Bug Bounty Hunter",
    "Post-Quantum Cryptographer",
    "AI Security Researcher",
    "Ethical Hacker"
];
let phraseIndex = 0;
let charIndex   = 0;
let deleting    = false;

function type() {
    const current = phrases[phraseIndex];

    if (deleting) {
        typingEl.textContent = current.substring(0, charIndex--);
    } else {
        typingEl.textContent = current.substring(0, charIndex++);
    }

    let delay = deleting ? 60 : 100;

    if (!deleting && charIndex > current.length) {
        delay    = 1800;
        deleting = true;
    } else if (deleting && charIndex < 0) {
        deleting    = false;
        charIndex   = 0;
        phraseIndex = (phraseIndex + 1) % phrases.length;
        delay       = 400;
    }

    setTimeout(type, delay);
}
type();


// ─── PROJECT FILTER ──────────────────────────────────────────────
function filterProjects(category) {
    const projects = document.querySelectorAll(".project");
    const buttons  = document.querySelectorAll(".filter-buttons button");

    buttons.forEach(btn => btn.classList.remove("active"));
    event.target.classList.add("active");

    projects.forEach(p => {
        if (category === "all" || p.classList.contains(category)) {
            p.style.display = "";
            p.style.opacity = "1";
        } else {
            p.style.display = "none";
        }
    });
}
// Set "All" button active by default
document.addEventListener("DOMContentLoaded", () => {
    const firstBtn = document.querySelector(".filter-buttons button");
    if (firstBtn) firstBtn.classList.add("active");
});


// ─── SCROLL REVEAL ───────────────────────────────────────────────
const reveals = document.querySelectorAll(".reveal");

function checkReveal() {
    reveals.forEach(el => {
        const top    = el.getBoundingClientRect().top;
        const height = window.innerHeight;
        if (top < height - 80) {
            el.classList.add("active");
        }
    });
}

// Run once on load so above-fold elements are visible immediately
window.addEventListener("load",   checkReveal);
window.addEventListener("scroll", checkReveal);


// ─── CONTACT FORM ────────────────────────────────────────────────
const form = document.getElementById("contactForm");

if (form) {
    form.addEventListener("submit", async (e) => {
        e.preventDefault();

        const btn     = form.querySelector("button[type='submit']");
        const msgEl   = document.getElementById("responseMsg");
        btn.disabled  = true;
        btn.textContent = "Sending…";
        msgEl.textContent = "";
        msgEl.className   = "";

        const data = {
            name:    document.getElementById("name").value.trim(),
            email:   document.getElementById("email").value.trim(),
            message: document.getElementById("message").value.trim()
        };

        try {
            const res    = await fetch("contact.php", {
                method:  "POST",
                headers: { "Content-Type": "application/json" },
                body:    JSON.stringify(data)
            });

            const result = await res.json();
            msgEl.textContent = result.message;
            msgEl.className   = res.ok ? "msg-success" : "msg-error";

            if (res.ok) form.reset();
        } catch {
            msgEl.textContent = "Server Error – please try again later.";
            msgEl.className   = "msg-error";
        } finally {
            btn.disabled    = false;
            btn.textContent = "Send";
        }
    });
}

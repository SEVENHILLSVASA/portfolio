/* MATRIX BACKGROUND */
const canvas = document.getElementById("matrix");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const letters = "01";
const fontSize = 14;
const columns = canvas.width / fontSize;
const drops = Array(Math.floor(columns)).fill(1);

function drawMatrix() {
    ctx.fillStyle = "rgba(10,15,13,0.05)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = "#00ffcc";
    ctx.font = fontSize + "px monospace";

    for (let i = 0; i < drops.length; i++) {
        const text = letters[Math.floor(Math.random() * letters.length)];
        ctx.fillText(text, i * fontSize, drops[i] * fontSize);

        if (drops[i] * fontSize > canvas.height && Math.random() > 0.975)
            drops[i] = 0;

        drops[i]++;
    }
}

setInterval(drawMatrix, 35);

/* TYPING EFFECT */
const typingText = [
    "Bug Bounty Hunter",
    "Cybersecurity Specialist",
    "Post-Quantum Researcher",
    "Secure Systems Architect"
];

let i = 0, j = 0, current = "", isDeleting = false;
const typingElement = document.getElementById("typing");

function type() {
    if (i < typingText.length) {
        if (!isDeleting && j <= typingText[i].length) {
            current = typingText[i].substring(0, j++);
        } else if (isDeleting && j >= 0) {
            current = typingText[i].substring(0, j--);
        }

        typingElement.innerHTML = current;

        if (j === typingText[i].length) isDeleting = true;
        if (j === 0) { isDeleting = false; i++; }

        if (i === typingText.length) i = 0;

        setTimeout(type, isDeleting ? 50 : 100);
    }
}
type();

/* SCROLL REVEAL */
const reveals = document.querySelectorAll(".reveal");

window.addEventListener("scroll", () => {
    reveals.forEach(element => {
        const windowHeight = window.innerHeight;
        const elementTop = element.getBoundingClientRect().top;
        if (elementTop < windowHeight - 100) {
            element.classList.add("active");
        }
    });
});

/* PROJECT FILTER */
function filterProjects(category) {
    const projects = document.querySelectorAll(".project");
    projects.forEach(project => {
        project.style.display =
            category === "all" || project.classList.contains(category)
            ? "block"
            : "none";
    });
}

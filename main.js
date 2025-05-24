document.getElementById("user-input").addEventListener("keydown", function(event) {
    if (event.key === "Enter") {
        event.preventDefault();
        sendMessage();
    }
});

// Add this function to convert Markdown to HTML (basic support)
function renderMarkdown(text) {
    // Headings ## or #
    text = text.replace(/^### (.*)$/gm, '<h3>$1</h3>');
    text = text.replace(/^## (.*)$/gm, '<h2>$1</h2>');
    text = text.replace(/^# (.*)$/gm, '<h2>$1</h2>');
    // Code blocks ```lang ... ```
    text = text.replace(/```([a-z]*)\n([\s\S]*?)```/g, '<pre><code class="$1">$2</code></pre>');
    // Bullet points
    text = text.replace(/^\s*[-*]\s+(.*)$/gm, '<li>$1</li>');
    // Numbered lists
    text = text.replace(/^\s*\d+\.\s+(.*)$/gm, '<li>$1</li>');
    // Paragraphs for lines not in lists
    text = text.replace(/^(?!<li>)([^\n]+)$/gm, '<p>$1</p>');
    // Wrap <li> in <ul> if any
    if (text.includes('<li>')) {
        text = text.replace(/(<li>[\s\S]*?<\/li>)/g, '<ul>$1</ul>');
        // Remove duplicate <ul> if nested
        text = text.replace(/<\/ul>\s*<ul>/g, '');
    }
    // Links [text](url)
    text = text.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank">$1</a>');
    return text;
}

async function sendMessage() {
    let userInput = document.getElementById("user-input").value;
    if (!userInput.trim()) return;

    let chatBox = document.getElementById("chat-box");
    // Modern UI: Remove "You:" label, use only message bubble
    chatBox.innerHTML += `<div class="user-message">${userInput}</div>`;
    document.getElementById("user-input").value = "";

    // Modern UI: Use a styled "thinking" message
    chatBox.innerHTML += `<div class="thinking-message">Penguin is thinking...</div>`;
    chatBox.scrollTop = chatBox.scrollHeight;

    try {
        let response = await fetch("https://penguin-ai.onrender.com/chat", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ message: userInput })
        });

        let result = await response.json();
        document.querySelector(".chat-box").lastElementChild.remove();

        // If API returns error or no reply
        if (!response.ok || !result.reply) {
            chatBox.innerHTML += `<div class="bot-message">Sorry, something went wrong. Please try again later.</div>`;
        } else {
            // Modern UI: Use bot-message bubble
            // Render Markdown/HTML in the bot message
            chatBox.innerHTML += `<div class="bot-message">${renderMarkdown(result.reply)}</div>`;
        }
    } catch (error) {
        document.querySelector(".chat-box").lastElementChild.remove();
        chatBox.innerHTML += `<div class="bot-message">Sorry, I couldn't reach the server. Please check your connection or try again later.</div>`;
    }
    chatBox.scrollTop = chatBox.scrollHeight;
}

// Theme toggle logic
const themeToggle = document.getElementById('theme-toggle');
const body = document.body;

function setTheme() {
    document.body.classList.remove('light-mode');
    themeToggle.textContent = '🌙';
    themeToggle.setAttribute('aria-label', 'Dark mode enabled');
    localStorage.setItem('theme', 'dark');
}

// Always set dark mode on load
(function () {
    setTheme();
})();

themeToggle.addEventListener('click', () => {
    setTheme();
});

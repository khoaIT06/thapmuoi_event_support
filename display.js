const API_URL = 'https://script.google.com/macros/s/AKfycbzLlrD-NpKMTNqyZNTrW6ZWeNpXanVprg2Y9RnrHtjcgNvz_usEhDO8kQ1_fuTcrj5W1Q/exec';

let supporters = [];

const topMarquee = document.getElementById('topMarquee');
const bottomMarquee = document.getElementById('bottomMarquee');

function initDisplay() {
    loadSupporters();
    setInterval(loadSupporters, 5000);
}

async function loadSupporters() {
    try {
        const res = await fetch(API_URL + '?action=get');
        const data = await res.json();
        if (data.success && data.supporters) {
            supporters = data.supporters;
            updateMarquee();
        }
    } catch (e) {}
}

let lastText = '';

function updateMarquee() {
    let text = '';

    if (supporters.length === 0) {
        text = 'Chào mừng Quý mạnh thường quân, nhà tài trợ, Quý Thầy cô, học sinh của trường THPT Tháp Mười';
    } else {
        supporters.slice(0, 50).forEach(s => {
            text += `${s.name} - ${formatCurrency(s.amount)} • `;
        });
    }

    if (text === lastText) return;

    lastText = text;
    topMarquee.textContent = text;
    bottomMarquee.textContent = text;
    runMarquee(topMarquee);
    runMarquee(bottomMarquee);
}


function runMarquee(el) {
    el.style.animation = 'none';
    el.offsetHeight;

    const textWidth = el.scrollWidth;
    const screenWidth = window.innerWidth;

    const speed = 260;
    const distance = textWidth + screenWidth;
    const duration = distance / speed;

    el.style.animation = `marquee ${duration}s linear infinite`;
}

function formatCurrency(amount) {
    return amount.toLocaleString('vi-VN') + ' VND';
}

window.addEventListener('DOMContentLoaded', initDisplay);

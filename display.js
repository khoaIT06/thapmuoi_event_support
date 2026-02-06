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

function updateMarquee() {
    if (supporters.length === 0) {
        const t = 'CHÀO MỪNG ĐẾN VỚI SỰ KIỆN • CẢM ƠN SỰ ỦNG HỘ QUÝ BÁU •';
        topMarquee.textContent = t;
        bottomMarquee.textContent = t;
        runMarquee(topMarquee);
        runMarquee(bottomMarquee);
        return;
    }

    let text = '';
    supporters.slice(0, 50).forEach(s => {
        text += `${s.name} - ${formatCurrency(s.amount)} • `;
    });

    topMarquee.textContent = text;
    bottomMarquee.textContent = text;

    runMarquee(topMarquee);
    runMarquee(bottomMarquee);
}


function formatCurrency(amount) {
    return amount.toLocaleString('vi-VN') + ' VND';
}

window.addEventListener('DOMContentLoaded', initDisplay);

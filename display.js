const API_URL = 'https://script.google.com/macros/s/AKfycbzLlrD-NpKMTNqyZNTrW6ZWeNpXanVprg2Y9RnrHtjcgNvz_usEhDO8kQ1_fuTcrj5W1Q/exec';

let supporters = [];
let currentIndex = 0;

const displayName = document.getElementById('displayName');
const displayAmount = document.getElementById('displayAmount');
const topMarquee = document.getElementById('topMarquee');
const bottomMarquee = document.getElementById('bottomMarquee');

function initDisplay() {
    loadSupporters();
    updateDisplay();
    
    setInterval(loadSupporters, 5000);
    
    setInterval(() => {
        if (supporters.length > 0) {
            currentIndex = (currentIndex + 1) % supporters.length;
            updateDisplay();
        }
    }, 10000);
}

async function loadSupporters() {
    try {
        const response = await fetch(API_URL + '?action=get');
        const data = await response.json();
        
        if (data.success && data.supporters) {
            supporters = data.supporters;
            updateDisplay();
            updateMarqueeContent();
        }
    } catch (error) {
    }
}

function updateDisplay() {
    if (supporters.length === 0) {
        displayName.textContent = 'CHÀO MỪNG ĐẾN SỰ KIỆN';
        displayAmount.textContent = '0 VND';
        return;
    }
    
    const supporter = supporters[currentIndex];
    displayName.textContent = supporter.name.toUpperCase();
    displayAmount.textContent = formatCurrency(supporter.amount);
}

function updateMarqueeContent() {
    if (supporters.length === 0) {
        const defaultText = ' CHÀO MỪNG ĐẾN VỚI SỰ KIỆN • CẢM ƠN SỰ ỦNG HỘ QUÝ BÁU • ';
        topMarquee.textContent = defaultText + defaultText;
        bottomMarquee.textContent = defaultText + defaultText;
        return;
    }
    
    let marqueeText = '';
    
    supporters.slice(0, 50).forEach(supporter => {
        marqueeText += ` ${supporter.name} - ${formatCurrency(supporter.amount)} • `;
    });
    
    if (supporters.length > 50) {
        marqueeText += ` ... và ${supporters.length - 50} người ủng hộ khác • `;
    }
    
    topMarquee.textContent = marqueeText + marqueeText;
    bottomMarquee.textContent = marqueeText + marqueeText;
}

function formatCurrency(amount) {
    return amount.toLocaleString('vi-VN') + ' VND';
}

window.addEventListener('DOMContentLoaded', initDisplay);
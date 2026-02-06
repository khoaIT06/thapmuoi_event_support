const API_URL = 'https://script.google.com/macros/s/AKfycbzLlrD-NpKMTNqyZNTrW6ZWeNpXanVprg2Y9RnrHtjcgNvz_usEhDO8kQ1_fuTcrj5W1Q/exec';

let supporters = [];
let updateInterval;

const nameInput = document.getElementById('nameInput');
const amountInput = document.getElementById('amountInput');
const addButton = document.getElementById('addButton');
const listContainer = document.getElementById('listContainer');
const totalSupporters = document.getElementById('totalSupporters');
const totalAmount = document.getElementById('totalAmount');
const displayLink = document.getElementById('displayLink');
const refreshBtn = document.getElementById('refreshBtn');
const statusText = document.getElementById('statusText');
const statusIndicator = document.getElementById('statusIndicator');

function initAdmin() {
    displayLink.href = window.location.href.replace('admin.html', 'display.html');
    
    updateStatus('Kết nối...', 'loading');
    
    testConnection();
    loadSupporters();
    
    addButton.addEventListener('click', addSupporter);
    refreshBtn.addEventListener('click', loadSupporters);
    
    nameInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') addSupporter();
    });
    
    amountInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') addSupporter();
    });
    
    nameInput.focus();
    
    updateInterval = setInterval(loadSupporters, 5000);
}

async function testConnection() {
    try {
        const response = await fetch(API_URL + '?action=test');
        const data = await response.json();
        
        if (data.success) {
            updateStatus('Đã kết nối', 'online');
        } else {
            updateStatus('Lỗi kết nối', 'offline');
        }
    } catch (error) {
        updateStatus('Mất kết nối', 'offline');
    }
}

async function addSupporter() {
    const name = nameInput.value.trim();
    const amount = parseInt(amountInput.value);
    
    if (!name || !amount || amount <= 0) {
        alert('Vui lòng nhập đầy đủ họ tên và số tiền hợp lệ');
        return;
    }
    
    updateStatus('Đang thêm...', 'loading');
    
    try {
        const url = `${API_URL}?action=add&name=${encodeURIComponent(name)}&amount=${amount}`;
        const response = await fetch(url);
        const data = await response.json();
        
        if (data.success) {
            nameInput.value = '';
            amountInput.value = '';
            nameInput.focus();
            
            loadSupporters();
            
            updateStatus('Thêm thành công!', 'online');
            
            setTimeout(() => {
                updateStatus('Đã kết nối', 'online');
            }, 2000);
            
        } else {
            alert('Lỗi: ' + (data.error || 'Không thể thêm'));
            updateStatus('Lỗi khi thêm', 'offline');
        }
        
    } catch (error) {
        alert('Lỗi kết nối. Vui lòng thử lại!');
        updateStatus('Mất kết nối', 'offline');
    }
}

async function loadSupporters() {
    try {
        const response = await fetch(API_URL + '?action=get');
        const data = await response.json();
        
        if (data.success) {
            supporters = data.supporters || [];
            updateList();
            updateStats();
            
            if (data.supporters) {
                updateStatus(`${data.count} người ủng hộ`, 'online');
            }
        } else {
            updateStatus('Lỗi tải dữ liệu', 'offline');
        }
        
    } catch (error) {
        updateStatus('Mất kết nối', 'offline');
    }
}

function updateList() {
    if (!listContainer) return;
    
    if (supporters.length === 0) {
        listContainer.innerHTML = '<div class="empty-list">Chưa có người ủng hộ nào</div>';
        return;
    }
    
    let html = '';
    const displaySupporters = supporters.slice(0, 50);
    
    displaySupporters.forEach(supporter => {
        const date = new Date(supporter.timestamp);
        const timeStr = date.toLocaleTimeString('vi-VN');
        const dateStr = date.toLocaleDateString('vi-VN');
        
        html += `
            <div class="list-item">
                <div class="item-info">
                    <div class="item-name">${supporter.name}</div>
                    <div class="item-time">${dateStr} ${timeStr}</div>
                </div>
                <div class="item-amount">${formatCurrency(supporter.amount)}</div>
            </div>
        `;
    });
    
    if (supporters.length > 50) {
        html += `
            <div class="list-item" style="background: #fff9e6; border-left-color: #ffa502;">
                <div class="item-info">
                    <div class="item-name" style="color: #666; font-style: italic;">
                        Và ${supporters.length - 50} người ủng hộ khác...
                    </div>
                </div>
            </div>
        `;
    }
    
    listContainer.innerHTML = html;
}

function updateStats() {
    if (!totalSupporters || !totalAmount) return;
    
    totalSupporters.textContent = supporters.length;
    
    const sum = supporters.reduce((total, s) => total + s.amount, 0);
    totalAmount.textContent = formatCurrency(sum);
}

function updateStatus(text, status) {
    if (statusText) statusText.textContent = text;
    if (statusIndicator) {
        statusIndicator.className = 'status-indicator ' + status;
    }
}

function formatCurrency(amount) {
    return amount.toLocaleString('vi-VN') + ' VND';
}

window.addEventListener('DOMContentLoaded', initAdmin);
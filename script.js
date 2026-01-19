// Data dan state aplikasi
let queueData = {
    currentNumber: 1,
    lastCalled: null,
    operators: [
        { id: 1, name: "Operator 1 - Pendaftaran", status: "available", currentQueue: null },
        { id: 2, name: "Operator 2 - Berkas", status: "available", currentQueue: null },
        { id: 3, name: "Operator 3 - Wawancara", status: "available", currentQueue: null },
        { id: 4, name: "Operator 4 - Tes Akademik", status: "available", currentQueue: null },
        { id: 5, name: "Operator 5 - Tes Kesehatan", status: "available", currentQueue: null },
        { id: 6, name: "Operator 6 - Pembayaran", status: "available", currentQueue: null },
        { id: 7, name: "Operator 7 - Pengumuman", status: "available", currentQueue: null },
        { id: 8, name: "Operator 8 - Konsultasi", status: "available", currentQueue: null }
    ],
    queueHistory: []
};

// Inisialisasi Speech Synthesis
const speech = window.speechSynthesis;
let voices = [];
let selectedVoice = null;

// DOM Elements
const queueNumberInput = document.getElementById('queue-number');
const operatorSelect = document.getElementById('operator');
const callBtn = document.getElementById('call-btn');
const nextBtn = document.getElementById('next-btn');
const resetBtn = document.getElementById('reset-btn');
const volumeSlider = document.getElementById('volume');
const volumeValue = document.getElementById('volume-value');
const lastNumberDisplay = document.getElementById('last-number');
const lastOperatorDisplay = document.getElementById('last-operator');
const lastTimeDisplay = document.getElementById('last-time');
const displayNumber = document.getElementById('display-number');
const displayOperator = document.getElementById('display-operator');
const operatorGrid = document.getElementById('operator-grid');
const queueListContainer = document.getElementById('queue-list-container');
const callSound = document.getElementById('call-sound');
const currentDate = document.getElementById('current-date');
const currentTime = document.getElementById('current-time');

// Initialize the application
function init() {
    // Set tanggal dan waktu
    updateDateTime();
    setInterval(updateDateTime, 1000);
    
    // Load data dari localStorage jika ada
    loadFromLocalStorage();
    
    // Setup event listeners
    setupEventListeners();
    
    // Setup suara
    setupSpeech();
    
    // Render operator grid
    renderOperatorGrid();
    
    // Render queue list
    renderQueueList();
    
    // Update display
    updateDisplay();
}

// Update tanggal dan waktu
function updateDateTime() {
    const now = new Date();
    
    // Format tanggal
    const optionsDate = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    const formattedDate = now.toLocaleDateString('id-ID', optionsDate);
    currentDate.textContent = formattedDate;
    
    // Format waktu
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');
    currentTime.textContent = `${hours}:${minutes}:${seconds}`;
}

// Setup event listeners
function setupEventListeners() {
    // Panggil antrian
    callBtn.addEventListener('click', callQueue);
    
    // Antrian selanjutnya
    nextBtn.addEventListener('click', nextQueue);
    
    // Reset antrian
    resetBtn.addEventListener('click', resetQueue);
    
    // Volume control
    volumeSlider.addEventListener('input', updateVolume);
    
    // Input nomor antrian hanya menerima angka
    queueNumberInput.addEventListener('input', function() {
        this.value = this.value.replace(/[^0-9]/g, '');
        if (this.value < 1) this.value = 1;
        if (this.value > 999) this.value = 999;
    });
}

// Setup suara text-to-speech
function setupSpeech() {
    // Tunggu sampai voices tersedia
    speech.onvoiceschanged = function() {
        voices = speech.getVoices();
        
        // Cari voice wanita dalam bahasa Indonesia atau Inggris
        selectedVoice = voices.find(voice => 
            voice.lang.includes('id') || 
            voice.lang.includes('en') ||
            voice.name.toLowerCase().includes('female')
        ) || voices[0];
    };
}

// Update volume
function updateVolume() {
    const volume = volumeSlider.value;
    volumeValue.textContent = `${Math.round(volume * 100)}%`;
    callSound.volume = volume;
}

// Panggil antrian
function callQueue() {
    const queueNumber = parseInt(queueNumberInput.value);
    const operatorId = parseInt(operatorSelect.value);
    const operator = queueData.operators.find(op => op.id === operatorId);
    
    // Validasi
    if (!queueNumber || !operator) {
        alert('Silakan masukkan nomor antrian dan pilih operator');
        return;
    }
    
    // Update status operator
    operator.status = "busy";
    operator.currentQueue = queueNumber;
    
    // Update data panggilan terakhir
    const now = new Date();
    const callTime = now.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    
    queueData.lastCalled = {
        number: queueNumber,
        operator: operator.name,
        time: callTime
    };
    
    // Tambahkan ke history
    queueData.queueHistory.unshift({
        number: queueNumber,
        operator: operator.name,
        time: callTime,
        status: 'called'
    });
    
    // Update display
    updateLastCallDisplay();
    renderOperatorGrid();
    renderQueueList();
    updateDisplay();
    
    // Mainkan suara panggilan
    playCallSound();
    
    // Ucapkan nomor antrian
    speakQueueCall(queueNumber, operator.name);
    
    // Simpan ke localStorage
    saveToLocalStorage();
    
    // Auto increment untuk antrian berikutnya
    queueNumberInput.value = queueNumber + 1;
}

// Antrian selanjutnya (auto increment)
function nextQueue() {
    // Ambil nomor antrian berikutnya
    const nextNumber = parseInt(queueNumberInput.value) + 1;
    queueNumberInput.value = nextNumber;
    
    // Pilih operator berikutnya (berputar)
    const currentOperator = parseInt(operatorSelect.value);
    const nextOperator = currentOperator < 8 ? currentOperator + 1 : 1;
    operatorSelect.value = nextOperator;
    
    // Fokus ke tombol panggil
    callBtn.focus();
}

// Reset antrian
function resetQueue() {
    if (confirm('Apakah Anda yakin ingin mereset semua antrian? Data akan dihapus permanen.')) {
        // Reset data
        queueData = {
            currentNumber: 1,
            lastCalled: null,
            operators: queueData.operators.map(op => ({
                ...op,
                status: "available",
                currentQueue: null
            })),
            queueHistory: []
        };
        
        // Reset input
        queueNumberInput.value = 1;
        operatorSelect.value = 1;
        
        // Update tampilan
        updateLastCallDisplay();
        renderOperatorGrid();
        renderQueueList();
        updateDisplay();
        
        // Hapus dari localStorage
        localStorage.removeItem('queueData');
        
        alert('Semua antrian telah direset.');
    }
}

// Update tampilan panggilan terakhir
function updateLastCallDisplay() {
    if (queueData.lastCalled) {
        lastNumberDisplay.textContent = String(queueData.lastCalled.number).padStart(3, '0');
        lastOperatorDisplay.textContent = queueData.lastCalled.operator;
        lastTimeDisplay.textContent = queueData.lastCalled.time;
        
        displayNumber.textContent = String(queueData.lastCalled.number).padStart(3, '0');
        displayOperator.textContent = queueData.lastCalled.operator.split(' - ')[0];
    } else {
        lastNumberDisplay.textContent = '-';
        lastOperatorDisplay.textContent = '-';
        lastTimeDisplay.textContent = '-';
    }
}

// Render grid operator
function renderOperatorGrid() {
    operatorGrid.innerHTML = '';
    
    queueData.operators.forEach(operator => {
        const operatorCard = document.createElement('div');
        operatorCard.className = `operator-card ${operator.status === 'busy' ? 'active' : ''}`;
        
        operatorCard.innerHTML = `
            <h4>${operator.name.split(' - ')[0]}</h4>
            <div class="op-number">${operator.id}</div>
            <div class="op-status ${operator.status}">
                ${operator.status === 'available' ? 'Tersedia' : 'Sedang Melayani'}
            </div>
            ${operator.currentQueue ? `<div class="op-current-queue">Antrian: ${String(operator.currentQueue).padStart(3, '0')}</div>` : ''}
        `;
        
        operatorGrid.appendChild(operatorCard);
    });
}

// Render daftar antrian
function renderQueueList() {
    queueListContainer.innerHTML = '';
    
    // Jika tidak ada history, tampilkan pesan
    if (queueData.queueHistory.length === 0) {
        queueListContainer.innerHTML = '<div class="queue-item" style="text-align: center; grid-column: 1 / -1; padding: 20px; color: #666;">Belum ada antrian yang dipanggil hari ini.</div>';
        return;
    }
    
    // Tampilkan maksimal 10 antrian terakhir
    const recentHistory = queueData.queueHistory.slice(0, 10);
    
    recentHistory.forEach(item => {
        const queueItem = document.createElement('div');
        queueItem.className = `queue-item ${item.status === 'called' ? 'called' : ''}`;
        
        queueItem.innerHTML = `
            <span>${String(item.number).padStart(3, '0')}</span>
            <span>${item.operator}</span>
            <span>${item.time}</span>
            <span class="queue-status ${item.status === 'called' ? 'status-called' : 'status-waiting'}">
                ${item.status === 'called' ? 'Dipanggil' : 'Menunggu'}
            </span>
        `;
        
        queueListContainer.appendChild(queueItem);
    });
}

// Update display utama
function updateDisplay() {
    // Jika ada panggilan terakhir, tampilkan
    if (queueData.lastCalled) {
        displayNumber.textContent = String(queueData.lastCalled.number).padStart(3, '0');
        displayOperator.textContent = queueData.lastCalled.operator.split(' - ')[0];
    }
}

// Mainkan suara panggilan
function playCallSound() {
    callSound.currentTime = 0;
    callSound.play().catch(e => console.log("Autoplay prevented:", e));
}

// Ucapkan panggilan antrian
function speakQueueCall(queueNumber, operatorName) {
    // Hentikan ucapaan yang sedang berjalan
    speech.cancel();
    
    // Format nomor antrian menjadi digit per digit
    const numberStr = String(queueNumber);
    const digits = numberStr.split('').join(' ');
    
    // Buat teks untuk diucapkan
    const operatorSimple = operatorName.split(' - ')[0];
    const text = `Nomor antrian ${digits}, silahkan menuju ke ${operatorSimple}`;
    
    // Buat utterance
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.voice = selectedVoice;
    utterance.rate = 0.9;
    utterance.pitch = 1.1;
    utterance.volume = volumeSlider.value;
    
    // Ucapkan
    speech.speak(utterance);
}

// Simpan ke localStorage
function saveToLocalStorage() {
    localStorage.setItem('queueData', JSON.stringify(queueData));
}

// Load dari localStorage
function loadFromLocalStorage() {
    const savedData = localStorage.getItem('queueData');
    
    if (savedData) {
        try {
            const parsedData = JSON.parse(savedData);
            queueData = parsedData;
            
            // Update input fields berdasarkan data yang disimpan
            if (queueData.lastCalled) {
                queueNumberInput.value = queueData.lastCalled.number + 1;
            }
        } catch (e) {
            console.error('Error loading saved data:', e);
        }
    }
}

// Inisialisasi aplikasi saat halaman dimuat
document.addEventListener('DOMContentLoaded', init);

// Tambahkan beberapa data contoh untuk demo
setTimeout(() => {
    // Jika tidak ada data, tambahkan beberapa contoh
    if (queueData.queueHistory.length === 0) {
        const now = new Date();
        const exampleTime = now.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
        
        // Contoh data untuk demo
        queueData.queueHistory = [
            { number: 5, operator: 'Operator 1 - Pendaftaran', time: exampleTime, status: 'called' },
            { number: 4, operator: 'Operator 3 - Wawancara', time: exampleTime, status: 'called' },
            { number: 3, operator: 'Operator 6 - Pembayaran', time: exampleTime, status: 'called' },
        ];
        
        renderQueueList();
    }
}, 1000);

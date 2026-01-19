document.addEventListener('DOMContentLoaded', function() {
    // State awal
    let currentQueueNumber = 1;
    let callHistory = [];
    let waitingQueue = [];
    let operators = [
        { id: 1, name: "Operator 1 - Pendaftaran", status: "available", currentNumber: null },
        { id: 2, name: "Operator 2 - Verifikasi Berkas", status: "available", currentNumber: null },
        { id: 3, name: "Operator 3 - Tes Akademik", status: "available", currentNumber: null },
        { id: 4, name: "Operator 4 - Wawancara", status: "available", currentNumber: null },
        { id: 5, name: "Operator 5 - Pembayaran", status: "available", currentNumber: null },
        { id: 6, name: "Operator 6 - Konsultasi", status: "available", currentNumber: null },
        { id: 7, name: "Operator 7 - Pengumuman", status: "available", currentNumber: null },
        { id: 8, name: "Operator 8 - Administrator", status: "available", currentNumber: null }
    ];
    
    // Settings suara
    let useFemaleVoice = true;
    let volume = 0.8;
    
    // DOM Elements
    const elements = {
        queueNumber: document.getElementById('queue-number'),
        operator: document.getElementById('operator'),
        callBtn: document.getElementById('call-btn'),
        nextBtn: document.getElementById('next-btn'),
        skipBtn: document.getElementById('skip-btn'),
        decreaseBtn: document.getElementById('decrease-number'),
        increaseBtn: document.getElementById('increase-number'),
        resetBtn: document.getElementById('reset-number'),
        volumeControl: document.getElementById('volume-control'),
        toggleVoiceBtn: document.getElementById('toggle-voice-btn'),
        clearHistoryBtn: document.getElementById('clear-history'),
        addQueueBtn: document.getElementById('add-queue-btn'),
        generateQueueBtn: document.getElementById('generate-queue-btn'),
        
        // Display
        currentNumber: document.getElementById('current-number'),
        currentOperator: document.getElementById('current-operator'),
        currentTime: document.getElementById('current-time'),
        statusIndicator: document.getElementById('status-indicator'),
        statusText: document.getElementById('status-text'),
        callHistory: document.getElementById('call-history'),
        operatorsContainer: document.getElementById('operators-container'),
        queueList: document.getElementById('queue-list'),
        dateTime: document.getElementById('date-time'),
        totalQueue: document.getElementById('total-queue'),
        voiceTypeIndicator: document.getElementById('voice-type-indicator')
    };
    
    // Initialize
    init();
    
    function init() {
        loadFromLocalStorage();
        updateDateTime();
        setInterval(updateDateTime, 1000);
        renderOperators();
        renderWaitingQueue();
        updateTotalQueue();
        setupEventListeners();
        generateInitialQueue();
        setupSpeech();
    }
    
    function setupSpeech() {
        // Setup Web Speech API dengan konfigurasi untuk suara wanita
        console.log("Menyiapkan sistem suara...");
        
        // Coba dapatkan suara wanita
        setTimeout(() => {
            const speech = window.speechSynthesis;
            const voices = speech.getVoices();
            
            console.log("Suara yang tersedia:");
            voices.forEach(voice => {
                console.log(`- ${voice.name} (${voice.lang})`);
            });
            
            // Cari suara wanita
            const femaleVoices = voices.filter(v => 
                v.name.toLowerCase().includes('female') || 
                v.name.toLowerCase().includes('woman') ||
                v.name.toLowerCase().includes('zira') ||
                v.name.toLowerCase().includes('samantha') ||
                (v.lang === 'id-ID' && !v.name.toLowerCase().includes('male'))
            );
            
            if (femaleVoices.length > 0) {
                console.log(`✅ Ditemukan ${femaleVoices.length} suara wanita`);
                elements.statusText.textContent = "Suara wanita siap!";
            } else {
                console.log("⚠️ Tidak menemukan suara wanita, menggunakan default");
                elements.statusText.textContent = "Menggunakan suara default";
            }
        }, 1000);
    }
    
    function updateDateTime() {
        const now = new Date();
        const date = now.toLocaleDateString('id-ID', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
        const time = now.toLocaleTimeString('id-ID');
        elements.dateTime.textContent = `${date} ${time}`;
    }
    
    function setupEventListeners() {
        // Kontrol nomor
        elements.decreaseBtn.addEventListener('click', () => {
            if (elements.queueNumber.value > 1) {
                elements.queueNumber.value = parseInt(elements.queueNumber.value) - 1;
            }
        });
        
        elements.increaseBtn.addEventListener('click', () => {
            elements.queueNumber.value = parseInt(elements.queueNumber.value) + 1;
        });
        
        elements.resetBtn.addEventListener('click', () => {
            elements.queueNumber.value = 1;
        });
        
        // Tombol utama
        elements.callBtn.addEventListener('click', callQueue);
        elements.nextBtn.addEventListener('click', nextQueue);
        elements.skipBtn.addEventListener('click', skipQueue);
        
        // Volume
        elements.volumeControl.addEventListener('input', function() {
            volume = parseFloat(this.value);
        });
        
        // Toggle suara
        elements.toggleVoiceBtn.addEventListener('click', function() {
            useFemaleVoice = !useFemaleVoice;
            elements.voiceTypeIndicator.textContent = useFemaleVoice ? "WANITA" : "PRIA";
            elements.voiceTypeIndicator.style.color = useFemaleVoice ? "#d53f8c" : "#2a5298";
            
            // Test suara
            testVoice();
        });
        
        // History
        elements.clearHistoryBtn.addEventListener('click', clearHistory);
        
        // Queue
        elements.addQueueBtn.addEventListener('click', addToQueue);
        elements.generateQueueBtn.addEventListener('click', generateRandomQueue);
        
        // Keyboard shortcuts
        document.addEventListener('keydown', function(e) {
            if (e.code === 'Space' && !e.target.matches('input, select, textarea')) {
                e.preventDefault();
                callQueue();
            }
        });
    }
    
    function callQueue() {
        const queueNumber = parseInt(elements.queueNumber.value);
        const operatorId = parseInt(elements.operator.value);
        const operator = operators.find(op => op.id === operatorId);
        
        if (!operator) return;
        
        // Update operator
        operator.status = "busy";
        operator.currentNumber = queueNumber;
        
        // Update display
        elements.currentNumber.textContent = queueNumber;
        elements.currentOperator.textContent = operator.name;
        elements.currentTime.textContent = new Date().toLocaleTimeString('id-ID');
        elements.statusText.textContent = "Memanggil antrian...";
        elements.statusIndicator.style.backgroundColor = "#f6ad55";
        
        // Add history
        callHistory.unshift({
            number: queueNumber,
            operator: operator.name,
            time: new Date().toLocaleTimeString('id-ID')
        });
        renderCallHistory();
        
        // Speak
        speakQueue(queueNumber, operator.name);
        
        // Update UI
        renderOperators();
        updateTotalQueue();
        
        // Increment
        elements.queueNumber.value = queueNumber + 1;
        currentQueueNumber = queueNumber + 1;
        
        // Remove from waiting
        removeFromWaitingQueue(queueNumber);
        
        saveToLocalStorage();
        
        // Reset status
        setTimeout(() => {
            elements.statusText.textContent = "Sistem siap";
            elements.statusIndicator.style.backgroundColor = "#48bb78";
        }, 5000);
    }
    
    function speakQueue(queueNumber, operatorName) {
        const operatorSimple = operatorName.split(' - ')[0];
        const text = `Nomor antrian ${queueNumber}, silakan menuju ${operatorSimple}. Terima kasih.`;
        
        speakText(text);
    }
    
    function speakText(text) {
        const speech = window.speechSynthesis;
        
        // Cancel if speaking
        if (speech.speaking) {
            speech.cancel();
        }
        
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.volume = volume;
        utterance.rate = useFemaleVoice ? 0.85 : 0.9; // Lebih lambat untuk wanita
        utterance.pitch = useFemaleVoice ? 1.3 : 1.0; // Pitch tinggi untuk wanita
        
        // Cari suara berdasarkan jenis
        const voices = speech.getVoices();
        
        if (useFemaleVoice) {
            // Prioritas: suara wanita Indonesia
            let femaleVoice = voices.find(v => v.lang === 'id-ID' && v.name.toLowerCase().includes('female'));
            
            if (!femaleVoice) {
                // Cari suara wanita bahasa Inggris
                femaleVoice = voices.find(v => 
                    v.name.toLowerCase().includes('female') || 
                    v.name.toLowerCase().includes('zira') ||
                    v.name.toLowerCase().includes('samantha')
                );
            }
            
            if (!femaleVoice) {
                // Cari suara dengan bahasa Indonesia
                femaleVoice = voices.find(v => v.lang === 'id-ID');
            }
            
            if (femaleVoice) {
                utterance.voice = femaleVoice;
                utterance.lang = femaleVoice.lang;
                console.log(`Menggunakan suara wanita: ${femaleVoice.name}`);
            }
        } else {
            // Untuk suara pria, gunakan default atau cari suara pria
            let maleVoice = voices.find(v => v.name.toLowerCase().includes('male'));
            
            if (maleVoice) {
                utterance.voice = maleVoice;
                utterance.pitch = 0.9; // Pitch lebih rendah
            }
        }
        
        // Events
        utterance.onstart = function() {
            console.log("Mulai berbicara:", text);
        };
        
        utterance.onend = function() {
            console.log("Selesai berbicara");
        };
        
        utterance.onerror = function(event) {
            console.error("Error:", event);
            
            // Fallback: coba dengan Google TTS
            if (useFemaleVoice) {
                const audio = new Audio(`https://translate.google.com/translate_tts?ie=UTF-8&tl=id&client=tw-ob&q=${encodeURIComponent(text)}`);
                audio.volume = volume;
                audio.play();
            }
        };
        
        speech.speak(utterance);
    }
    
    function testVoice() {
        const testText = useFemaleVoice 
            ? "Ini adalah suara wanita untuk sistem antrian." 
            : "Ini adalah suara pria untuk sistem antrian.";
        
        speakText(testText);
    }
    
    function nextQueue() {
        elements.queueNumber.value = parseInt(elements.queueNumber.value) + 1;
    }
    
    function skipQueue() {
        const currentNumber = parseInt(elements.queueNumber.value);
        
        callHistory.unshift({
            number: currentNumber,
            operator: "Dilewati",
            time: new Date().toLocaleTimeString('id-ID')
        });
        
        renderCallHistory();
        elements.queueNumber.value = currentNumber + 1;
        elements.statusText.textContent = "Antrian dilewati";
        
        speakText(`Nomor antrian ${currentNumber} dilewati.`);
        
        setTimeout(() => {
            elements.statusText.textContent = "Sistem siap";
        }, 3000);
        
        saveToLocalStorage();
    }
    
    // Fungsi render dan lainnya tetap sama seperti sebelumnya
    function renderCallHistory() {
        elements.callHistory.innerHTML = '';
        
        if (callHistory.length === 0) {
            elements.callHistory.innerHTML = `
                <div class="empty-history">
                    <i class="fas fa-history"></i>
                    <p>Belum ada riwayat panggilan</p>
                </div>
            `;
            return;
        }
        
        callHistory.forEach(record => {
            const div = document.createElement('div');
            div.className = 'history-item';
            div.innerHTML = `
                <div class="history-number">${record.number}</div>
                <div class="history-operator">${record.operator}</div>
                <div class="history-time">${record.time}</div>
            `;
            elements.callHistory.appendChild(div);
        });
    }
    
    function renderOperators() {
        elements.operatorsContainer.innerHTML = '';
        
        operators.forEach(operator => {
            const div = document.createElement('div');
            div.className = `operator-card ${operator.status}`;
            div.innerHTML = `
                <div class="operator-number">${operator.id}</div>
                <div class="operator-name">${operator.name.split(' - ')[0]}</div>
                <div class="operator-status ${operator.status === 'available' ? 'status-available' : 'status-busy'}">
                    ${operator.status === 'available' ? 'Tersedia' : 'Sedang Melayani'}
                </div>
                ${operator.currentNumber ? `<div class="operator-queue">Antrian: ${operator.currentNumber}</div>` : ''}
            `;
            
            div.addEventListener('click', () => {
                elements.operator.value = operator.id;
            });
            
            elements.operatorsContainer.appendChild(div);
        });
    }
    
    function renderWaitingQueue() {
        elements.queueList.innerHTML = '';
        
        if (waitingQueue.length === 0) {
            elements.queueList.innerHTML = `
                <div class="empty-queue">
                    <i class="fas fa-clipboard-list"></i>
                    <p>Tidak ada antrian menunggu</p>
                </div>
            `;
            return;
        }
        
        waitingQueue.forEach((item, index) => {
            const div = document.createElement('div');
            div.className = 'queue-item';
            div.innerHTML = `
                <div class="queue-item-number">${item.number}</div>
                <div class="queue-item-operator">${item.operatorName}</div>
                <div class="queue-item-actions">
                    <button class="call-now-btn" data-index="${index}">
                        <i class="fas fa-bullhorn"></i> Panggil
                    </button>
                    <button class="remove-queue-btn" data-index="${index}">
                        <i class="fas fa-trash-alt"></i> Hapus
                    </button>
                </div>
            `;
            
            elements.queueList.appendChild(div);
        });
        
        // Add event listeners
        document.querySelectorAll('.call-now-btn').forEach(btn => {
            btn.addEventListener('click', function() {
                const index = parseInt(this.getAttribute('data-index'));
                callFromQueue(index);
            });
        });
        
        document.querySelectorAll('.remove-queue-btn').forEach(btn => {
            btn.addEventListener('click', function() {
                const index = parseInt(this.getAttribute('data-index'));
                removeFromWaitingQueueByIndex(index);
            });
        });
    }
    
    function callFromQueue(index) {
        if (index >= 0 && index < waitingQueue.length) {
            const item = waitingQueue[index];
            elements.queueNumber.value = item.number;
            elements.operator.value = item.operatorId;
            callQueue();
        }
    }
    
    function addToQueue() {
        const queueNumber = parseInt(elements.queueNumber.value);
        const operatorId = parseInt(elements.operator.value);
        const operator = operators.find(op => op.id === operatorId);
        
        if (waitingQueue.some(item => item.number === queueNumber)) {
            alert(`Nomor antrian ${queueNumber} sudah ada!`);
            return;
        }
        
        waitingQueue.push({
            number: queueNumber,
            operatorId: operatorId,
            operatorName: operator.name,
            addedAt: new Date()
        });
        
        waitingQueue.sort((a, b) => a.number - b.number);
        renderWaitingQueue();
        updateTotalQueue();
        elements.queueNumber.value = queueNumber + 1;
        
        saveToLocalStorage();
    }
    
    function generateRandomQueue() {
        for (let i = 0; i < 5; i++) {
            const randomNumber = Math.floor(Math.random() * 50) + 1;
            const randomOperator = Math.floor(Math.random() * 8) + 1;
            const operator = operators.find(op => op.id === randomOperator);
            
            if (!waitingQueue.some(item => item.number === randomNumber)) {
                waitingQueue.push({
                    number: randomNumber,
                    operatorId: randomOperator,
                    operatorName: operator.name,
                    addedAt: new Date()
                });
            }
        }
        
        waitingQueue.sort((a, b) => a.number - b.number);
        renderWaitingQueue();
        updateTotalQueue();
        saveToLocalStorage();
    }
    
    function generateInitialQueue() {
        if (waitingQueue.length === 0) {
            const demo = [
                { number: 5, operatorId: 1, operatorName: "Operator 1 - Pendaftaran" },
                { number: 8, operatorId: 2, operatorName: "Operator 2 - Verifikasi Berkas" },
                { number: 12, operatorId: 3, operatorName: "Operator 3 - Tes Akademik" },
                { number: 15, operatorId: 4, operatorName: "Operator 4 - Wawancara" }
            ];
            
            demo.forEach(item => {
                waitingQueue.push({
                    ...item,
                    addedAt: new Date()
                });
            });
            
            renderWaitingQueue();
            updateTotalQueue();
        }
    }
    
    function removeFromWaitingQueue(queueNumber) {
        const index = waitingQueue.findIndex(item => item.number === queueNumber);
        if (index !== -1) {
            waitingQueue.splice(index, 1);
            renderWaitingQueue();
            updateTotalQueue();
            saveToLocalStorage();
        }
    }
    
    function removeFromWaitingQueueByIndex(index) {
        if (index >= 0 && index < waitingQueue.length) {
            waitingQueue.splice(index, 1);
            renderWaitingQueue();
            updateTotalQueue();
            saveToLocalStorage();
        }
    }
    
    function updateTotalQueue() {
        elements.totalQueue.textContent = waitingQueue.length;
    }
    
    function clearHistory() {
        if (confirm("Hapus semua riwayat?")) {
            callHistory = [];
            renderCallHistory();
            saveToLocalStorage();
        }
    }
    
    function saveToLocalStorage() {
        const data = {
            currentQueueNumber: currentQueueNumber,
            callHistory: callHistory,
            waitingQueue: waitingQueue
        };
        localStorage.setItem('antrianSPMB', JSON.stringify(data));
    }
    
    function loadFromLocalStorage() {
        const saved = localStorage.getItem('antrianSPMB');
        if (saved) {
            try {
                const data = JSON.parse(saved);
                currentQueueNumber = data.currentQueueNumber || 1;
                callHistory = data.callHistory || [];
                waitingQueue = data.waitingQueue || [];
                
                elements.queueNumber.value = currentQueueNumber;
                renderCallHistory();
            } catch (e) {
                console.error("Error loading data:", e);
            }
        }
    }
});
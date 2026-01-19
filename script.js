/* Reset dan Base Styles */
* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

body {
    font-family: 'Roboto', sans-serif;
    background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
    color: #333;
    line-height: 1.6;
    min-height: 100vh;
    padding: 10px;
}

.container {
    max-width: 1400px;
    margin: 0 auto;
    background-color: white;
    border-radius: 20px;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
    overflow: hidden;
}

/* Header */
header {
    background: linear-gradient(to right, #1e3c72, #2a5298);
    color: white;
    padding: 20px 40px;
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.logo-container {
    display: flex;
    align-items: center;
    gap: 20px;
}

.logo {
    background-color: white;
    color: #2a5298;
    width: 70px;
    height: 70px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 32px;
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
}

.header-text h1 {
    font-family: 'Poppins', sans-serif;
    font-size: 24px;
    font-weight: 700;
    margin-bottom: 5px;
}

.header-text h2 {
    font-family: 'Poppins', sans-serif;
    font-size: 18px;
    font-weight: 500;
    margin-bottom: 5px;
}

.header-text .subtitle {
    font-size: 14px;
    opacity: 0.9;
}

.datetime {
    text-align: right;
}

#current-date {
    font-size: 18px;
    font-weight: 500;
    margin-bottom: 5px;
}

#current-time {
    font-size: 28px;
    font-weight: 700;
    font-family: 'Poppins', sans-serif;
}

/* Main Content */
main {
    padding: 30px;
}

.dashboard {
    display: grid;
    grid-template-columns: 1fr 1.5fr;
    gap: 30px;
    margin-bottom: 30px;
}

/* Panel Kiri */
.control-panel, .current-call, .operator-status, .queue-display {
    background-color: #f8f9fa;
    border-radius: 15px;
    padding: 25px;
    margin-bottom: 25px;
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.05);
    border: 1px solid #eaeaea;
}

.control-panel h3, .current-call h3, .operator-status h3, .queue-display h3, .queue-list h3 {
    font-family: 'Poppins', sans-serif;
    color: #1e3c72;
    margin-bottom: 20px;
    font-size: 18px;
    display: flex;
    align-items: center;
    gap: 10px;
}

.form-group {
    margin-bottom: 20px;
}

.form-group label {
    display: block;
    margin-bottom: 8px;
    font-weight: 500;
    color: #444;
    display: flex;
    align-items: center;
    gap: 8px;
}

.form-group input, .form-group select {
    width: 100%;
    padding: 12px 15px;
    border: 1px solid #ddd;
    border-radius: 8px;
    font-size: 16px;
    transition: all 0.3s;
}

.form-group input:focus, .form-group select:focus {
    outline: none;
    border-color: #2a5298;
    box-shadow: 0 0 0 3px rgba(42, 82, 152, 0.2);
}

.button-group {
    display: grid;
    grid-template-columns: 1fr;
    gap: 15px;
    margin: 25px 0;
}

button {
    padding: 15px;
    border: none;
    border-radius: 10px;
    font-size: 16px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 10px;
}

button:hover {
    transform: translateY(-3px);
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
}

button:active {
    transform: translateY(0);
}

.btn-call {
    background: linear-gradient(to right, #00b09b, #96c93d);
    color: white;
}

.btn-next {
    background: linear-gradient(to right, #ff8a00, #da1b60);
    color: white;
}

.btn-reset {
    background: linear-gradient(to right, #8e2de2, #4a00e0);
    color: white;
}

.volume-control {
    display: flex;
    align-items: center;
    gap: 15px;
    margin-top: 25px;
}

.volume-control label {
    font-weight: 500;
    display: flex;
    align-items: center;
    gap: 8px;
    min-width: 120px;
}

.volume-control input {
    flex-grow: 1;
}

#volume-value {
    min-width: 40px;
    text-align: right;
}

/* Panggilan Terakhir */
.last-call-display {
    background: linear-gradient(to right, #1e3c72, #2a5298);
    color: white;
    border-radius: 10px;
    padding: 20px;
    text-align: center;
}

.call-number {
    font-size: 42px;
    font-weight: 700;
    margin-bottom: 10px;
    font-family: 'Poppins', sans-serif;
}

.call-operator {
    font-size: 22px;
    margin-bottom: 10px;
    font-weight: 500;
}

.call-time {
    font-size: 16px;
    opacity: 0.9;
}

/* Panel Kanan */
.operator-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 15px;
}

.operator-card {
    background-color: white;
    border-radius: 10px;
    padding: 15px;
    text-align: center;
    box-shadow: 0 3px 10px rgba(0, 0, 0, 0.08);
    border: 2px solid #eaeaea;
    transition: all 0.3s;
}

.operator-card.active {
    border-color: #00b09b;
    background-color: #f0fff4;
}

.operator-card h4 {
    font-size: 14px;
    color: #555;
    margin-bottom: 5px;
}

.operator-card .op-number {
    font-size: 24px;
    font-weight: 700;
    color: #1e3c72;
    margin-bottom: 5px;
    font-family: 'Poppins', sans-serif;
}

.operator-card .op-status {
    font-size: 12px;
    padding: 3px 10px;
    border-radius: 20px;
    display: inline-block;
}

.operator-card .op-status.available {
    background-color: #d4edda;
    color: #155724;
}

.operator-card .op-status.busy {
    background-color: #f8d7da;
    color: #721c24;
}

/* Display Antrian */
.display-screen {
    background-color: #111;
    border-radius: 15px;
    overflow: hidden;
    border: 10px solid #333;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
}

.display-header {
    background-color: #1e3c72;
    color: white;
    text-align: center;
    padding: 15px;
}

.display-header h4 {
    font-family: 'Poppins', sans-serif;
    font-size: 20px;
    letter-spacing: 2px;
}

.display-content {
    padding: 30px;
    text-align: center;
}

.display-number {
    font-size: 80px;
    font-weight: 700;
    color: #ffcc00;
    font-family: 'Poppins', sans-serif;
    text-shadow: 0 0 10px rgba(255, 204, 0, 0.5);
    margin-bottom: 10px;
}

.display-operator {
    font-size: 32px;
    color: #00b09b;
    font-weight: 600;
    margin-bottom: 20px;
}

.display-info p {
    color: #ddd;
    font-size: 18px;
    margin-bottom: 10px;
}

/* Daftar Antrian */
.queue-list {
    background-color: #f8f9fa;
    border-radius: 15px;
    padding: 25px;
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.05);
    border: 1px solid #eaeaea;
}

.list-header {
    display: grid;
    grid-template-columns: 1fr 2fr 1.5fr 1fr;
    background-color: #1e3c72;
    color: white;
    padding: 15px 20px;
    border-radius: 8px;
    font-weight: 500;
    margin-bottom: 15px;
}

.list-container {
    max-height: 250px;
    overflow-y: auto;
}

.queue-item {
    display: grid;
    grid-template-columns: 1fr 2fr 1.5fr 1fr;
    padding: 12px 20px;
    border-bottom: 1px solid #eee;
    align-items: center;
}

.queue-item:nth-child(even) {
    background-color: #f9f9f9;
}

.queue-item.called {
    background-color: #e8f5e9;
    border-left: 5px solid #00b09b;
}

.queue-status {
    padding: 5px 10px;
    border-radius: 20px;
    font-size: 12px;
    font-weight: 500;
    text-align: center;
}

.status-waiting {
    background-color: #fff3cd;
    color: #856404;
}

.status-called {
    background-color: #d1ecf1;
    color: #0c5460;
}

/* Footer */
footer {
    background-color: #1e3c72;
    color: white;
    text-align: center;
    padding: 20px;
    margin-top: 20px;
}

footer p {
    margin-bottom: 8px;
    font-size: 14px;
}

.footer-icons {
    display: flex;
    justify-content: center;
    gap: 20px;
    margin-top: 15px;
    font-size: 18px;
    color: #a3c4ff;
}

/* Responsive */
@media (max-width: 1200px) {
    .dashboard {
        grid-template-columns: 1fr;
    }
    
    .operator-grid {
        grid-template-columns: repeat(4, 1fr);
    }
}

@media (max-width: 768px) {
    header {
        flex-direction: column;
        text-align: center;
        gap: 20px;
    }
    
    .logo-container {
        flex-direction: column;
        text-align: center;
    }
    
    .datetime {
        text-align: center;
    }
    
    .operator-grid {
        grid-template-columns: repeat(2, 1fr);
    }
    
    .list-header, .queue-item {
        grid-template-columns: 1fr 1.5fr 1fr 1fr;
        font-size: 14px;
    }
    
    .display-number {
        font-size: 60px;
    }
    
    .display-operator {
        font-size: 24px;
    }
}

@media (max-width: 480px) {
    main {
        padding: 15px;
    }
    
    .control-panel, .current-call, .operator-status, .queue-display, .queue-list {
        padding: 15px;
    }
    
    .operator-grid {
        grid-template-columns: 1fr;
    }
    
    .list-header, .queue-item {
        grid-template-columns: 1fr 1fr;
        gap: 10px;
    }
    
    .button-group {
        grid-template-columns: 1fr;
    }
}

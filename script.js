document.addEventListener('DOMContentLoaded', function() {
    const creditiInizialiInput = document.getElementById('creditiIniziali');
    const creditiRimanentiElement = document.getElementById('creditiRimanenti');
    const dashboard = document.getElementById('dashboard');
    const alertDiv = document.getElementById('alert');

    // Recupera i crediti salvati in LocalStorage
    const creditiSalvati = localStorage.getItem('creditiRimanenti');
    if (creditiSalvati) {
        creditiRimanentiElement.innerText = creditiSalvati;
        dashboard.style.display = 'block';
        document.getElementById('inizia').disabled = true;

        if (creditiSalvati <= 0) {
            alertDiv.style.display = 'block';
        }
    }

    document.getElementById('inizia').addEventListener('click', function() {
        const creditiIniziali = parseInt(creditiInizialiInput.value);
        if (isNaN(creditiIniziali) || creditiIniziali <= 0) {
            alert('Inserisci un numero valido di crediti.');
            return;
        }

        localStorage.setItem('creditiIniziali', creditiIniziali);
        localStorage.setItem('creditiRimanenti', creditiIniziali);

        creditiRimanentiElement.innerText = creditiIniziali;
        dashboard.style.display = 'block';
        this.disabled = true;
    });

    document.getElementById('aggiornaCrediti').addEventListener('click', function() {
        const creditiSpesi = parseInt(document.getElementById('creditiSpesi').value);
        let creditiRimanenti = parseInt(creditiRimanentiElement.innerText);

        if (isNaN(creditiSpesi) || creditiSpesi < 0) {
            alert('Inserisci un numero valido di crediti spesi.');
            return;
        }

        creditiRimanenti -= creditiSpesi;

        if (creditiRimanenti <= 0) {
            creditiRimanenti = 0;
            alertDiv.style.display = 'block';
            playAlertSound();
        } else {
            alertDiv.style.display = 'none';
        }

        creditiRimanentiElement.innerText = creditiRimanenti;
        localStorage.setItem('creditiRimanenti', creditiRimanenti);
    });

    // Logica per il pulsante di reset
    document.getElementById('reset').addEventListener('click', function() {
        localStorage.removeItem('creditiIniziali');
        localStorage.removeItem('creditiRimanenti');
        creditiInizialiInput.value = '';
        creditiRimanentiElement.innerText = '';
        dashboard.style.display = 'none';
        alertDiv.style.display = 'none';
        document.getElementById('inizia').disabled = false;
    });
});

function playAlertSound() {
    const audio = new Audio('alert.mp3');
    audio.play();
}

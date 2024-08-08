document.addEventListener('DOMContentLoaded', function() {
    const creditiInizialiInput = document.getElementById('creditiIniziali');
    const creditiRimanentiElement = document.getElementById('creditiRimanenti');
    const dashboard = document.getElementById('dashboard');
    const alertDiv = document.getElementById('alert');
    const iniziaButton = document.getElementById('inizia');
    const resetButton = document.getElementById('reset');

    // Recupera i crediti salvati in LocalStorage
    const creditiSalvati = localStorage.getItem('creditiRimanenti');
    if (creditiSalvati) {
        creditiRimanentiElement.innerText = creditiSalvati;
        dashboard.style.display = 'block';
        iniziaButton.disabled = true;

        if (creditiSalvati < 0) {  // Modifica qui: alert solo se i crediti sono minori di 0
            alertDiv.style.display = 'block';
        }
    }

    iniziaButton.addEventListener('click', function() {
        const creditiIniziali = parseInt(creditiInizialiInput.value);
        if (isNaN(creditiIniziali) || creditiIniziali <= 0) {
            alert('Inserisci un numero valido di crediti.');
            return;
        }

        localStorage.setItem('creditiIniziali', creditiIniziali);
        localStorage.setItem('creditiRimanenti', creditiIniziali);

        creditiRimanentiElement.innerText = creditiIniziali;
        dashboard.style.display = 'block';
        iniziaButton.disabled = true;
    });

    document.getElementById('aggiornaCrediti').addEventListener('click', function() {
        const creditiSpesi = parseInt(document.getElementById('creditiSpesi').value);
        let creditiRimanenti = parseInt(creditiRimanentiElement.innerText);

        if (isNaN(creditiSpesi) || creditiSpesi < 0) {
            alert('Inserisci un numero valido di crediti spesi.');
            return;
        }

        creditiRimanenti -= creditiSpesi;

        if (creditiRimanenti < 0) {  // Modifica qui: alert solo se i crediti sono minori di 0
            alertDiv.style.display = 'block';
            playAlertSound();
        } else {
            alertDiv.style.display = 'none';
        }

        creditiRimanentiElement.innerText = creditiRimanenti;
        localStorage.setItem('creditiRimanenti', creditiRimanenti);
    });

    // Logica per il pulsante di reset
    resetButton.addEventListener('click', function() {
        localStorage.clear(); // Rimuove tutti gli elementi salvati nel LocalStorage
        creditiInizialiInput.value = '';
        creditiRimanentiElement.innerText = '';
        dashboard.style.display = 'none';
        alertDiv.style.display = 'none';
        iniziaButton.disabled = false;
    });
});

function playAlertSound() {
    const audio = new Audio('alert.mp3');
    audio.play();
}

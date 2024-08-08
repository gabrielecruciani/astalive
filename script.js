document.addEventListener('DOMContentLoaded', function() {
    const sezioneIniziale = document.getElementById('inizia');
    const creditiInizialiInput = document.getElementById('creditiIniziali');
    const creditiRimanentiElement = document.getElementById('creditiRimanenti');
    const dashboard = document.getElementById('dashboard');
    const alertDiv = document.getElementById('alert');
    const iniziaButton = sezioneIniziale.querySelector('button');
    const resetButton = document.getElementById('reset');
    const listaStorico = document.getElementById('listaStorico');
    const storicoDiv = document.querySelector('.history'); // Sezione storico
    let alertAttivo = false;
    const alertCooldown = 5000;
    let alertAudio = null;

    // Recupera i crediti e lo storico salvati in LocalStorage
    const creditiSalvati = localStorage.getItem('creditiRimanenti');
    const storicoSalvato = JSON.parse(localStorage.getItem('storicoCrediti')) || [];

    if (creditiSalvati !== null) {
        creditiRimanentiElement.innerText = creditiSalvati;
        dashboard.style.display = 'block';
        sezioneIniziale.style.display = 'none';

        // Carica lo storico
        storicoSalvato.forEach(record => {
            const listItem = document.createElement('li');
            listItem.textContent = `Crediti spesi: ${record.creditiSpesi}, Data: ${record.data}`;
            listaStorico.appendChild(listItem);
        });

        if (creditiSalvati < 0) {
            alertDiv.style.display = 'block';
            playAlertSound();
            alertAttivo = true;
            setTimeout(() => alertAttivo = false, alertCooldown);
        }
    }

    iniziaButton.addEventListener('click', function() {
        const creditiIniziali = parseInt(creditiInizialiInput.value);
        if (isNaN(creditiIniziali) || creditiIniziali <= 0 || creditiIniziali > 1000) {
            alert('Inserisci un numero valido di crediti (1-1000).');
            return;
        }

        localStorage.setItem('creditiIniziali', creditiIniziali);
        localStorage.setItem('creditiRimanenti', creditiIniziali);
        localStorage.setItem('storicoCrediti', JSON.stringify([])); // Inizializza lo storico

        creditiRimanentiElement.innerText = creditiIniziali;
        dashboard.style.display = 'block';
        sezioneIniziale.style.display = 'none';

        // Mostra la sezione storico
        storicoDiv.style.display = 'block';
    });

    document.getElementById('aggiornaCrediti').addEventListener('click', function() {
        const creditiSpesiInput = document.getElementById('creditiSpesi');
        const creditiSpesi = parseInt(creditiSpesiInput.value);
        let creditiRimanenti = parseInt(creditiRimanentiElement.innerText);

        if (isNaN(creditiSpesi) || creditiSpesi < 0) {
            alert('Inserisci un numero valido di crediti spesi.');
            return;
        }

        if (creditiSpesi > 975) {
            alert('Non puoi spendere più di 975 crediti.');
            return;
        }

        creditiRimanenti -= creditiSpesi;

        if (creditiRimanenti < 0) {
            if (!alertAttivo) {
                alertDiv.style.display = 'block';
                playAlertSound();
                alertAttivo = true;

                setTimeout(() => {
                    alertAttivo = false;
                }, alertCooldown);
            }
        } else {
            alertDiv.style.display = 'none';
            alertAttivo = false;
        }

        creditiRimanentiElement.innerText = creditiRimanenti;
        localStorage.setItem('creditiRimanenti', creditiRimanenti);

        // Aggiorna lo storico
        const storico = JSON.parse(localStorage.getItem('storicoCrediti')) || [];
        storico.push({
            creditiSpesi: creditiSpesi
        });
        localStorage.setItem('storicoCrediti', JSON.stringify(storico));

        // Aggiungi il nuovo record alla lista
        const listItem = document.createElement('li');
        listItem.textContent = `- ${creditiSpesi}`;
        listaStorico.appendChild(listItem);
    });

    resetButton.addEventListener('click', function() {
        localStorage.clear();
        creditiInizialiInput.value = '';
        creditiRimanentiElement.innerText = '';
        dashboard.style.display = 'none';
        sezioneIniziale.style.display = 'block';
        alertDiv.style.display = 'none';
        alertAttivo = false;
        listaStorico.innerHTML = '';
        storicoDiv.style.display = 'none'; // Nasconde la sezione storico

        // Stoppa il suono dell'allerta se in riproduzione
        if (alertAudio) {
            alertAudio.pause();
            alertAudio.currentTime = 0; // Riavvolgi il suono
        }
    });

    function playAlertSound() {
        if (alertAudio) {
            alertAudio.pause();
            alertAudio.currentTime = 0; // Riavvolgi il suono
        }
        alertAudio = new Audio('alert.mp3');
        alertAudio.play();
    }
});

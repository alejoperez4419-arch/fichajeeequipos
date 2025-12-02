let selectedCards = [];
// Define las cantidades de monedas y GP disponibles para seleccionar
const coins = [10000]; // Solo un valor de coin
const gp = [100000];   // Solo un valor de GP
const teams = [
    { name: "Team 1", img: "1.png" },
    { name: "Team 2", img: "2.png" },
    { name: "Team 3", img: "3.png" },
    { name: "Team 4", img: "4.png" } // Necesitas 4 para 4 slots de equipo
];


// --- 1. Ir a Sección 2 (Selección de Cartas) - MODIFICADA ---
function goToCards() {
    const playerID = document.getElementById("playerID").value;
    
    if (playerID.trim() === "") {
        alert("Por favor, introduce tu ID de jugador.");
        return;
    }

    document.getElementById("section1").classList.remove("active");
    document.getElementById("section2").classList.add("active");

    const cardsContainer = document.getElementById("cardsContainer");
    cardsContainer.innerHTML = "";
    selectedCards = [];

    // --- FILA 1: 3 Cartas de Equipos ---
    for (let i = 0; i < 3; i++) {
        let card = document.createElement("div");
        card.classList.add("card");
        const cardData = teams[i];
        const cardName = cardData.name; 

        card.innerHTML = `<img src="${cardData.img}" alt="${cardName}">`;

        card.onclick = () => toggleSelect(card, cardName);
        cardsContainer.appendChild(card);
    }

    // --- FILA 2: 1 Equipo, 1 Coin, 1 GP ---

    // 1. Carta de Equipo 4
    let team4Card = document.createElement("div");
    team4Card.classList.add("card");
    const team4Data = teams[3]; // El cuarto equipo
    const team4Name = team4Data.name; 
    team4Card.innerHTML = `<img src="${team4Data.img}" alt="${team4Name}">`;
    team4Card.onclick = () => toggleSelect(team4Card, team4Name);
    cardsContainer.appendChild(team4Card);


    // 2. Carta de Monedas (Coin)
    coins.forEach(amount => {
        let card = document.createElement("div");
        card.classList.add("card");
        const coinName = `${amount} Coins`;

        card.innerHTML = `
            <img src="5.png" alt="Coin">
            <div style="color:white;font-size:18px;margin-top:6px;">${amount} Coins</div>
        `;

        card.onclick = () => toggleSelect(card, coinName);
        cardsContainer.appendChild(card);
    });
    
    // 3. Carta de GP
    gp.forEach(amount => {
        let card = document.createElement("div");
        card.classList.add("card");
        const gpName = `${amount} GP`;

        card.innerHTML = `
            <img src="6.png" alt="GP"> 
            <div style="color:white;font-size:18px;margin-top:6px;">${amount} GP</div>
        `;

        card.onclick = () => toggleSelect(card, gpName);
        cardsContainer.appendChild(card);
    });
}

// Lógica de Selección Múltiple (se mantiene igual)
function toggleSelect(card, cardName) {
    if (card.classList.contains("selected")) {
        card.classList.remove("selected");
        selectedCards = selectedCards.filter(c => c !== cardName);
    } else {
        card.classList.add("selected");
        selectedCards.push(cardName);
    }
}

// Ir a Sección 3 (Proceso de Búsqueda/Carga) - MODIFICADA (para mostrar GP)
function goToSearching() {

    if (selectedCards.length === 0) {
        alert("Por favor, selecciona al menos una carta.");
        return;
    }

    document.getElementById("section2").classList.remove("active");
    document.getElementById("section3").classList.add("active");

    const playerID = document.getElementById("playerID").value;
    document.getElementById("searchingPlayer").innerText = "ID: " + playerID;

    let dots = 0;
    const loadingText = document.getElementById("loadingText");

    const interval = setInterval(() => {
        dots = (dots + 1) % 4;
        loadingText.innerText = "Processing" + ".".repeat(dots);
    }, 400);

    setTimeout(() => {

        clearInterval(interval);

        document.getElementById("section3").classList.remove("active");
        document.getElementById("section4").classList.add("active");

        displayFinalCards(); // Llamar a la función que dibuja las cartas finales

        launchConfetti();

    }, 1500);
}

// Muestra las cartas seleccionadas en la sección final (Sección 4) - MODIFICADA (para GP)
function displayFinalCards() {
    const finalCards = document.getElementById("finalCards");
    finalCards.innerHTML = "";

    selectedCards.forEach(c => {
        let cardDiv = document.createElement("div");
        cardDiv.classList.add("card", "selected");
        let foundTeam = teams.find(t => t.name === c);

        if (c.includes("Coins")) {
            cardDiv.innerHTML = `
                <img src="5.png" alt="Coin">
                <div style="color:white;font-size:18px;margin-top:6px;">${c}</div>
            `;
        } else if (c.includes("GP")) {
             cardDiv.innerHTML = `
                <img src="6.png" alt="GP">
                <div style="color:white;font-size:18px;margin-top:6px;">${c}</div>
            `;
        } else if (foundTeam) {
            // Es una tarjeta de equipo
            cardDiv.innerHTML = `<img src="${foundTeam.img}" alt="${c}">`;
        }

        finalCards.appendChild(cardDiv);
    });
}


// Reinicio (se mantiene igual)
function restart() {
    document.getElementById("section4").classList.remove("active");
    document.getElementById("section1").classList.add("active");
    document.getElementById("playerID").value = "";
    selectedCards = [];
}

// CONFETTI (se mantiene igual)
function launchConfetti() {
    const duration = 2000;
    const animationEnd = Date.now() + duration;

    const defaults = {
        startVelocity: 30,
        spread: 360,
        ticks: 60,
        zIndex: 9999
    };

    function randomInRange(min, max) {
        return Math.random() * (max - min) + min;
    }

    const interval = setInterval(function() {
        const timeLeft = animationEnd - Date.now();

        if (timeLeft <= 0) return clearInterval(interval);

        const particleCount = 50 * (timeLeft / duration);

        confetti(Object.assign({}, defaults, {
            particleCount,
            origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 }
        }));

        confetti(Object.assign({}, defaults, {
            particleCount,
            origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 }
        }));

    }, 250);
}
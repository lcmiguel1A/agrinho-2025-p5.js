let character;
let characterX, characterY;
let characterSpeed = 5;

// Imagem de fundo principal (seu fundo.jpg)
let fundo; 

// Emojis para os obstáculos
let emojiRock = '🪨';  // Emoji de pedra
let emojiCone = '🚧'; // Emoji de cone/obra mais visual
let emojiCar = '🚗';    // Emoji de carro
let emojiTrash = '🗑️'; // Emoji de lixo
let emojiTree = '🌳';  // Emoji de árvore

// Emoji para o personagem
let emojiTractor = '🚜'; // Trator

let currentBg; // Fundo atual

let obstacles = [];
let obstacleSpeed = 3; // Velocidade inicial dos obstáculos
let obstacleTimer = 0;
let obstacleInterval = 120; // Tempo inicial entre o surgimento de obstáculos (maior valor = mais lento)

let score = 0;
let gameState = 'start'; // 'start', 'playing', 'end'

function preload() {
    fundo = loadImage('imagem/fundo.jpg'); 
}

function setup() {
    createCanvas(800, 600);
    characterX = width / 6; // Posição inicial do trator (mais para a esquerda)
    characterY = height / 2;
    currentBg = 'farm'; // Começa na fazenda

    ellipseMode(CENTER); 
    rectMode(CENTER);    
    imageMode(CORNER);   
    textAlign(CENTER, CENTER); 

    resetGameDifficulty(); 
}

function draw() {
    if (gameState === 'start') {
        drawStartScreen();
    } else if (gameState === 'playing') {
        gameLoop();
    } else if (gameState === 'end') {
        drawEndScreen();
    }
}

function drawStartScreen() {
    image(fundo, 0, 0, width, height); 

    textAlign(CENTER); 
    textSize(50);
    fill(0);
    text("Corrida do Campo à Cidade", width / 2, height / 3);
    textSize(20);
    text("Pressione ESPAÇO para começar", width / 2, height / 2);
}

function gameLoop() {
    drawBackground();

    // Desenha o personagem como um emoji de trator, virado para a esquerda
    push(); 
    translate(characterX, characterY); 
    scale(-1, 1); 
    fill(0); 
    textSize(40); 
    text(emojiTractor, 0, 0); 
    pop(); 

    // Move o personagem
    if (keyIsDown(UP_ARROW)) {
        characterY -= characterSpeed;
    }
    if (keyIsDown(DOWN_ARROW)) {
        characterY += characterSpeed;
    }
    characterY = constrain(characterY, 0, height); 

    // Gera e move obstáculos
    obstacleTimer++;
    if (obstacleTimer > obstacleInterval) {
        createObstacle();
        obstacleTimer = 0;
    }

    for (let i = obstacles.length - 1; i >= 0; i--) {
        obstacles[i].x -= obstacleSpeed;
        drawObstacle(obstacles[i]);

        // Remove obstáculos que saem da tela
        if (obstacles[i].x < -obstacles[i].size / 2) { 
            obstacles.splice(i, 1);
            // AJUSTE AQUI: Aumenta mais pontos por obstáculo
            score += 2; // Agora cada obstáculo vale 2 pontos!
            // Você pode mudar para:
            // score += 3; // Para 3 pontos por obstáculo
            // score += 5; // Para 5 pontos por obstáculo (bem mais rápido)
        }

        // Verifica colisão
        let charRadius = 20; 
        let obsHalfSize = obstacles[i].size / 2;

        if (abs(characterX - obstacles[i].x) < (charRadius + obsHalfSize) &&
            abs(characterY - obstacles[i].y) < (charRadius + obsHalfSize)) {
            gameState = 'end'; 
        }
    }

    // Atualiza e exibe a pontuação
    fill(0);
    textSize(24);
    textAlign(LEFT, TOP); 
    text("Pontos: " + score, 10, 30);
    textAlign(CENTER, CENTER);

    // Lógica de progressão de dificuldade e cenário (MAIS DESAFIADORA)
    // Os pontos de transição podem precisar ser reajustados agora que o score aumenta mais rápido.
    // Exemplo: se antes era score > 40, agora pode ser score > 80 (se cada obstáculo vale 2 pontos)
    if (score > 80 && currentBg === 'farm') { // Adaptei o score para 80 (era 40 * 2)
        currentBg = 'road';
        obstacleSpeed = 5;      
        obstacleInterval = 80;  
        obstacles = []; 
    } 
    else if (score > 200 && currentBg === 'road') { // Adaptei o score para 200 (era 100 * 2)
        currentBg = 'city';
        obstacleSpeed = 7;      
        obstacleInterval = 60;  
        obstacles = []; 
    } 
    else if (score > 360 && currentBg === 'city' && obstacleSpeed === 7) { // Adaptei o score para 360 (era 180 * 2)
        obstacleSpeed = 9;      
        obstacleInterval = 45;  
    }
    else if (score > 520 && currentBg === 'city' && obstacleSpeed === 9) { // Adaptei o score para 520 (era 260 * 2)
        obstacleSpeed = 11;     
        obstacleInterval = 35;  
    }
    else if (score > 700 && currentBg === 'city' && obstacleSpeed === 11) { // Adaptei o score para 700 (era 350 * 2)
        obstacleSpeed = 13;     
        obstacleInterval = 25;  
    }

    // Condição de vitória (ajustada para o novo ritmo de pontuação)
    if (score >= 1000 && currentBg === 'city') { // Adaptei para 1000 (era 500 * 2)
        gameState = 'end';
    }
}

function drawBackground() {
    if (currentBg === 'farm') {
        background(150, 200, 100); 
    } else if (currentBg === 'road') {
        background(100, 100, 100); 
    } else if (currentBg === 'city') {
        background(50, 50, 50); 
    }
}

function createObstacle() {
    let obstacleSize = random(30, 60); 
    let obstacleY = random(obstacleSize / 2, height - obstacleSize / 2); 
    let obstacleType; 

    if (currentBg === 'farm') {
        obstacleType = floor(random(2)); 
    } else if (currentBg === 'road') {
        obstacleType = 2; 
    } else if (currentBg === 'city') {
        obstacleType = floor(random(2)) + 3; 
    }

    obstacles.push({
        x: width + 50, 
        y: obstacleY,
        size: obstacleSize,
        type: obstacleType
    });
}

function drawObstacle(obstacle) {
    fill(0); 
    textSize(obstacle.size); 

    if (obstacle.type === 0) { 
        text(emojiRock, obstacle.x, obstacle.y);
    } else if (obstacle.type === 1) { 
        text(emojiTree, obstacle.x, obstacle.y);
    } else if (obstacle.type === 2) { 
        text(emojiCar, obstacle.x, obstacle.y);
    } else if (obstacle.type === 3) { 
        text(emojiCone, obstacle.x, obstacle.y);
    } else if (obstacle.type === 4) { 
        text(emojiTrash, obstacle.x, obstacle.y);
    }
}

function drawEndScreen() {
    background(0, 0, 0, 150); 
    textAlign(CENTER); 
    textSize(50);
    fill(255);
    if (score >= 1000 && currentBg === 'city') { 
        text("VOCÊ CONQUISTOU A CIDADE!", width / 2, height / 3);
    } else {
        text("FIM DE JOGO!", width / 2, height / 3);
    }
    textSize(30);
    text("Sua pontuação final: " + score, width / 2, height / 2);
    textSize(20);
    text("Pressione ENTER para jogar novamente", width / 2, height / 2 + 50);
}

function keyPressed() {
    if (keyCode === 32 && gameState === 'start') { 
        gameState = 'playing';
        score = 0;
        obstacles = []; 
        characterY = height / 2;
        currentBg = 'farm'; 
        resetGameDifficulty(); 
    }
    if (keyCode === ENTER && gameState === 'end') {
        gameState = 'start'; 
    }
}

function resetGameDifficulty() {
    obstacleSpeed = 3;      
    obstacleInterval = 120; 
}
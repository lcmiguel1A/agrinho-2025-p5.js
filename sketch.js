let character;
let characterX, characterY;
let characterSpeed = 5;

let bgFarm; // Imagem de fundo da fazenda
let bgRoad; // Imagem de fundo da estrada
let bgCity; // Imagem de fundo da cidade
let currentBg; // Fundo atual

let obstacles = [];
let obstacleSpeed = 3;
let obstacleTimer = 0;
let obstacleInterval = 120; // Tempo entre o surgimento de obstáculos

let score = 0;
let gameState = 'start'; // 'start', 'playing', 'end'

function preload() {
  // Carregue suas imagens aqui
  // character = loadImage('assets/character.png');
  // bgFarm = loadImage('assets/farm_background.png');
  // bgRoad = loadImage('assets/road_background.png');
  // bgCity = loadImage('assets/city_background.png');
  // obstacle1 = loadImage('assets/rock.png');
  // obstacle2 = loadImage('assets/tree.png');
  // obstacle3 = loadImage('assets/car.png');
  fundo =  loadImage('imagem/fundo.jpg');

  // Para um começo rápido sem imagens, podemos usar formas
}

function setup() {
  createCanvas(800, 600);
  characterX = width / 4;
  characterY = height / 2;
  currentBg = 'farm'; // Começa na fazenda
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
  background(fundo); // Céu azul
  textAlign(CENTER);
  textSize(50);
  fill(0);
  text("Corrida do Campo à Cidade", width / 2, height / 3);
  textSize(20);
  text("Pressione ESPAÇO para começar", width / 2, height / 2);
}

function gameLoop() {
  // Desenha o fundo baseado no estado atual
  drawBackground();

  // Desenha o personagem (por enquanto, um círculo)
  fill(255, 0, 0); // Vermelho
  ellipse(characterX, characterY, 40, 40); // Representa o personagem

  // Move o personagem
  if (keyIsDown(UP_ARROW)) {
    characterY -= characterSpeed;
  }
  if (keyIsDown(DOWN_ARROW)) {
    characterY += characterSpeed;
  }
  characterY = constrain(characterY, 0, height); // Impede que o personagem saia da tela

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
    if (obstacles[i].x < -50) {
      obstacles.splice(i, 1);
      score++; // Aumenta a pontuação ao passar por um obstáculo
    }

    // Verifica colisão (simplificado)
    if (dist(characterX, characterY, obstacles[i].x, obstacles[i].y) < 40) {
      gameState = 'end'; // Game Over se colidir
    }
  }

  // Atualiza e exibe a pontuação
  fill(0);
  textSize(24);
  text("Pontos: " + score, 10, 30);

  // Lógica de progressão de cenário
  if (score > 50 && currentBg === 'farm') {
    currentBg = 'road';
    obstacleSpeed = 4; // Aumenta a dificuldade
  } else if (score > 150 && currentBg === 'road') {
    currentBg = 'city';
    obstacleSpeed = 5; // Aumenta mais a dificuldade
  }
  // Condição de vitória
  if (score >= 300 && currentBg === 'city') { // Exemplo: 300 pontos na cidade para ganhar
    gameState = 'end';
    // Você pode adicionar uma mensagem de vitória aqui
  }
}

function drawBackground() {
  if (currentBg === 'farm') {
    background(150, 200, 100); // Verde para fazenda
    // image(bgFarm, 0, 0, width, height); // Se usar imagem
  } else if (currentBg === 'road') {
    background(100, 100, 100); // Cinza para estrada
    // image(bgRoad, 0, 0, width, height); // Se usar imagem
  } else if (currentBg === 'city') {
    background(50, 50, 50); // Escuro para cidade
    // image(bgCity, 0, 0, width, height); // Se usar imagem
  }
}

function createObstacle() {
  let type = floor(random(3)); // 0, 1, 2 para diferentes tipos de obstáculos
  let obstacleSize = random(30, 60);
  let obstacleY = random(height);
  let obstacleColor;

  if (currentBg === 'farm') {
    obstacleColor = color(139, 69, 19); // Marrom para pedras/troncos
  } else if (currentBg === 'road') {
    obstacleColor = color(0, 0, 0); // Preto para buracos/carros
  } else if (currentBg === 'city') {
    obstacleColor = color(200, 0, 0); // Vermelho para cones/lixo
  }

  obstacles.push({
    x: width + 50,
    y: obstacleY,
    size: obstacleSize,
    color: obstacleColor,
    type: type // Pode ser usado para carregar diferentes imagens
  });
}

function drawObstacle(obstacle) {
  fill(obstacle.color);
  rect(obstacle.x, obstacle.y, obstacle.size, obstacle.size); // Retângulos simples para obstáculos
  // Se usar imagens:
  // if (obstacle.type === 0) { image(obstacle1, obstacle.x, obstacle.y, obstacle.size, obstacle.size); }
  // else if (obstacle.type === 1) { image(obstacle2, obstacle.x, obstacle.y, obstacle.size, obstacle.size); }
  // else if (obstacle.type === 2) { image(obstacle3, obstacle.x, obstacle.y, obstacle.size, obstacle.size); }
}

function drawEndScreen() {
  background(0, 0, 0, 150); // Fundo escuro semitransparente
  textAlign(CENTER);
  textSize(50);
  fill(255);
  if (score >= 300 && currentBg === 'city') {
    text("VOCÊ CHEGOU À CIDADE!", width / 2, height / 3);
  } else {
    text("FIM DE JOGO!", width / 2, height / 3);
  }
  textSize(30);
  text("Sua pontuação final: " + score, width / 2, height / 2);
  textSize(20);
  text("Pressione ENTER para jogar novamente", width / 2, height / 2 + 50);
}

function keyPressed() {
  if (keyCode === 32 && gameState === 'start') { // ESPAÇO
    gameState = 'playing';
    score = 0;
    obstacles = [];
    characterY = height / 2;
    currentBg = 'farm';
    obstacleSpeed = 3;
  }
  if (keyCode === ENTER && gameState === 'end') {
    gameState = 'start'; // Volta para a tela inicial
  }
}
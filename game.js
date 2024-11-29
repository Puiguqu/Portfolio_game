
let player;
let rooms = [];
let currentRoomIndex = 0;
let cameraOffsetX = 0;
let cameraOffsetY = 0;
let linkOpened = false;
let showInstructions = true;
let instructionsTimer = 0;

function setup() {
  instructionsTimer = millis();
  showInstructions = true;
  createCanvas(800, 600);
  player = new Player(width / 5, -100);

  loadGitHubRepositories();
  

  rooms.push(new Room('Kaggle Profile', 'Visit my Kaggle profile', 'https://www.kaggle.com/seantanjunkit', 0, -300));

  
  rooms.push(new Room('MCTS', 'Monte Carlo Tree Search repository', 'https://github.com/lapatradaa/MCTS', 200, -300));
}

function draw() {
  background(50);

  
  translate(-cameraOffsetX, -cameraOffsetY);
  
  rooms.forEach(room => room.display());

  player.display();

  handleMovement();
  updateCamera();
}

function handleMovement() {
  if (keyIsDown(RIGHT_ARROW)) {
    player.move(5, 0);
    linkOpened = false;
  } else if (keyIsDown(LEFT_ARROW)) {
    player.move(-5, 0);
    linkOpened = false;
  } else if (keyIsDown(UP_ARROW)) {
    player.move(0, -5);
    linkOpened = false;
  } else if (keyIsDown(DOWN_ARROW)) {
    player.move(0, 5);
    linkOpened = false;
  }

  if (rooms[currentRoomIndex].isPlayerInside(player.x, player.y) && keyIsDown(32) && !linkOpened) {
    window.open(rooms[currentRoomIndex].link, '_blank');
    linkOpened = true;
  }
}

function updateCamera() {
  cameraOffsetX = lerp(cameraOffsetX, player.x - width / 2, 0.1);
  cameraOffsetY = lerp(cameraOffsetY, player.y - height / 2, 0.1);
}

function loadGitHubRepositories() {
  fetch('https://api.github.com/users/Puiguqu/repos')
    .then(response => response.json())
    .then(data => {
      const roomCount = data.length;
      const spacingX = 200; 
      let index = 0;

      data.forEach(repo => {
        const x = 400 + index * 200;
        const y = -300;
        rooms.push(new Room(repo.name, repo.description, repo.html_url, x, y));
        index++;
      });
    })
    .catch(error => console.error('Error loading GitHub repositories:', error));
}

class Player {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }

  move(dx, dy) {
    this.x += dx;
    this.y += dy;
    this.checkRoomInteraction();
  }

  display() {
    fill(255);
    ellipse(this.x, this.y, 30, 30);
  }

  checkRoomInteraction() {
    for (let i = 0; i < rooms.length; i++) {
      if (rooms[i].isPlayerInside(this.x, this.y)) {
        currentRoomIndex = i;
      }
    }
  }
}

class Room {
  constructor(name, description, link, x, y) {
    this.name = name;
    this.description = description;
    this.link = link;
    this.x = x;
    this.y = y;
  }

  display() {
    fill(200, 100, 100);
    rect(this.x, this.y + 40, 70, 70);
    fill(255);
    textSize(14);
    textAlign(CENTER, TOP);
    textStyle(BOLD);
    text(this.name, this.x + 35, this.y - 20);
    textStyle(NORMAL);
    textSize(12);
    textAlign(CENTER, TOP);
    textSize(12);
    let words = this.description.split(' ');
    let line = '';
    let yOffset = 0;
    words.forEach(word => {
      let testLine = line + word + ' ';
      if (textWidth(testLine) > 100) {
        text(line, this.x + 35, this.y + yOffset);
        line = word + ' ';
        yOffset += 15;
      } else {
        line = testLine;
      }
    });
    text(line, this.x + 35, this.y + yOffset);
  }

  isPlayerInside(px, py) {
    return (px > this.x && px < this.x + 70 && py > this.y + 40 && py < this.y + 110);
  }
}

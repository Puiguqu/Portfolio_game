// Include the p5.js library in your HTML file to run this code
// <script src="https://cdnjs.cloudflare.com/ajax/libs/p5.js/1.4.0/p5.js"></script>

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

  // Load GitHub repositories and spread rooms evenly
  loadGitHubRepositories();
  

  // Add Kaggle profile room
  rooms.push(new Room('Kaggle Profile', 'Visit my Kaggle profile', 'https://www.kaggle.com/seantanjunkit', 0, -300));

  
  rooms.push(new Room('MCTS', 'Monte Carlo Tree Search repository', 'https://github.com/lapatradaa/MCTS', 200, -300));
}

function draw() {
  background(50);

  
  
  // Display instructions in the middle of the player's screen for the first 15 seconds
  if (showInstructions && millis() - instructionsTimer < 15000) {
    fill(255);
    textSize(20);
    textAlign(CENTER, TOP);
    text('Use arrow keys to move. Press SPACE to enter a portal.', width / 2, 30);
  } else {
    showInstructions = false;
  }
  
  
  translate(-cameraOffsetX, -cameraOffsetY);
  
  // Draw all rooms
  rooms.forEach(room => room.display());

  // Draw player
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

  if (rooms[currentRoomIndex].isPlayerInside(player.x, player.y) && keyIsDown(32) && !linkOpened) { // Spacebar key code is 32
    window.open(rooms[currentRoomIndex].link, '_blank');
    linkOpened = true;
  }
}

function updateCamera() {
  // Use lerp to smoothly transition the camera to follow the player
  cameraOffsetX = lerp(cameraOffsetX, player.x - width / 2, 0.1);
  cameraOffsetY = lerp(cameraOffsetY, player.y - height / 2, 0.1);
}

function loadGitHubRepositories() {
  // Fetch data from GitHub API
  fetch('https://api.github.com/users/Puiguqu/repos')
    .then(response => response.json())
    .then(data => {
      const roomCount = data.length;
      const spacingX = 200; // Fixed distance between portals
      // Starting x position is now handled in the x calculation directly
      let index = 0;

      data.forEach(repo => {
        const x = 400 + index * 200; // Evenly space portals to the right of the initial portal
        const y = -300; // Alternate y position to prevent overlap
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
    // Update player position without boundaries
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

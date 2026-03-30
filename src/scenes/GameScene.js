export class GameScene extends Phaser.Scene {
  constructor() {
    super({ key: 'GameScene' });
  }

  create() {
    this.score = 0;
    this.coins = 0;
    this.lives = 3;
    this.gameSpeed = 200;
    this.isInvincible = false;
    this.jumpCount = 0;
    this.enemyList = [];
    this.coinList = [];

    this.createBackground();
    this.createPlatforms();
    this.createPlayer();
    this.createHUD();
    this.createInput();

    this.time.addEvent({
      delay: 1500,
      callback: this.spawnEnemy,
      callbackScope: this,
      loop: true
    });

    this.time.addEvent({
      delay: 1200,
      callback: this.spawnCoin,
      callbackScope: this,
      loop: true
    });

    this.time.addEvent({
      delay: 100,
      callback: () => {
        this.score += 1;
        this.scoreText.setText('SCORE: ' + this.score);
        this.gameSpeed = 200 + Math.floor(this.score / 50) * 10;
      },
      loop: true
    });
  }

  createBackground() {
    this.add.rectangle(400, 200, 800, 400, 0x080b14);

    for (let i = 0; i < 80; i++) {
      this.add.rectangle(
        Phaser.Math.Between(0, 800),
        Phaser.Math.Between(0, 280),
        Math.random() < 0.3 ? 2 : 1,
        Math.random() < 0.3 ? 2 : 1,
        0xffffff
      ).setAlpha(Math.random() * 0.7 + 0.3);
    }

    const cols = [0x0d1a2e, 0x111a2e, 0x0a1525];
    for (let i = 0; i < 14; i++) {
      const x = i * 65;
      const h = Phaser.Math.Between(60, 150);
      const w = Phaser.Math.Between(40, 58);
      this.add.rectangle(x, 370 - h / 2, w, h, cols[i % 3]);
      this.add.rectangle(x, 370 - h, w, 2, 0x00ffff).setAlpha(0.4);
    }
  }

  createPlatforms() {
    this.platforms = this.physics.add.staticGroup();

    const ground = this.add.rectangle(400, 385, 800, 16, 0x1a2a4a);
    this.physics.add.existing(ground, true);
    this.platforms.add(ground);
    this.add.rectangle(400, 377, 800, 2, 0x00ffff).setAlpha(0.8);

    [
      { x: 150, y: 300, w: 120 },
      { x: 380, y: 260, w: 110 },
      { x: 600, y: 220, w: 120 },
      { x: 750, y: 300, w: 100 },
    ].forEach(p => {
      const plat = this.add.rectangle(p.x, p.y, p.w, 12, 0x1a2a4a);
      this.physics.add.existing(plat, true);
      this.platforms.add(plat);
      this.add.rectangle(p.x, p.y - 5, p.w, 2, 0x00ffff).setAlpha(0.8);
    });
  }

  createPlayer() {
    this.player = this.physics.add.image(100, 320, '__DEFAULT');
    this.player.setDisplaySize(20, 32);
    this.player.body.setSize(20, 32);
    this.player.setAlpha(0.001);
    this.player.setCollideWorldBounds(true);
    this.player.body.setGravityY(400);
    this.physics.add.collider(this.player, this.platforms);
    this.playerGfx = this.add.graphics();
  }

  createHUD() {
    this.add.rectangle(400, 14, 800, 28, 0x0d1a2e).setAlpha(0.9);
    this.add.rectangle(400, 28, 800, 1, 0x00ffff).setAlpha(0.4);

    this.scoreText = this.add.text(16, 6, 'SCORE: 0', {
      fontSize: '14px',
      fontFamily: 'Courier New',
      color: '#00ffff'
    });

    this.coinText = this.add.text(200, 6, 'COINS: 0', {
      fontSize: '14px',
      fontFamily: 'Courier New',
      color: '#ffff00'
    });

    this.livesText = this.add.text(580, 6, 'LIVES: ♥ ♥ ♥', {
      fontSize: '14px',
      fontFamily: 'Courier New',
      color: '#ff00ff'
    });

    this.speedText = this.add.text(370, 6, 'SPEED: 1x', {
      fontSize: '14px',
      fontFamily: 'Courier New',
      color: '#ffffff'
    });
  }

  createInput() {
    this.cursors = this.input.keyboard.createCursorKeys();
    this.wasd = this.input.keyboard.addKeys({
      up: Phaser.Input.Keyboard.KeyCodes.W,
      left: Phaser.Input.Keyboard.KeyCodes.A,
      right: Phaser.Input.Keyboard.KeyCodes.D
    });
  }

  spawnEnemy() {
    const y = 355;
    const gfx = this.add.graphics();

    gfx.fillStyle(0xff0066);
    gfx.fillRect(-12, -16, 24, 32);

    gfx.fillStyle(0xffffff);
    gfx.fillRect(2, -12, 7, 5);

    gfx.lineStyle(2, 0xff0066, 0.8);
    gfx.strokeRect(-14, -18, 28, 36);

    gfx.x = 850;
    gfx.y = y;

    this.enemyList.push({
      gfx,
      x: 850,
      y,
      width: 24,
      height: 32,
      alive: true
    });
  }

  
spawnCoin() {
  const x = Phaser.Math.Between(50, 750);
  const y = 0;

  const gfx = this.add.graphics();
  gfx.fillStyle(0xffdd00);
  gfx.fillCircle(0, 0, 7);
  gfx.fillStyle(0xffaa00);
  gfx.fillCircle(-2, -2, 3);
  gfx.x = x;
  gfx.y = y;

  this.coinList.push({
    gfx,
    x,
    y,
    vy: 60,
    radius: 7,
    alive: true
  });
}

  checkCollisions() {
    const px = this.player.x;
    const py = this.player.y;

    // Enemy collisions
    this.enemyList.forEach(enemy => {
      if (!enemy.alive) return;

      enemy.x -= this.gameSpeed * (1 / 60);
      enemy.gfx.x = enemy.x;

      if (enemy.x < -60) {
        enemy.alive = false;
        enemy.gfx.destroy();
        return;
      }

      const dx = Math.abs(px - enemy.x);
      const dy = Math.abs(py - enemy.y);

      if (dx < 22 && dy < 30 && !this.isInvincible) {
        enemy.alive = false;
        enemy.gfx.destroy();
        this.hitEnemy();
      }
    });

    // Coin collisions
    this.coinList.forEach(coin => {
      if (!coin.alive) return;

      coin.x = coin.x;
      coin.vy += 120 * (1 / 60);
      coin.y += coin.vy * (1 / 60);
      coin.gfx.x = coin.x;
      coin.gfx.y = coin.y;

      if (coin.y > 400 || coin.x < -60) {
        coin.alive = false;
        coin.gfx.destroy();
        return;
      }

      const dx = Math.abs(px - coin.x);
      const dy = Math.abs(py - coin.y);

      if (dx < 20 && dy < 20) {
        coin.alive = false;
        coin.gfx.destroy();
        this.coins++;
        this.score += 50;
        this.coinText.setText('COINS: ' + this.coins);
        this.scoreText.setText('SCORE: ' + this.score);
        this.cameras.main.flash(80, 255, 220, 0, false);
      }
    });

    this.enemyList = this.enemyList.filter(e => e.alive);
    this.coinList = this.coinList.filter(c => c.alive);
  }

  hitEnemy() {
    this.isInvincible = true;
    this.lives--;

    const hearts = ['♥ ♥ ♥', '♥ ♥ ✕', '♥ ✕ ✕', '✕ ✕ ✕'];
    this.livesText.setText('LIVES: ' + (hearts[3 - this.lives] || '✕ ✕ ✕'));

    this.cameras.main.shake(300, 0.015);

    this.tweens.add({
      targets: this.playerGfx,
      alpha: 0,
      duration: 80,
      yoyo: true,
      repeat: 6,
      onComplete: () => {
        this.playerGfx.setAlpha(1);
        this.isInvincible = false;
      }
    });

    if (this.lives <= 0) {
      this.time.delayedCall(500, () => {
        this.scene.start('GameOverScene', {
          score: this.score,
          coins: this.coins
        });
      });
    }
  }

  drawPlayer() {
    this.playerGfx.clear();
    const px = this.player.x;
    const py = this.player.y;
    const facing = this.player.body.velocity.x >= 0 ? 1 : -1;

    // Body
    this.playerGfx.fillStyle(0x1a0a2a);
    this.playerGfx.fillRect(px - 10, py - 16, 20, 32);

    // Neon suit stripes
    this.playerGfx.fillStyle(0x00ffff);
    this.playerGfx.fillRect(px - 10, py - 16, 20, 2);
    this.playerGfx.fillRect(px - 10, py + 14, 20, 2);
    this.playerGfx.fillRect(px - 1, py - 16, 2, 32);

    // Visor
    this.playerGfx.fillStyle(0x00ffff);
    this.playerGfx.fillRect(px + (facing > 0 ? 1 : -7), py - 12, 6, 5);

    // Legs
    this.playerGfx.fillStyle(0x0a0515);
    this.playerGfx.fillRect(px - 9, py + 10, 7, 6);
    this.playerGfx.fillRect(px + 2, py + 10, 7, 6);

    // Neon legs
    this.playerGfx.fillStyle(0xff00ff);
    this.playerGfx.fillRect(px - 9, py + 15, 7, 1);
    this.playerGfx.fillRect(px + 2, py + 15, 7, 1);
  }

  update() {
    const left = this.cursors.left.isDown || this.wasd.left.isDown;
    const right = this.cursors.right.isDown || this.wasd.right.isDown;
    const jump =
      Phaser.Input.Keyboard.JustDown(this.cursors.up) ||
      Phaser.Input.Keyboard.JustDown(this.wasd.up) ||
      Phaser.Input.Keyboard.JustDown(this.cursors.space);

    if (left) this.player.body.setVelocityX(-220);
    else if (right) this.player.body.setVelocityX(220);
    else this.player.body.setVelocityX(0);

    if (jump) {
      if (this.player.body.blocked.down) {
        this.player.body.setVelocityY(-520);
        this.jumpCount = 1;
      } else if (this.jumpCount < 2) {
        this.player.body.setVelocityY(-520);
        this.jumpCount++;
      }
    }

    if (this.player.body.blocked.down) this.jumpCount = 0;

    const speedLevel = (Math.floor(this.gameSpeed / 10) / 20).toFixed(1);
    this.speedText.setText('SPEED: ' + speedLevel + 'x');

    this.drawPlayer();
    this.checkCollisions();
  }
}
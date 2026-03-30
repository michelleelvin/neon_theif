export class GameOverScene extends Phaser.Scene {
  constructor() {
    super({ key: 'GameOverScene' });
  }

  init(data) {
    this.finalScore = data.score || 0;
    this.finalCoins = data.coins || 0;
  }

  create() {
    const width = 800;
    const height = 400;

    this.add.rectangle(0, 0, width, height, 0x080b14).setOrigin(0);

    this.add.text(width / 2, height / 4, 'HEIST FAILED', {
      fontSize: '48px',
      fontFamily: 'Courier New',
      color: '#ff00ff',
      stroke: '#00ffff',
      strokeThickness: 4
    }).setOrigin(0.5);

    this.add.text(width / 2, height / 2 - 30, `SCORE: ${this.finalScore}`, {
      fontSize: '28px',
      fontFamily: 'Courier New',
      color: '#00ffff'
    }).setOrigin(0.5);

    this.add.text(width / 2, height / 2 + 20, `COINS: ${this.finalCoins}`, {
      fontSize: '28px',
      fontFamily: 'Courier New',
      color: '#ffff00'
    }).setOrigin(0.5);

    const restartText = this.add.text(width / 2, height * 0.85, 'PRESS SPACE TO RETRY', {
      fontSize: '18px',
      fontFamily: 'Courier New',
      color: '#ffffff'
    }).setOrigin(0.5);

    this.tweens.add({
      targets: restartText,
      alpha: 0,
      duration: 500,
      yoyo: true,
      repeat: -1
    });

    this.input.keyboard.once('keydown-SPACE', () => {
      this.scene.start('GameScene');
    });
  }
}
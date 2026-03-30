export class MenuScene extends Phaser.Scene {
  constructor() {
    super({ key: 'MenuScene' });
  }

  create() {
    // Title
    this.add.text(400, 100, 'NEON THIEF', {
      fontSize: '52px',
      fontFamily: 'Courier New',
      color: '#00ffff',
      stroke: '#ff00ff',
      strokeThickness: 4
    }).setOrigin(0.5);

    // Subtitle
    this.add.text(400, 180, 'The Cyberpunk Heist Runner', {
      fontSize: '18px',
      fontFamily: 'Courier New',
      color: '#ff00ff'
    }).setOrigin(0.5);

    // Start prompt
    const startText = this.add.text(400, 280, 'PRESS SPACE TO START', {
      fontSize: '20px',
      fontFamily: 'Courier New',
      color: '#ffffff'
    }).setOrigin(0.5);

    // Blinking animation
    this.tweens.add({
      targets: startText,
      alpha: 0,
      duration: 500,
      yoyo: true,
      repeat: -1
    });

    // Start game on Space
    this.input.keyboard.once('keydown-SPACE', () => {
      this.scene.start('GameScene');
    });
  }
}
export class GameOverScene extends Phaser.Scene {
    score: number = 0;
    raison: string = "";

    constructor() {
        super({ key: 'GameOverScene' });
    }

    init(data: { score: number; raison: string; }) {
        this.score = data.score;
        this.raison = data.raison;
    }

    preload() {
        this.load.image('home', '/assets/buttons/png/Rect-Light-Default/Home.png');
        this.load.image('bg', '/assets/custom/bg2.png');
    }

    create() {
        const background = this.add.image(0, 0, 'bg').setOrigin(0, 0);
        background.displayWidth = this.sys.canvas.width;
        background.displayHeight = this.sys.canvas.height;

        let titre = this.add.text(600, 250, 'Game Over', { fontSize: '72px', fontFamily: 'urban', color: '#fff', align:"center" }).setOrigin(0.5, 0.5);
        let score = this.add.text(600, 350, this.raison, { fontSize: '32px', fontFamily: 'urban', color: '#fff', align:"center" }).setOrigin(0.5, 0.5);
        let raison = this.add.text(600, 500, 'Score: ' + this.score, { fontSize: '32px', fontFamily: 'urban', color: '#fff', align:"center" }).setOrigin(0.5, 0.5);
        let homeButton = this.add.image(600, 650, 'home').setInteractive().setOrigin(0.5, 0.5).setScale(1.2);

        homeButton.on('pointerdown', () => {
            this.scene.stop('GameOverScene');
            this.scene.stop('GameScene');
            this.scene.start("MenuScene");
        });
        homeButton.on('pointerover', () => {
            homeButton.setTint(0x93d800);
        });
        homeButton.on('pointerout', () => {
            homeButton.clearTint();
        });
    }
}
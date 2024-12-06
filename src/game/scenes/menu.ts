import Phaser from "phaser";

export class MenuScene extends Phaser.Scene {
    constructor() {
        super({ key: 'MenuScene' });
    }

    preload() {
        this.load.image('play', '/assets/buttons/png/Rect-Light-Default/Play.png');
        this.load.image('pause', '/assets/buttons/png/Square-Light-Default/Pause.png');
        this.load.image('bg', '/assets/custom/bg2.png');
    }

    create() {
        this.scene.stop('GameOverScene');
        this.scene.stop('GameScene');

        const background = this.add.image(0, 0, 'bg').setOrigin(0, 0);

        let playButton = this.add.image(600, 650, 'play').setInteractive().setOrigin(0.5, 0.5).setScale(1.2);

        let titre = this.add.text(600, 250, 'Urban Chase', { fontSize: '72px', fontFamily: 'urban', color: '#fff', align:"center" }).setOrigin(0.5, 0.5);
        let score = this.add.text(600, 350, 'La poursuite ultime', { fontSize: '32px', fontFamily: 'urban', color: '#fff', align:"center" }).setOrigin(0.5, 0.5);

        playButton.on('pointerdown', () => {
            this.scene.stop('MenuScene');
            this.scene.start("GameScene");
        });
        playButton.on('pointerover', () => {
            playButton.setTint(0x93d800);
        });
        playButton.on('pointerout', () => {
            playButton.clearTint();
        });
    }

    override update() {
    }
}

import Phaser from "phaser";

export class MenuScene extends Phaser.Scene {
    constructor() {
        super({ key: 'MenuScene' });
    }

    preload() {
        this.load.image('play', '/assets/buttons/png/Rect-Light-Default/Play.png');
        this.load.image('pause', '/assets/buttons/png/Square-Light-Default/Pause.png');
        this.load.image('sound', '/assets/buttons/png/Square-Light-Default/Sound-Three.png');
    }

    create() {
        let playButton = this.add.image(600, 650, 'play').setInteractive().setOrigin(0.5, 0.5).setScale(1.2);
        let soundButton = this.add.image(1135, 15, 'sound').setInteractive().setOrigin(0, 0);

        let titre = this.add.text(600, 250, 'Urban Chase', { fontSize: '72px', fontFamily: 'urban', color: '#fff', align:"center" }).setOrigin(0.5, 0.5);

        playButton.on('pointerdown', () => {
            this.scene.start("GameScene");
        });
        playButton.on('pointerover', () => {
            playButton.setTint(0x93d800);
        });
        playButton.on('pointerout', () => {
            playButton.clearTint();
        });

        soundButton.on('pointerdown', () => {

        });
        soundButton.on('pointerover', () => {
            soundButton.setTint(0xffd700);
        });
        soundButton.on('pointerout', () => {
            soundButton.clearTint();
        });
    }

    override update() {
    }
}

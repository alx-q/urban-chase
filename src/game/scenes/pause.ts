import Phaser from "phaser";

export class PauseScene extends Phaser.Scene {
    constructor() {
        super({ key: 'PauseScene' });
    }

    preload() {
        this.load.image('pause', '/assets/buttons/png/Square-Light-Default/Pause.png');
        this.load.image('sound', '/assets/buttons/png/Square-Light-Default/Sound-Three.png');
        this.load.image('soundmute', '/assets/buttons/png/Square-Light-Default/Sound-None.png');
    }

    create() {
        let soundButton = this.add.image(675, 15, 'sound').setInteractive().setOrigin(0, 0);
        let pauseButton = this.add.image(735, 15, 'pause').setInteractive().setOrigin(0, 0);

        this.add.text(400, 180, 'Pause', { fontSize: '72px', fontFamily: 'font1', color: '#fff', align: "center" }).setOrigin(0.5, 0.5);

        soundButton.on('pointerdown', () => {

        });
        soundButton.on('pointerover', () => {
            soundButton.setTint(0xffd700);
        });
        soundButton.on('pointerout', () => {
            soundButton.clearTint();
        });

        pauseButton.on('pointerdown', () => {

        });
        pauseButton.on('pointerover', () => {
            pauseButton.setTint(0x0097ff);
        });
        pauseButton.on('pointerout', () => {
            pauseButton.clearTint();
        });

    }

    override update() {
    }
}

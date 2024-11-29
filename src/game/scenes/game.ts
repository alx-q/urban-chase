import Phaser from "phaser";

export class GameScene extends Phaser.Scene {
    route: Phaser.GameObjects.TileSprite | undefined;

    musique_on: Boolean = true

    voiture_joueur: Phaser.GameObjects.Image | undefined

    constructor() {
        super({ key: 'GameScene' });
    }

    preload() {
        this.load.image('pause', '/assets/buttons/png/Square-Light-Default/Pause.png');
        this.load.image('sound', '/assets/buttons/png/Square-Light-Default/Sound-Three.png');
        this.load.image('soundmute', '/assets/buttons/png/Square-Light-Default/Sound-None.png');

        this.load.image('limit_sign', '/assets/custom/limit.png');
        this.load.image('cluster', '/assets/custom/cluster.png');

        this.load.image('maxima', '/assets/custom/maxima.png');


        this.load.image('vehicules', '/assets/city/vehicles/vehicles0007.png');
        this.load.image('routes', '/assets/city/citysecondprops/strokecitysecondcityprops0001.png');

        this.load.audio('musique1', '/sound/musique.mp3');
    }

    create() {


        const texturesRoutes = this.textures.get('routes');
        texturesRoutes.add('route droite', 0, 874, 746, 348, 136);


        this.route = this.add.tileSprite(610, 400, 348, 800, 'routes', 'route droite');

        this.voiture_joueur = this.add.image(615, 410, 'maxima').setOrigin(0, 0).setScale(0.4);
        this.physics.add.existing(this.voiture_joueur);
        let body = this.voiture_joueur.body as Phaser.Physics.Arcade.Body;


        let soundButton = this.add.image(1075, 15, 'sound').setInteractive().setOrigin(0, 0);
        let pauseButton = this.add.image(1135, 15, 'pause').setInteractive().setOrigin(0, 0);

        let limit_sign = this.add.image(1120, 694, 'limit_sign').setOrigin(0, 0).setScale(0.7);
        let limit_text = this.add.text(1155, 752, '80', { fontSize: '32px', fontFamily: 'urban', color: '#000', align: "center" }).setOrigin(0.5, 0.5);


        let cluster_img = this.add.image(50, 820, 'cluster').setOrigin(0, 1).setScale(0.8);
        let odo_text = this.add.text(260, 780, '1256 KM', { fontSize: '10px', fontFamily: 'urban', color: '#fff', align: "center" }).setOrigin(0.5, 0.5);
        let trip_text = this.add.text(270, 768, '(B) 14 KM', { fontSize: '10px', fontFamily: 'urban', color: '#fff', align: "center" }).setOrigin(0.5, 0.5);
        let gear_text = this.add.text(353, 705, 'D', { fontSize: '22px', fontFamily: 'urban', color: '#fff', align: "center" }).setOrigin(0.5, 0.5);

        let ready = this.add.text(600, 300, '3', { fontSize: '120px', fontFamily: 'urban', color: '#fff', align: "center" }).setOrigin(0.5, 0.5);

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


        let musique = this.sound.add('musique1', {
            loop: true,
            volume: 0.5
        });
        musique.play();

        this.input.keyboard!.on('keydown',
            (event: any) => {
                if (event.keyCode === Phaser.Input.Keyboard.KeyCodes.UP) {
                    (this.voiture_joueur!.body as Phaser.Physics.Arcade.Body).setVelocity(0, -50)
                } else if (event.keyCode === Phaser.Input.Keyboard.KeyCodes.DOWN) {
                    (this.voiture_joueur!.body as Phaser.Physics.Arcade.Body).setVelocity(0, 50)
                } else if (event.keyCode === Phaser.Input.Keyboard.KeyCodes.LEFT) {
                    (this.voiture_joueur!.body as Phaser.Physics.Arcade.Body).setVelocity(-50, 0)
                } else if (event.keyCode === Phaser.Input.Keyboard.KeyCodes.RIGHT) {
                    (this.voiture_joueur!.body as Phaser.Physics.Arcade.Body).setVelocity(50, 0)
                }
            }
            , this);
    }

    override update() {
        this.route!.tilePositionY -= 2
    }
}

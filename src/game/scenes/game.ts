import Phaser, { GameObjects } from "phaser";
import { Car } from '../objects/cars';
import { Constants } from "../constants";
export class GameScene extends Phaser.Scene {

    route: Phaser.GameObjects.TileSprite | undefined;

    musique_on: Boolean = true

    voiture_joueur: Phaser.Physics.Arcade.Image | undefined
    voitures: Phaser.Physics.Arcade.Group | undefined;
    cursors: Phaser.Types.Input.Keyboard.CursorKeys | undefined;
    vitesse: number = 1;
    gear_text: GameObjects.Text | undefined;
    aiguille_vitesse: Phaser.GameObjects.Line | undefined;
    tempsAcceleration: number = 0;
    aiguille_rpm: GameObjects.Line | undefined;

    private steeringFriction: number =5; // Friction rate

    constructor() {
        super({ key: 'GameScene' });
    }

    preload() {
        this.load.image('pause', '/assets/buttons/png/Square-Light-Default/Pause.png');
        this.load.image('sound', '/assets/buttons/png/Square-Light-Default/Sound-Three.png');
        this.load.image('soundmute', '/assets/buttons/png/Square-Light-Default/Sound-None.png');

        this.load.image('limit_sign', '/assets/custom/limit.png');
        this.load.image('cluster', '/assets/custom/cluster.png');
        this.load.image('info', '/assets/custom/info.png');

        // Voiture
        this.load.image('maxima', '/assets/custom/maxima.png');
        this.load.image('maxima_back', '/assets/custom/maxima-back.png');


        this.load.image('vehicules', '/assets/city/vehicles/vehicles0007.png');
        this.load.image('route', '/assets/custom/street.png');

        this.load.audio('musique1', '/sound/musique.mp3');
    }

    create() {
        this.cameras.main.setBackgroundColor('#169762')
        const texturesRoutes = this.textures.get('routes');
        texturesRoutes.add('route droite', 0, 0, 0, 540, 960);


        this.route = this.add.tileSprite(600, 400, 540, 800, 'route', 'route droite');

        this.voiture_joueur = this.physics.add.image(615, 410, 'maxima').setOrigin(0, 0).setScale(0.32).setImmovable(true);

        let soundButton = this.add.image(1075, 15, 'sound').setInteractive().setOrigin(0, 0);
        let pauseButton = this.add.image(1135, 15, 'pause').setInteractive().setOrigin(0, 0);

        let limit_sign = this.add.image(1120, 694, 'limit_sign').setOrigin(0, 0).setScale(0.7);
        let limit_sign_text = this.add.text(1155, 752, '80', { fontSize: '32px', fontFamily: 'urban', color: '#000', align: "center" }).setOrigin(0.5, 0.5);




        //let info = this.add.image(850, 800, 'info').setOrigin(0, 1).setScale(0.6);
        //let odo_text = this.add.text(260, 780, '1256 KM', { fontSize: '10px', fontFamily: 'urban', color: '#fff', align: "center" }).setOrigin(0.5, 0.5);
        //let trip_text = this.add.text(270, 768, '(B) 14 KM', { fontSize: '10px', fontFamily: 'urban', color: '#fff', align: "center" }).setOrigin(0.5, 0.5);

        let cluster_img = this.add.image(50, 820, 'cluster').setOrigin(0, 1).setScale(0.8).setDepth(5);
        this.gear_text = this.add.text(353, 705, 'M', { fontSize: '22px', fontFamily: 'urban', color: '#fff', align: "center" }).setOrigin(0.5, 0.5).setDepth(5);
        this.aiguille_vitesse = this.add.line(150, 740, 0, 0, 0, 50, 0xff0000).setOrigin(0.5, 1).setLineWidth(4).setDepth(5);
        this.aiguille_rpm = this.add.line(248, 732, 0, 0, 0, 50, 0xff0000).setOrigin(0.5, 1).setLineWidth(4).setDepth(5);

        //let ready = this.add.text(600, 300, '3', { fontSize: '120px', fontFamily: 'urban', color: '#fff', align: "center" }).setOrigin(0.5, 0.5);

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

        this.cursors = this.input.keyboard!.createCursorKeys();

        this.voitures = this.physics.add.group({
            classType: Car,
            runChildUpdate: true
        });



        this.time.addEvent({
            delay: 1500,
            callback: this.spawnCar,
            callbackScope: this,
            loop: true
        });

        this.physics.add.collider(this.voiture_joueur, this.voitures, this.handleCollision, undefined, this);
    }

    handleCollision(){

    }

    spawnCar() {
        if (this.voitures!.getChildren().length < 10) {
            const x = Constants.carLanes[Phaser.Math.Between(0, 3)]; // Random x position
            const y = Constants.carSpawns[Phaser.Math.Between(0, 1)];
            const voiture = this.voitures!.get(x, y) as Car;


        }
    }

    override update(time: number, delta: number) {
        if (this.cursors!.up.isDown) {
            this.vitesse = Math.min(220, Math.round((this.vitesse + 0.2) * 100) / 100);
            this.tempsAcceleration = Math.min(9000, this.tempsAcceleration + delta)
        } else if (this.cursors!.down.isDown && this.vitesse >= -30) {
            this.vitesse = Math.round((this.vitesse - 0.5) * 100) / 100;
            this.tempsAcceleration = Math.max(0, Math.min(9000, this.tempsAcceleration - 100))
        } else {
            this.tempsAcceleration = Math.max(0, Math.min(9000, this.tempsAcceleration - 100))
            if (this.vitesse > 0) {
                this.vitesse = Math.round((this.vitesse - 0.3) * 100) / 100;
            } else if (this.vitesse < 1) {
                this.vitesse = Math.round((this.vitesse + 0.3) * 100) / 100;
            }
        }

        if (this.cursors!.left.isDown) {
            this.voiture_joueur!.setVelocityX(-this.vitesse);
        } else if (this.cursors!.right.isDown) {
            this.voiture_joueur!.setVelocityX(this.vitesse);
        } else {
            if (this.voiture_joueur!.body!.velocity.x > 0) {
                this.voiture_joueur!.setVelocityX(Math.max(this.voiture_joueur!.body!.velocity.x - this.steeringFriction, 0));
            } else if (this.voiture_joueur!.body!.velocity.x < 0) {
                this.voiture_joueur!.setVelocityX(Math.min(this.voiture_joueur!.body!.velocity.x + this.steeringFriction, 0));
            }
        }

        if (this.vitesse > 1) {
            if (this.vitesse <= 20) {
                this.gear_text!.setText("1")
            } else if (this.vitesse <= 40) {
                this.gear_text!.setText("2")
            } else if (this.vitesse <= 60) {
                this.gear_text!.setText("3")
            } else if (this.vitesse <= 80) {
                this.gear_text!.setText("4")
            } else if (this.vitesse <= 100) {
                this.gear_text!.setText("5")
            } else if (this.vitesse <= 120) {
                this.gear_text!.setText("6")
            }
        } else if (this.vitesse >= -1 && this.vitesse <= 1) {
            this.gear_text!.setText("D")
        } else {
            this.gear_text!.setText("R")
        }

        this.route!.tilePositionY -= this.vitesse * 0.1

        this.voitures!.getChildren().forEach((entry) => {
            const car = entry as Car;
            car.setSpeed(this.vitesse);
            if (car.y > 1000 || car.y < -200) {
                car.destroy();
            }
        }
        );

        const maxSpeed = 220;
        const angle = (Phaser.Math.Clamp(this.vitesse / maxSpeed, -1, 1) * (Math.PI * 1.2) + 9.02);
        this.aiguille_vitesse!.setRotation(angle)

        const maxRpm = 90;
        const rpm = Math.floor(this.tempsAcceleration / 100);
        const angleRPM = (Phaser.Math.Clamp(rpm / maxRpm, -1, 1) * (Math.PI * 1.2) + 10.3);
        this.aiguille_rpm!.setRotation(angleRPM)
    }
}

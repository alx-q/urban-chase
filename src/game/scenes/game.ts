import Phaser, { GameObjects } from "phaser";
import { Car } from '../objects/cars';
import { Constants } from "../constants";
import { PoliceCar } from "../objects/police";
import { Vie } from "../objects/items/vie";
export class GameScene extends Phaser.Scene {

    route: Phaser.GameObjects.TileSprite | undefined;

    musique_on: Boolean = true
    musique: Phaser.Sound.NoAudioSound | Phaser.Sound.HTML5AudioSound | Phaser.Sound.WebAudioSound | undefined;

    // Voiture Joueur
    voiture_joueur: Phaser.Physics.Arcade.Image | undefined
    voitureJoueurParticuleGauche: GameObjects.Particles.ParticleEmitter | undefined;
    voitureJoueurParticuleDroite: GameObjects.Particles.ParticleEmitter | undefined;
    vitesse: number = 1;
    steeringFriction: number = 5;

    // Infos pour joueur
    gear_text: GameObjects.Text | undefined;
    aiguille_vitesse: Phaser.GameObjects.Line | undefined;
    tempsAcceleration: number = 0;
    aiguille_rpm: GameObjects.Line | undefined;

    // Voitures NPC
    voitures: Phaser.Physics.Arcade.Group | undefined;
    voituresCollider: Phaser.Physics.Arcade.Collider | undefined;

    // Clavier
    cursors: Phaser.Types.Input.Keyboard.CursorKeys | undefined;

    // Voiture Police
    voiturePolice: PoliceCar | undefined;
    lumierePolice: GameObjects.Image | undefined;
    tempsDepuisFlash: number = 0
    policeActive:boolean = true
    distancePoliceJoueur:number = 1000;

    // GPS
    gpsPoliceWindow: GameObjects.Image | undefined;
    gpsPoliceWindowText: GameObjects.Text | undefined;
    rpm: number = 0;


    // Coeurs
    coeur: GameObjects.Image[] = [];
    vies:number = 3


    score:number = 0
    itemsVies: Phaser.Physics.Arcade.Group | undefined;

    constructor() {
        super({ key: 'GameScene' });
    }

    preload() {
        this.load.image('pause', '/assets/buttons/png/Square-Light-Default/Pause.png');
        this.load.image('sound', '/assets/buttons/png/Square-Light-Default/Sound-Three.png');
        this.load.image('soundmute', '/assets/buttons/png/Square-Light-Default/Sound-None.png');

        this.load.image('limit_sign', '/assets/custom/limit.png');
        this.load.image('cluster', '/assets/custom/cluster.png');
        this.load.image('gps', '/assets/custom/gps.png');
        this.load.image('gps_police', '/assets/custom/gps-police.png');
        this.load.image('info', '/assets/custom/info.png');

        // Voiture
        this.load.image('maxima', '/assets/custom/maxima.png');
        this.load.image('maxima_2', '/assets/custom/maxima-back.png');
        this.load.image('voiture_police', '/assets/custom/police.png');

        this.load.image('civic', '/assets/custom/civic.png');
        this.load.image('qx50', '/assets/custom/qx50.png');
        this.load.image('camry', '/assets/custom/camry.png');
        this.load.image('camry2', '/assets/custom/camry-2.png');

        // Voiture Police
        this.load.image('police_lights_1', '/assets/custom/police-light-1.png');
        this.load.image('police_lights_2', '/assets/custom/police-light-2.png');


        this.load.image('vehicules', '/assets/city/vehicles/vehicles0007.png');
        this.load.image('route', '/assets/custom/street.png');

        this.load.audio('musique1', '/sound/musique.mp3');

        // Vies
        this.load.image('coeur', '/assets/custom/coeur.png');
    }

    create() {
        // Initialisation de variables
        this.vitesse = 0
        this.vies = 3
        this.score = 0


        this.cameras.main.setBackgroundColor('#169762')

        // Route
        this.route = this.add.tileSprite(600, 400, 540, 800, 'route', 'route droite');

        // Voiture du joueur
        this.voiture_joueur = this.physics.add.image(615, 520, 'maxima').setOrigin(0.5, 1).setScale(0.32).setImmovable(true).setDepth(1);
        this.voitureJoueurParticuleGauche = this.add.particles(635, 510, 'pause', { x: { min: -8, max: 0 }, y: 0, lifespan: 500, speedY: { min: 200, max: 400 }, scale: { start: 0.1, end: 0 }, quantity: 1, blendMode: 'ADD'});
        this.voitureJoueurParticuleDroite = this.add.particles(585, 510, 'pause', { x: { min: 0, max: 8 }, y: 0, lifespan: 500, speedY: { min: 200, max: 400 }, scale: { start: 0.1, end: 0 }, quantity: 1, blendMode: 'ADD'});

        // Infos pour joueur
        let cluster_img = this.add.image(50, 820, 'cluster').setOrigin(0, 1).setScale(0.8).setDepth(5);
        this.gear_text = this.add.text(353, 705, 'M', { fontSize: '22px', fontFamily: 'urban', color: '#fff', align: "center" }).setOrigin(0.5, 0.5).setDepth(5);
        this.aiguille_vitesse = this.add.line(150, 740, 0, 0, 0, 50, 0xff0000).setOrigin(0.5, 1).setLineWidth(4).setDepth(5);
        this.aiguille_rpm = this.add.line(248, 732, 0, 0, 0, 50, 0xff0000).setOrigin(0.5, 1).setLineWidth(4).setDepth(5);

        // Ecran GPS
        let gps = this.add.image(840, 632, 'gps').setOrigin(0, 0).setScale(0.9).setDepth(5);
        this.gpsPoliceWindow = this.add.image(860, 652, 'gps_police').setOrigin(0, 0).setScale(0.9).setDepth(5);
        this.gpsPoliceWindowText = this.add.text(920, 678, '0 m', { fontSize: '12px', fontFamily: 'arial', color: '#fff', align: "center" }).setOrigin(1, 0).setDepth(5);

        let pauseButton = this.add.image(1135, 15, 'pause').setInteractive().setOrigin(0, 0);

        // Limite vitesse
        let limit_sign = this.add.image(1120, 694, 'limit_sign').setOrigin(0, 0).setScale(0.7);
        let limit_sign_text = this.add.text(1155, 752, '80', { fontSize: '32px', fontFamily: 'urban', color: '#000', align: "center" }).setOrigin(0.5, 0.5);

        //let ready = this.add.text(600, 300, '3', { fontSize: '120px', fontFamily: 'urban', color: '#fff', align: "center" }).setOrigin(0.5, 0.5);

        // Voiture Police
        this.voiturePolice = new PoliceCar(this, 600, 1100).setOrigin(0.5, 0).setScale(0.32);
        this.lumierePolice = this.add.image(600, 800, 'police_lights_1').setOrigin(0.5, 1).setDepth(6);

        this.coeur.push(this.add.image(20, 20, 'coeur').setOrigin(0, 0).setDepth(5).setTint(0xf70055));
        this.coeur.push(this.add.image(70, 20, 'coeur').setOrigin(0, 0).setDepth(5).setTint(0xf70055));
        this.coeur.push(this.add.image(120, 20, 'coeur').setOrigin(0, 0).setDepth(5).setTint(0xf70055));

        pauseButton.on('pointerdown', () => {

        });
        pauseButton.on('pointerover', () => {
            pauseButton.setTint(0x0097ff);
        });
        pauseButton.on('pointerout', () => {
            pauseButton.clearTint();
        });

        // Musique
        this.musique = this.sound.add('musique1', {
            loop: true,
            volume: 0.5
        });
        this.musique!.play();

        this.cursors = this.input.keyboard!.createCursorKeys();

        this.voitures = this.physics.add.group({
            classType: Car,
            runChildUpdate: true
        });

        this.itemsVies = this.physics.add.group({
            classType: Vie,
            runChildUpdate: true
        });

        this.time.addEvent({
            delay: 1500,
            callback: this.spawnCar,
            callbackScope: this,
            loop: true
        });

        this.time.addEvent({
            delay: 10000,
            callback: this.spawnVie,
            callbackScope: this,
            loop: true
        });

        this.voituresCollider = this.physics.add.collider(this.voiture_joueur, this.voitures, this.handleCollision, undefined, this);
        this.physics.add.collider(this.voiturePolice, this.voitures, undefined, undefined, this);
        this.physics.add.collider(this.voiture_joueur, this.voiturePolice, this.handleCollisionPolice, undefined, this);
        this.physics.add.collider(this.voitures, this.voitures, undefined, undefined, this);

        this.physics.add.collider(this.voiture_joueur, this.itemsVies, this.handleCollectionVies, undefined, this);
    }

    handleCollision(voitureJoueur:any, autreVoiture:any) {
        voitureJoueur.setTint(0xff0000)
        this.physics.world.removeCollider(this.voituresCollider!)
        this.vies--
        this.vitesse = 60
        this.time.delayedCall(2000, () => {
            voitureJoueur.clearTint()
            this.flashCar(voitureJoueur)
        });
        this.time.delayedCall(5000, () => {
            this.voituresCollider = this.physics.add.collider(this.voiture_joueur!, this.voitures!, this.handleCollision, undefined, this);
        });
    }

    handleCollisionPolice(voiture1:any , voiture2: any) {
        this.gameOver("La police vous a attrape")
    }

    handleCollectionVies(voiture:any , vie: any) {
        vie.destroy()
        this.vies++
        if(this.vies > 3){
            this.vies = 3
        }
    }

    spawnCar() {
        if (this.voitures!.getChildren().length < Math.floor(Phaser.Math.Clamp(this.vitesse/220, 0, 1) * 20 + 10)) {
            const x = Constants.carLanes[Phaser.Math.Between(0, 3)];
            const y = Constants.carSpawns[Phaser.Math.Between(0, 1)];
            const voiture = this.voitures!.get(x, y) as Car;
        }
    }

    spawnVie() {
        if (this.itemsVies!.getChildren().length < 1) {
            const x = Constants.carLanes[Phaser.Math.Between(0, 3)];
            const y = -150;
            const vie = this.itemsVies!.get(x, y) as Vie;
        }
    }

    flashCar(car:any) {
        this.tweens.add({
            targets: car,
            alpha: 0.2,
            ease: 'Linear',
            duration: 100,
            repeat: 15,
            yoyo: true,
            onComplete: () => {
                car.clearTint();
                car.alpha = 1;
            }
        });
    }

    gameOver(raison: string) {
        this.musique!.destroy()
        this.scene.pause('GameScene');
        this.scene.launch('GameOverScene', { score: this.score, raison: raison});
    }

    override update(time: number, delta: number) {

        this.score = Math.floor(time/1000)

        if(this.vies>0){
            this.coeur[0].setTint(0xf70055)
            if(this.vies>0){
                this.coeur[0].setTint(0xf70055)
                if(this.vies>1){
                    this.coeur[1].setTint(0xf70055)
                    if(this.vies>2){
                        this.coeur[2].setTint(0xf70055)
                    } else {
                        this.coeur[2].clearTint()
                    }
                } else {
                    this.coeur[1].clearTint()
                }
            } else {
                this.coeur[0].clearTint()
            }
        } else {
            this.coeur[0].clearTint()
            this.gameOver("Vous avez perdu toutes vos vies")
        }


        // Distance entre police et joueur et detection de l'activite policiere
        this.distancePoliceJoueur = Math.abs(Math.round(this.voiturePolice!.y - this.voiture_joueur!.y))
        if(this.distancePoliceJoueur < 400){
            this.policeActive = true
        } else {
            this.policeActive = false
        }

        // Entamer la poursuite en tout temps, controle selon la vitesse
        this.voiturePolice?.pursue(this.voiture_joueur!, this.voitures!, this.vitesse)

        // Acceleration et recul
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

        // Particule des pneus 
        this.voitureJoueurParticuleGauche!.setX(this.voiture_joueur!.x - 22)
        this.voitureJoueurParticuleDroite!.setX(this.voiture_joueur!.x + 22)
        this.voitureJoueurParticuleGauche!.setParticleLifespan(this.rpm * 5)
        this.voitureJoueurParticuleDroite!.setParticleLifespan(this.rpm * 5)

        // Virage gauche et droit (steering)
        if (this.cursors!.left.isDown && this.voiture_joueur!.x > 300) {
            this.voiture_joueur!.setVelocityX(-this.vitesse);
        } else if (this.cursors!.right.isDown && this.voiture_joueur!.x < 800) {
            this.voiture_joueur!.setVelocityX(this.vitesse);
        } else {
            if (this.voiture_joueur!.body!.velocity.x > 0) {
                this.voiture_joueur!.setVelocityX(Math.max(this.voiture_joueur!.body!.velocity.x - this.steeringFriction, 0));
            } else if (this.voiture_joueur!.body!.velocity.x < 0) {
                this.voiture_joueur!.setVelocityX(Math.min(this.voiture_joueur!.body!.velocity.x + this.steeringFriction, 0));
            }
        }

        // Chagement des gears
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

        // Changement de la position de la route pour simuler un avancement
        this.route!.tilePositionY -= this.vitesse * 0.05

        // Changement de la vitesse des autres voitures npc
        this.voitures!.getChildren().forEach((entry) => {
            const car = entry as Car;
            car.setSpeed(this.vitesse);
            if (car.y > 1000 || car.y < -200) {
                car.destroy();
            }
        });

        // Changement de la vitesse des autres voitures npc
        this.itemsVies!.getChildren().forEach((entry) => {
            const vie = entry as Vie;
            vie.setSpeed(this.vitesse);
            if(vie.y > 900){
                vie.destroy()
            }
        });

        // Mettre les effet de la police
        if(this.policeActive == true){
            this.lumierePolice!.setVisible(true)
            this.gpsPoliceWindow!.setVisible(true)
            this.gpsPoliceWindowText!.setVisible(true)
            this.gpsPoliceWindowText!.setText(this.distancePoliceJoueur + " m")


            if (this.tempsDepuisFlash > 2) {
                if (this.lumierePolice!.texture.key == "police_lights_1") {
                    this.lumierePolice!.setTexture("police_lights_2")
                } else {
                    this.lumierePolice!.setTexture("police_lights_1")
                }
                this.tempsDepuisFlash = 0
            } else {
                this.tempsDepuisFlash += delta / 100
            }
        } else {
            this.lumierePolice!.setVisible(false)
            this.gpsPoliceWindow!.setVisible(false)
            this.gpsPoliceWindowText!.setVisible(false)
        }

        // Aiguille de vitesse
        const maxSpeed = 220;
        const angle = (Phaser.Math.Clamp(Math.abs(this.vitesse) / maxSpeed, -1, 1) * (Math.PI * 1.2) + 9.02);
        this.aiguille_vitesse!.setRotation(angle)

        // Aiguille de RPM
        const maxRpm = 90;
        this.rpm = Math.floor(this.tempsAcceleration / 100);
        const angleRPM = (Phaser.Math.Clamp(this.rpm / maxRpm, -1, 1) * (Math.PI * 1.2) + 10.3);
        this.aiguille_rpm!.setRotation(angleRPM)
    }
}

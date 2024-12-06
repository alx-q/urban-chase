import { Car } from "./cars";

export class PoliceCar extends Phaser.Physics.Arcade.Sprite {
    vitesseBase: number;
    constructor(scene: Phaser.Scene, x: number, y: number) {
        super(scene, x, y, 'voiture_police');
        scene.add.existing(this);
        scene.physics.add.existing(this);
        this.setScale(0.5);
        this.vitesseBase = 20;
    }

    pursue(voitureJoueur: Phaser.Physics.Arcade.Image, obstacles: Phaser.Physics.Arcade.Group, vitesseJoueur: number) {
        // Calculer la distance et la direction
        const dx = voitureJoueur.x - this.x;
        const dy = voitureJoueur.y - this.y + 100;
        const distance = Math.sqrt(dx * dx + dy * dy);

        // Calculer les vitesses
        const speedX = (dx / distance) * this.vitesseBase;
        const speedY = (dy / distance) * Phaser.Math.Between(8, 18) - (vitesseJoueur * 0.05) - this.vitesseBase;

        this.setVelocityX(speedX);
        this.setVelocityY(speedY);

        if (this.x < 300){
            this.setX(300)
        }

        if (this.x > 700){
            this.setX(700)
        }
    
        /*obstacles.getChildren().forEach((obstacle) => {
            if (this.scene.physics.overlap(this, obstacle)) {
                const car = obstacle as Car;
                if (this.x < car.x) {
                    this.setVelocityX(-100);
                } else {
                    this.setVelocityX(100);
                }
            }
        });*/
    }
}
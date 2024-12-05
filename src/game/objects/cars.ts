export class Car extends Phaser.Physics.Arcade.Sprite {
    vitesseBase: number;
    constructor(scene: any, x: any, y: any) {
        super(scene, x, y, 'maxima');
        scene.add.existing(this);
        scene.physics.add.existing(this);
        this.setScale(0.32)
        this.vitesseBase = 240;
    }

    setSpeed(playerSpeed: number) {
        if (playerSpeed < -1) {
            this.setVelocityY(-this.vitesseBase + (playerSpeed * 4));
        } else if (playerSpeed > 1) {
            this.setVelocityY(-this.vitesseBase + (playerSpeed * 4));
        } else {
            this.setVelocityY(-this.vitesseBase);
        }
    }
}
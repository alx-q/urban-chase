import { Constants } from "../constants";

export class Car extends Phaser.Physics.Arcade.Sprite {
    vitesseBase: number;
    constructor(scene: any, x: any, y: any) {
        let model = Constants.carModels[Phaser.Math.Between(0, Constants.carModels.length - 1)]

        super(scene, x, y, model);
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
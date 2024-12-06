export class Vie extends Phaser.Physics.Arcade.Sprite {
    constructor(scene: any, x: any, y: any) {
        super(scene, x, y, 'coeur');
        scene.add.existing(this);
        scene.physics.add.existing(this);
    }

    setSpeed(playerSpeed: number) {
        this.setVelocityY(playerSpeed);
    }
}
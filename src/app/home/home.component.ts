import { Component } from '@angular/core';
import { MenuScene } from '../../game/scenes/menu';
import { GameScene } from '../../game/scenes/game';
@Component({
  selector: 'app-home',
  standalone: true,
  imports: [],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {
  game: Phaser.Game | undefined;

  ngOnInit(){
    const config: Phaser.Types.Core.GameConfig = {
      type: Phaser.AUTO,
      width: 1200,
      height: 800,
      physics: {
        default: 'arcade',
        arcade: {
          debug: false
        }
      },
      scene: [
        MenuScene,
        GameScene
      ]
    };

    this.game = new Phaser.Game(config);
  }
}

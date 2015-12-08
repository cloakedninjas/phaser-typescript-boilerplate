module Namespace.State {
    export class Game extends Phaser.State {
        create() {
            var img = this.add.sprite(this.game.world.centerX, this.game.world.centerY, 'phaser-logo');
            img.anchor.x = 0.5;
            img.anchor.y = 0.5;
        }
    }
}

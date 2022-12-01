import Phaser from "phaser";
import "phaser/plugins/spine/dist/SpinePlugin";
import GameScene from "./Scenes/GameScene";

declare global {
  interface Window {
    SpinePlugin: typeof SpinePlugin;
  }
}

export default class Game extends Phaser.Game {
  static readonly WIDTH = 1320;
  static readonly HEIGHT = 688;
  static readonly WAIT_TIME = 3;

  constructor(parent: HTMLDivElement) {
    super({
      scale: {
        parent,
        width: Game.WIDTH,
        height: Game.HEIGHT,
        mode: Phaser.Scale.FIT,
      },
      disableContextMenu: true,
      transparent: true,
      dom: {
        createContainer: true,
      },
      banner: {
        hidePhaser: true,
      },
      scene: [GameScene],
      plugins: {
        scene: [
          { key: "SpinePlugin", plugin: window.SpinePlugin, mapping: "spine" },
        ],
      },
    });
  }

  playAudio(name: string, config?: Phaser.Types.Sound.SoundConfig) {
    this.scene.getScene("GameScene")!.sound.play(name, config);
  }
}

import Game from "@pages/Game/Game";

export enum CharacterAnimation {
  Attack = "ATTACK",
  Celebrate = "CELEBRATE",
  Defend = "DEFEND",
  Die = "DIE",
  Hit = "HIT",
  Idle = "IDLE",
  SuperAttack = "SUPER_ATTACK",
}

//@ts-expect-error
const _SpineGameObject = SpinePlugin.SpineGameObject as typeof SpineGameObject;
export default class Character extends _SpineGameObject {
  private static readonly TARGET_HEIGHT = 320;

  constructor(
    scene: Phaser.Scene,
    spineKey: string,
    readonly side: "left" | "right"
  ) {
    super(
      scene,
      //@ts-ignore
      scene.spine,
      0,
      0,
      spineKey,
      CharacterAnimation.Idle,
      true
    );

    this.addToScene().handleSize();

    /**
     * Create mixes between all animations
     */
    const animations = this.getAnimationList() as CharacterAnimation[];
    for (let i = 0; i < animations.length; i++)
      for (let j = 0; j < animations.length; j++)
        if (i !== j) this.setMix(animations[i], animations[j], 0.2);
  }

  play(
    animationName: CharacterAnimation,
    loop: boolean = false,
    ignoreIfPlaying: boolean = false
  ) {
    super.play(animationName, loop, ignoreIfPlaying);
    return this;
  }

  chain(animationName: CharacterAnimation, loop: boolean = false) {
    return this.addAnimation(0, animationName, loop);
  }

  getAnimationDuration(animationName?: CharacterAnimation) {
    return animationName
      ? this.findAnimation(animationName).duration
      : this.getCurrentAnimation().duration;
  }

  /**
   * Update character's dimensions
   */
  private handleSize = () => {
    const { width, height } = this.scene.renderer;
    /** Adjust position of characters */
    this.setX(width * (this.side == "left" ? 0.15 : 0.85)).setY(height * 0.75);
    /** Adjust size */
    const targetHeight = Character.TARGET_HEIGHT * (height / Game.HEIGHT);
    const scale = targetHeight / (this.getBounds().size.y / this.scaleY);
    this.setScale(this.side == "left" ? -scale : scale, scale);

    return this;
  };

  private addToScene(): this {
    //@ts-ignore
    return this.scene.add.existing(this);
  }
}

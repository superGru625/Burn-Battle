/* @refresh reload */
import { render } from "solid-js/web";
import { JSX } from "solid-js/web/types/jsx";

export default abstract class UIComponent extends Phaser.GameObjects
  .DOMElement {
  constructor(
    scene: Phaser.Scene,
    x: number,
    y: number,
    autoMount: boolean = true
  ) {
    super(scene, x, y, document.createElement("div"));

    this.addToScene();

    /**
     * Render UI
     */
    if (autoMount) {
      this.mount();
    }

    /**
     * Handle Resize
     */
    this.scene.scale.on(
      Phaser.Scale.Events.RESIZE,
      this.handleResize.bind(this)
    );
  }

  abstract render(): JSX.Element;

  protected handleResize() {
    this.updateSize().updateDisplayOrigin();
  }

  mount() {
    render(this.render.bind(this), this.node);
    return this.updateSize();
  }

  private addToScene() {
    return this.scene.add.existing(this);
  }

  setAnimatedAlpha(value: number) {
    return new Promise((onComplete) =>
      this.scene.add.tween({
        targets: this,
        alpha: value,
        duration: 100,
        onComplete,
      })
    );
  }

  hide(withAnimation: boolean = true) {
    if (withAnimation) this.setAnimatedAlpha(0);
    else this.setAlpha(0);

    return this;
  }
}

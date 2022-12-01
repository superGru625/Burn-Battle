import Icon from "@components/Icon";
import { Accessor, createSignal, Match, Switch } from "solid-js";
import { JSX } from "solid-js/jsx-runtime";
import { createStore } from "solid-js/store";
import Utils from "Utils";
import UIComponent from "../UIComponent";

import styles from "./style.module.scss";

export default class CountDownPopup extends UIComponent {
  constructor(scene: Phaser.Scene) {
    super(scene, scene.renderer.width / 2, scene.renderer.height / 2);

    this.setOrigin(0.5).setClassName(styles.mainContainer);
  }

  render(): JSX.Element {
    const [text, setText] = createSignal("");

    this.setText = setText;

    return (
      <div class={styles.background}>
        <div class={styles.text}>{text()}</div>
      </div>
    );
  }

  async countDown() {
    return new Promise<void>((onComplete) =>
      this.scene.tweens.addCounter({
        from: 0,
        to: 4,
        duration: 3000,
        completeDelay: 500,
        onStart: () => (
          this.setAnimatedAlpha(1), this.scene.sound.play("countdown")
        ),
        onUpdate: (tween) =>
          this.setText(["3", "2", "1", "FIGHT!"][Math.floor(tween.getValue())]),
        onComplete: () => (this.setAnimatedAlpha(0), onComplete()),
      })
    );
  }
}

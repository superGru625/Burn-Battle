import { createEffect, createSignal, Setter } from "solid-js";
import { JSX } from "solid-js/jsx-runtime";
import Utils from "Utils";
import UIComponent from "../UIComponent";
import styles from "./style.module.scss";

export default class ScorePopup extends UIComponent {
  private _setMessage!: Setter<string>;
  private _setScore!: Setter<number>;
  constructor(scene: Phaser.Scene) {
    super(scene, 100, 100);

    this.setOrigin(0.5).hide(false);
  }

  render(): JSX.Element {
    const [message, setMessage] = createSignal<string>("BLOCKS");
    const [score, setScore] = createSignal<number>(-3);

    this._setMessage = setMessage;
    this._setScore = setScore;

    /**
     * Update Gameobjects size when stuff change
     */
    createEffect(() => (message(), score(), this.handleResize()));

    return (
      <div
        class={Utils.mergeClassnames(
          styles.container,
          score() < 0 ? styles.red : styles.green
        )}
      >
        <div class={styles.score}>{score()}</div>
        <div class={styles.label}>{message()}</div>
      </div>
    );
  }

  popup(side: "left" | "right", score: number, message: string) {
    this.setX(this.scene.renderer.width * (side == "left" ? 0.15 : 0.85));
    this._setScore(score);
    this._setMessage(message);
    this.scene.add.tween({
      targets: this,
      y: {
        from: this.scene.renderer.height * 0.25,
        to: this.scene.renderer.height * 0.2,
      },
      alpha: { from: 1, to: 0 },
      duration: 400,
    });
  }
}

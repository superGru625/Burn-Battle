import { Accessor, createSignal, Index, Setter } from "solid-js";
import { JSX } from "solid-js/jsx-runtime";
import Utils from "Utils";
import UIComponent from "../UIComponent";

import styles from "./style.module.scss";

export default class Timer extends UIComponent {
  private time!: Accessor<number>;
  private setTime!: Setter<number>;
  private timeEvent?: Phaser.Time.TimerEvent;
  constructor(scene: Phaser.Scene) {
    super(scene, scene.renderer.width / 2, 32);

    this.setOrigin(0.5, 0);
  }

  render(): JSX.Element {
    const [time, setTime] = createSignal(0);

    this.time = time;
    this.setTime = setTime;

    return (
      <div class={styles.container}>
        <div class={styles.box}>
          <span>
            {Math.floor(time() / 60)
              .toString()
              .padStart(2, "0")}
          </span>
        </div>
        <div class={styles.colon}>:</div>
        <div class={styles.box}>
          <span>{(time() % 60).toString().padStart(2, "0")}</span>
        </div>
      </div>
    );
  }

  fade(direction: "in" | "out" = "out") {
    this.scene.add.tween({
      targets: this,
      alpha: direction == "out" ? 0 : 1,
      duration: 300,
    });
    return this;
  }

  start() {
    this.timeEvent?.destroy();
    this.timeEvent = this.scene.time.addEvent({
      delay: 1000,
      loop: true,
      callback: () => this.setTime(this.time() + 1),
    });
    return this;
  }
}

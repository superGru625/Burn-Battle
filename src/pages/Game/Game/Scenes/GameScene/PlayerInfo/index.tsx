import GradientIconButton from "@components/GradientIconButton";
import HealthBar from "@components/HealthBar";
import { Accessor, createSignal, Index, Setter } from "solid-js";
import { JSX } from "solid-js/jsx-runtime";
import Utils from "Utils";
import UIComponent from "../UIComponent";

import styles from "./style.module.scss";

export default class PlayerInfo extends UIComponent {
  private _setHealth!: Setter<number>;
  private _setRounds!: Setter<boolean[]>;

  constructor(
    scene: Phaser.Scene,
    public side: "right" | "left",
    public name: string,
    public walletAddress: string,
    public maxHealth: number = 8
  ) {
    super(scene, 0, 0, false);

    if (this.side == "left") this.setOrigin(0, 0).setPosition(32, 32);
    else this.setOrigin(1, 0).setPosition(this.scene.renderer.width - 32, 32);

    this.mount();
  }

  render(): JSX.Element {
    const [health, setHealth] = createSignal(this.maxHealth);

    /**
     * Array of boolean values corresponding if player has won that specific round
     */
    const [rounds, setRounds] = createSignal<boolean[]>(Array(3).fill(false));

    this._setHealth = setHealth;
    this._setRounds = setRounds;

    return (
      <div class={Utils.mergeClassnames(styles.container, styles[this.side])}>
        <GradientIconButton class={styles.icon} icon="heart" />
        <div class={styles.subContainer}>
          <div
            class={Utils.mergeClassnames(
              styles.titleContainer,
              this.side == "right" && styles.reversed
            )}
          >
            <div class={styles.name}>{this.name}</div>
            <div class={styles.walletAddress}>{`(${this.walletAddress.slice(
              0,
              15
            )}...)`}</div>
          </div>
          <HealthBar total={this.maxHealth} active={health()} />
          <div class={styles.roundsContainer}>
            <Index each={rounds()}>
              {(isWon) => (
                <div
                  class={Utils.mergeClassnames(
                    styles.round,
                    isWon() && styles.won
                  )}
                />
              )}
            </Index>
          </div>
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

  setHealth(value: number) {
    this._setHealth(value);
    return this;
  }

  setRounds(rounds: boolean[]) {
    this._setRounds(rounds);
    return this;
  }
}

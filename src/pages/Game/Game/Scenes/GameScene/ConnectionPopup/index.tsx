import Icon from "@components/Icon";
import { Accessor, createSignal, Match, Switch } from "solid-js";
import { JSX } from "solid-js/jsx-runtime";
import { createStore } from "solid-js/store";
import Utils from "Utils";
import UIComponent from "../UIComponent";

import styles from "./style.module.scss";

export default class ConnectionPopup extends UIComponent {
  private _ready!: {
    user: boolean;
    opponent: boolean;
  };
  constructor(scene: Phaser.Scene) {
    super(scene, scene.renderer.width / 2, scene.renderer.height / 2);

    this.setOrigin(0.5).setClassName(styles.mainContainer);
  }

  render(): JSX.Element {
    const [ready, setReady] = createStore({ user: false, opponent: true });

    this._ready = ready;

    return (
      <div class={styles.background}>
        <div class={styles.container}>
          <Switch
            fallback={<div class={styles.title}>welcome to burn battle!</div>}
          >
            <Match when={ready.user}>
              <div class={styles.title}>you are ready!</div>
              <div class={styles.subTitle}>
                waiting for your opponent to be ready
              </div>
            </Match>
            <Match when={ready.opponent}>
              <div class={styles.title}>opponent is ready to play!</div>
              <div class={styles.subTitle}>
                Opponent is ready to play, click “Yes” to start the game
              </div>
            </Match>
          </Switch>
          <div class={styles.cardsContainer}>
            <div
              class={Utils.mergeClassnames(
                styles.card,
                ready.user && styles.ready
              )}
            >
              <div
                class={styles.cardCharacterThumbnail}
                style={{
                  "background-image": "url('characterThumbnails/1.png')",
                }}
              />
              <div class={styles.cardTitle}>your wallet</div>
              <div class={styles.cardWalletAddress}>jansjdnaoiasdqowineoin</div>
            </div>
            <div class={styles.vs}>VS</div>
            <div
              class={Utils.mergeClassnames(
                styles.card,
                ready.opponent && styles.ready
              )}
            >
              <div
                class={styles.cardCharacterThumbnail}
                style={{
                  "background-image": "url('characterThumbnails/2.png')",
                }}
              />
              <div class={styles.cardTitle}>enemy wallet</div>
              <div class={styles.cardWalletAddress}>oiinaosndoasdononasd</div>
            </div>
          </div>
          <div class={styles.readyContainer}>
            <div class={styles.question}>are you ready?</div>
            <div
              class={Utils.mergeClassnames(styles.button, styles.yes)}
              onPointerDown={() => (setReady("user", true), this.emit("ready"))}
            >
              <Icon class={styles.icon} type="check" />
              yes
            </div>
            <div class={Utils.mergeClassnames(styles.button, styles.no)}>
              <Icon class={styles.icon} type="x" />
              no
            </div>
          </div>
        </div>
      </div>
    );
  }

  get userReady() {
    return this._ready.user;
  }

  get opponentReady() {
    return this._ready.opponent;
  }
}

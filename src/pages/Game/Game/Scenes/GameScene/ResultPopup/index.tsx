import Icon from "@components/Icon";
import { createSignal, Match, Switch } from "solid-js";
import { JSX } from "solid-js/jsx-runtime";
import Utils from "Utils";
import UIComponent from "../UIComponent";

import styles from "./style.module.scss";

type Mode = "Victory" | "Defeat";

export default class ResultPopup extends UIComponent {
  private _setMode: any;
  constructor(scene: Phaser.Scene) {
    super(scene, scene.renderer.width / 2, scene.renderer.height / 2);

    this.setOrigin(0.5, 0.5).setClassName(styles.mainContainer);
  }

  render(): JSX.Element {
    const [mode, setMode] = createSignal<Mode>("Victory");

    this._setMode = setMode;

    return (
      <div class={styles.background}>
        <div
          class={Utils.mergeClassnames(
            styles.container,
            mode() == "Victory" ? styles.victory : styles.defeat
          )}
        >
          <Switch>
            <Match when={mode() == "Victory"}>
              <img src="stars.svg" draggable={false} />
            </Match>
            <Match when={mode() == "Defeat"}>
              <Icon type="fire" class={styles.centralIcon} />
            </Match>
          </Switch>
          <div class={styles.title}>
            {mode() == "Victory" ? "VICTORY" : "DEFEAT"}
          </div>
          <div class={styles.subTitle}>
            {mode() == "Victory"
              ? `THE MISSION ACCOMPLISHED!\nTRY TO DEFEAT NEXY PERSON.`
              : `THE MISSION FAILED.\nTAKE COURAGE AND TRY AGAIN.`}
          </div>
          <div class={styles.infoContainer}>
            <div class={styles.infoTitle}>GET ITEMS:</div>
            <div class={styles.infoSubContainer}>
              <Icon class={styles.itemIcon} type="infinity" />
              <div class={styles.itemTitle}>10</div>
              <div class={styles.verticalDivider} />
              <Icon class={styles.itemIcon} type="fire" />
              <div class={styles.itemTitle}>500</div>
            </div>
          </div>

          <div
            class={styles.continueButton}
            onPointerDown={() => this.emit("continue")}
          >
            <Icon type="turnOff" class={styles.buttonIcon} />
            <div class={styles.buttonTitle}>CONTINUE</div>
          </div>
        </div>
      </div>
    );
  }

  async show(mode: Mode) {
    this._setMode(mode);
    this.setAnimatedAlpha(1);
    await new Promise<void>((callback) => this.once("continue", callback));
    this.setAnimatedAlpha(0);
  }
}

import Icon from "@components/Icon";
import { batch, createEffect, createSignal, Index, Setter } from "solid-js";
import { JSX } from "solid-js/jsx-runtime";
import { createStore, SetStoreFunction } from "solid-js/store";
import Utils from "Utils";
import { Item } from "..";
import UIComponent from "../UIComponent";

import styles from "./style.module.scss";

export interface Info {
  userItems: Item[];
  userNumber: number;
  damage: number;
  opponentItems: Item[];
  opponentNumber: number;
}

export default class InfoBar extends UIComponent {
  private setAlert!: Setter<boolean>;
  private setInfo!: SetStoreFunction<Info>;
  constructor(scene: Phaser.Scene) {
    super(scene, scene.renderer.width / 2, scene.renderer.height);

    this.setOrigin(0.5, 0.5);
  }

  render(): JSX.Element {
    const [info, setInfo] = createStore<Info>({
      userItems: [],
      userNumber: 0,
      damage: 0,
      opponentItems: [],
      opponentNumber: 0,
    });
    this.setInfo = setInfo;

    const [alert, setAlert] = createSignal(false);
    this.setAlert = setAlert;

    /**
     * Update size of UI object on every state change to correctly position on canvas
     */
    //@ts-ignore
    createEffect(() => (info, this.handleResize()));

    return (
      <div
        class={Utils.mergeClassnames(styles.container, alert() && styles.alert)}
      >
        <div class={styles.subContainer}>
          <div class={styles.text}>ITEMS</div>
          <Index
            each={info.userItems.length == 0 ? [undefined] : info.userItems}
          >
            {(item) => (
              <div class={styles.gradientBox}>
                <Icon class={styles.icon} type={item()} />
              </div>
            )}
          </Index>
        </div>
        <div class={styles.subContainer}>
          <div class={styles.text}>YOUR N</div>
          <div class={Utils.mergeClassnames(styles.gradientBox, styles.golden)}>
            <div class={styles.text}>{info.userNumber}</div>
          </div>
        </div>
        <div class={styles.verticalDivider} />
        <div class={styles.title}>
          {alert()
            ? `ENEMY DEALT ${info.damage}`
            : `YOU DEALT ${info.damage} DAMAGE`}
        </div>
        <div class={styles.verticalDivider} />
        <div class={styles.subContainer}>
          <div class={Utils.mergeClassnames(styles.gradientBox, styles.golden)}>
            <div class={styles.text}>{info.opponentNumber}</div>
          </div>
          <div class={styles.text}>ENEMY N</div>
        </div>
        <div class={styles.subContainer}>
          <Index
            each={
              info.opponentItems.length == 0 ? [undefined] : info.opponentItems
            }
          >
            {(item) => (
              <div class={styles.gradientBox}>
                <Icon class={styles.icon} type={item()} />
              </div>
            )}
          </Index>
          <div class={styles.text}>ITEMS</div>
        </div>
      </div>
    );
  }

  async show(info: Info, alert: boolean = false) {
    this.setAnimatedAlpha(1);
    batch(() => {
      this.setInfo(info);
      this.setAlert(alert);
    });
  }
}

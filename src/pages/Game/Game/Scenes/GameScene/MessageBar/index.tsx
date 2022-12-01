import { createSignal, Index, Setter } from "solid-js";
import { JSX } from "solid-js/jsx-runtime";
import Utils from "Utils";
import UIComponent from "../UIComponent";

import styles from "./style.module.scss";

export default class MessageBar extends UIComponent {
  private _setText!: Setter<string>;
  private _setIcon!: Setter<"sword" | "shield">;
  private _setAlert!: Setter<boolean>;
  constructor(scene: Phaser.Scene) {
    super(scene, scene.renderer.width / 2, scene.renderer.height);

    this.setOrigin(0.5, 0.5);
  }

  render(): JSX.Element {
    const [icon, setIcon] = createSignal<"sword" | "shield">("sword");
    const [text, setText] = createSignal("YOUR TURN! ATTACK");
    const [alert, setAlert] = createSignal(false);

    this._setIcon = setIcon;
    this._setText = setText;
    this._setAlert = setAlert;

    return (
      <div
        class={Utils.mergeClassnames(styles.container, alert() && styles.alert)}
      >
        <div
          class={styles.icon}
          style={{ "background-image": `url('${icon()}.svg')` }}
        />
        <div class={styles.text}>{text()}</div>
      </div>
    );
  }

  show(icon: "sword" | "shield", text: string, alert: boolean) {
    this._setIcon(icon);
    this._setText(text);
    this._setAlert(alert);
    this.setAnimatedAlpha(1);
  }
}

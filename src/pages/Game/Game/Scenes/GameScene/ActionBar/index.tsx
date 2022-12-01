import { Accessor, createEffect, createSignal, Index, Setter } from "solid-js";
import { JSX } from "solid-js/jsx-runtime";
import Utils from "Utils";
import { ActionMode, Item } from "..";
import UIComponent from "../UIComponent";
import ItemContainer from "./ItemContainer";

import styles from "./style.module.scss";

const numbers = Utils.numberArray(1, 9);

export default class ActionBar extends UIComponent {
  private _setMode!: Setter<ActionMode>;
  private _selectedNumber!: Accessor<number | undefined>;
  private _setSelectedNumber!: Setter<number | undefined>;
  private _disabledItems!: Accessor<Set<Item>>;
  private _setDisabledItems!: Setter<Set<Item>>;
  private _selectedItems!: Accessor<Set<Item>>;
  private _setSelectedItems!: Setter<Set<Item>>;
  private _setEnabled!: Setter<boolean>;
  private _setNumbersHidden!: Setter<boolean[]>;

  constructor(scene: Phaser.Scene) {
    super(
      scene,
      scene.renderer.width / 2,
      scene.renderer.height + 3 * 16,
      false
    );

    this.setOrigin(0.5, 0).mount();

    /**
     * Add keyboard listeners
     */
    this.scene.input.keyboard.on(
      Phaser.Input.Keyboard.Events.ANY_KEY_UP,
      (event: KeyboardEvent) => {
        switch (event.code) {
          case "KeyA":
            this.selectItem("shield");
            break;
          case "KeyS":
            this.selectItem("eye");
            break;
          case "KeyD":
            this.selectItem("x2");
            break;

          case "Digit1":
          case "Digit2":
          case "Digit3":
          case "Digit4":
          case "Digit5":
          case "Digit6":
          case "Digit7":
          case "Digit8":
          case "Digit9":
            this.setSelectedNumber(parseInt(event.code.at(-1)!));
            break;
        }
      }
    );
  }

  render(): JSX.Element {
    const [mode, setMode] = createSignal<ActionMode>("attack");
    const [selectedNumber, setSelectedNumber] = createSignal<
      number | undefined
    >();
    const [disabledItems, setDisabledItems] = createSignal<Set<Item>>(
      new Set()
    );
    const [selectedItems, setSelectedItems] = createSignal<Set<Item>>(
      new Set(),
      { equals: false }
    );
    const [enabled, setEnabled] = createSignal<boolean>(false);
    const [numbersHidden, setNumbersHidden] = createSignal<boolean[]>(
      Array(9).fill(false)
    );

    this._setMode = setMode;
    this._selectedNumber = selectedNumber;
    this._setSelectedNumber = setSelectedNumber;
    this._disabledItems = disabledItems;
    this._setDisabledItems = setDisabledItems;
    this._selectedItems = selectedItems;
    this._setSelectedItems = setSelectedItems;
    this._setNumbersHidden = setNumbersHidden;

    this._setEnabled = setEnabled;

    return (
      <div
        class={Utils.mergeClassnames(
          styles.container,
          enabled() && styles.enabled
        )}
      >
        <div class={styles.title}>
          SELECT
          <br />
          NUMBER
        </div>
        <Index each={numbers}>
          {(number) => (
            <div
              classList={{
                [styles.button]: true,
                [styles.selected]: number() == selectedNumber(),
                [styles.hidden]: numbersHidden()[number()],
              }}
              onPointerDown={() => this.setSelectedNumber(number())}
            >
              <span> {number()}</span>
            </div>
          )}
        </Index>
        <div class={styles.verticalDivider} />
        <ItemContainer
          key="A"
          title="TOTAL\nBLOCK"
          icon="shield"
          onClick={() => this.selectItem("shield")}
          selected={selectedItems().has("shield")}
          disabled={
            mode() !== "defense" ||
            disabledItems().has("shield") ||
            selectedItems().has("shield")
          }
        />
        <ItemContainer
          key="S"
          title="NUMBER\nVISION"
          icon="eye"
          onClick={() => this.selectItem("eye")}
          selected={selectedItems().has("eye")}
          disabled={
            mode() !== "defense" ||
            disabledItems().has("eye") ||
            selectedItems().has("eye")
          }
        />
        <ItemContainer
          key="D"
          title="DOUBLE\nATTACK"
          icon="x2"
          onClick={() => this.selectItem("x2")}
          selected={selectedItems().has("x2")}
          disabled={
            mode() !== "attack" ||
            disabledItems().has("x2") ||
            selectedItems().has("x2")
          }
        />
      </div>
    );
  }

  setMode(mode: ActionMode) {
    this._setMode(mode);
    return this;
  }

  setDisabledItems(items: Item[] | Set<Item>) {
    this._setDisabledItems(new Set(items));
    return this;
  }

  clearDisabledItems() {
    this._setDisabledItems(new Set<Item>());
    return this;
  }

  get disabledItems() {
    return this._disabledItems();
  }

  setSelectedNumber(value: number) {
    this._setSelectedNumber(value);
    this.scene.sound.play("number_select");
    this.emit("numerSelected", value);
    return this;
  }

  get selectedNumber() {
    return this._selectedNumber();
  }

  selectItem(item: Item) {
    if (item == "eye") this.setEyeModeEnabled(true);
    this.scene.sound.play(`${item}_select`);
    this._setSelectedItems((selectedItems) => selectedItems.add(item));
    return this;
  }

  get selectedItems() {
    return this._selectedItems();
  }

  private setEyeModeEnabled(value: boolean) {
    if (value) {
      /**
       * Generate random numbers visibility array where half of numbers are hidden except enemy selected one
       */
      const arr = Array(9).fill(false);
      while (Utils.count(arr) <= 4)
        for (let i = 0; i < 9; i++)
          if (!arr[i])
            arr[i] =
              numbers[i] !== this.enemySelectedNumber && Math.random() < 0.5;
      this._setNumbersHidden(arr);
    } else this._setNumbersHidden(Array(9).fill(false));
  }

  enemySelectedNumber?: number;
  setEnemySelectedNumber(value: number | undefined) {
    this.enemySelectedNumber = value;
    return this;
  }

  /**
   * Sets selected number and selectedItems to default
   */
  reset() {
    this._setSelectedItems(new Set<Item>());
    this._setSelectedNumber(undefined);
    this.setEyeModeEnabled(false);
    this.setEnemySelectedNumber(undefined);
    return this;
  }

  /**
   * Waits for input
   *
   * before running this method, you should configure actionBar using .setMode; .setDisabledItems and setEnemySelectedNumber
   */
  async waitForInput() {
    /**
     * Enable action bar
     */
    this._setEnabled(true);

    const selectedNumber: number = await new Promise((callback) =>
      this.once("numerSelected", callback)
    );

    const selectedItems = new Set(this.selectedItems);

    /**
     * Clear selected Items
     */
    this.selectedItems.clear();

    /**
     * Disabled again
     */
    this._setEnabled(false);

    return { selectedNumber, selectedItems };
  }
}

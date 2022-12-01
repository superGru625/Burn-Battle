import Utils from "Utils";
import { JSX } from "solid-js";
import styles from "./style.module.scss";

interface Props {
  label: JSX.Element;
  content: JSX.Element;
  class?: string;
  ref?: HTMLDivElement;
  onPointerDown?(): void;
  onPointerOver?(): void;
  onPointerOut?(): void;
  /**
   * Color presets
   *
   * if you want custom color apply scss mixin - `utils.gradientBackground`
   */
  color?: "golden" | "grey";
}

export default function SplitGradientBar(props: Props) {
  return (
    <div
      class={Utils.mergeClassnames(
        styles.background,
        props.class,
        styles[props.color || "golden"]
      )}
      onPointerDown={props.onPointerDown}
      onPointerOver={props.onPointerOver}
      onPointerOut={props.onPointerOut}
    >
      <div class={styles.leftSection}>{props.label}</div>
      <div class={styles.rightSection}>{props.content}</div>
    </div>
  );
}

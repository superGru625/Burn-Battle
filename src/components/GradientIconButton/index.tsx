import Icon, { IconType } from "@components/Icon";
import Utils from "Utils";
import styles from "./style.module.scss";

interface Props {
  icon: IconType;
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

export default function GradientIconButton(props: Props) {
  return (
    <div
      class={Utils.mergeClassnames(
        styles.background,
        styles[props.color || "golden"],
        props.class
      )}
      onPointerDown={props.onPointerDown}
      onPointerOver={props.onPointerOver}
      onPointerOut={props.onPointerOut}
    >
      <Icon type={props.icon} />
    </div>
  );
}

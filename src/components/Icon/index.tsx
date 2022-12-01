import Utils from "Utils";
import styles from "./style.module.scss";

export type IconType =
  | "fire"
  | "fireCutOut"
  | "heart"
  | "infinity"
  | "lighting"
  | "menu"
  | "people"
  | "soundOff"
  | "soundOn"
  | "x2"
  | "turnOff"
  | "eye"
  | "shield"
  | "x"
  | "check";

interface Props {
  type?: IconType;
  class?: string;
  ref?: HTMLDivElement;
  size?: string;
}

export default function Icon(props: Props) {
  return (
    <div
      ref={props.ref}
      class={Utils.mergeClassnames(styles.icon, props.class)}
      style={{
        "background-image": `url('icons/${props.type || ""}.svg')`,
        "background-size": props.size || "1.5em",
      }}
    />
  );
}

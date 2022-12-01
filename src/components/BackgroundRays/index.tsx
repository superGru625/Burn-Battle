import Utils from "Utils";
import styles from "./style.module.scss";

interface Props {
  ref?: HTMLDivElement;
  class?: string;
}

export default function BackgroundRays(props: Props) {
  return (
    <div
      ref={props.ref}
      class={Utils.mergeClassnames(styles.background, props.class)}
    />
  );
}

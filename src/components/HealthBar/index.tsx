import { Index } from "solid-js";
import Utils from "Utils";
import styles from "./style.module.scss";

interface Props {
  total: number;
  active: number;
}

export default function HealthBar(props: Props) {
  return (
    <div class={styles.container}>
      <Index each={Utils.numberArray(0, props.total)}>
        {(_, index) => (
          <div
            class={Utils.mergeClassnames(styles.item)}
            style={{ opacity: index < props.active ? 1 : 0 }}
          ></div>
        )}
      </Index>
    </div>
  );
}

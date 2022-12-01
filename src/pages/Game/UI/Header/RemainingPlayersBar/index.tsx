import Icon from "@components/Icon";
import SplitGradientBar from "@components/SplitGradientBar";

import styles from "./style.module.scss";

export default function RemainingPlayersBar() {
  return (
    <SplitGradientBar
      label={
        <div class={styles.labelContainer}>
          <Icon class={styles.labelIcon} type="people" />
          <div class={styles.label}>Remaining\nPlayers</div>
        </div>
      }
      content={<span class={styles.amount}>10,000</span>}
      color="grey"
    />
  );
}

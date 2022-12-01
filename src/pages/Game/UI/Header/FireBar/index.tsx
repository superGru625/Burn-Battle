import Icon from "@components/Icon";
import SplitGradientBar from "@components/SplitGradientBar";

import styles from "./style.module.scss";

export default function FireBar() {
  return (
    <SplitGradientBar
      label={<Icon type="fireCutOut" />}
      content={<span class={styles.amount}>1,000,000</span>}
    />
  );
}

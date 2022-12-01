import Icon from "@components/Icon";
import SplitGradientBar from "@components/SplitGradientBar";

import styles from "./style.module.scss";

export default function InfinityBar() {
  return (
    <SplitGradientBar
      label={<Icon type="infinity" />}
      content={<span class={styles.amount}>150,000</span>}
      color="grey"
    />
  );
}

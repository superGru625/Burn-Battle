import GradientIconButton from "@components/GradientIconButton";
import Icon, { IconType } from "@components/Icon";
import Utils from "Utils";
import styles from "./style.module.scss";

interface Props {
  key: string;
  title: string;
  icon: IconType;
  onClick: () => void;
  disabled: boolean;
  selected: boolean;
}

export default function ItemContainer(props: Props) {
  return (
    <div
      class={Utils.mergeClassnames(
        styles.container,
        props.disabled && styles.disabled,
        props.selected && styles.selected
      )}
      onPointerDown={() => !props.disabled && props.onClick()}
    >
      <div class={styles.text}>{`(${props.key})`}</div>
      <div class={styles.iconContainer}>
        <Icon type={props.icon} />
      </div>
      <div class={styles.text}>{props.title}</div>
    </div>
  );
}

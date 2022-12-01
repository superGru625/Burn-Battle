import GradientIconButton from "@components/GradientIconButton";
import FireBar from "./FireBar";
import InfinityBar from "./InfinityBar";
import RemainingPlayersBar from "./RemainingPlayersBar";
import styles from "./style.module.scss";

interface Props {
  soundIcon: "soundOn" | "soundOff";
  onSoundButtonClick: () => void;
}

export default function Header(props: Props) {
  return (
    <div class={styles.container}>
      <div class={styles.leftButtons}>
        <FireBar />
        <InfinityBar />
      </div>
      <div class={styles.rightButtons}>
        <RemainingPlayersBar />
        <GradientIconButton
          icon={props.soundIcon}
          onPointerDown={props.onSoundButtonClick}
        />
        <GradientIconButton icon="menu" color="grey" />
      </div>
    </div>
  );
}

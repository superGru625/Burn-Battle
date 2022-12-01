import { createEffect, createSignal, onCleanup, onMount } from "solid-js";

import BackgroundRays from "@components/BackgroundRays";
import Logo from "@components/Logo";
import Game from "./Game";
import styles from "./style.module.scss";
import Header from "./UI/Header";

export default function GamePage() {
  let canvasContainer: HTMLDivElement;
  let game: Game;

  const [muted, setMuted] = createSignal<boolean>(false);

  /**
   * Create Phaser Game
   */
  onMount(() => {
    game = new Game(canvasContainer);
  });

  createEffect(() => (game.sound.mute = muted()));

  onCleanup(() => game.destroy(true, false));

  return (
    <>
      <BackgroundRays />
      <div class={styles.background}>
        <Logo />
        <div>
          <Header
            soundIcon={muted() ? "soundOff" : "soundOn"}
            onSoundButtonClick={() => setMuted((v) => !v)}
          />
          <div ref={canvasContainer!} class={styles.canvasContainer}></div>
        </div>
      </div>
    </>
  );
}

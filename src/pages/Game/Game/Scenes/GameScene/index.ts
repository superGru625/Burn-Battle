import Utils from "Utils";
import Sketch from "../..";
import ActionBar from "./ActionBar";
import Character, { CharacterAnimation } from "./Character";
import ConnectionPopup from "./ConnectionPopup";
import CountDownPopup from "./CountDownPopup";
import InfoBar from "./InfoBar";
import MessageBar from "./MessageBar";
import PlayerInfo from "./PlayerInfo";
import ResultPopup from "./ResultPopup";
import ScorePopup from "./ScorePopup";
import Timer from "./Timer";

export type ActionMode = "attack" | "defense";

export type Item = "shield" | "eye" | "x2";

export default class GameScene extends Phaser.Scene {
  static readonly MAX_HEALTH = 8;

  declare game: Sketch;

  userCharacter!: Character;
  opponentCharacter!: Character;

  background!: Phaser.GameObjects.Image;
  actionBar!: ActionBar;
  timer!: Timer;
  userInfo!: PlayerInfo;
  opponentInfo!: PlayerInfo;
  connectionPopup!: ConnectionPopup;
  countDownPopup!: CountDownPopup;
  messageBar!: MessageBar;
  infoBar!: InfoBar;
  scorePopup!: ScorePopup;
  resultPopup!: ResultPopup;

  userHealth = GameScene.MAX_HEALTH;
  opponentHealth = GameScene.MAX_HEALTH;

  userUsedItems = new Set<Item>();
  opponentUsedItems = new Set<Item>();

  roundResults: ("user" | "opponent")[] = [];

  constructor() {
    super("Game");
  }

  preload() {
    this.load.spine("17", "characters/17.json", "characters/17.atlas");
    this.load.spine("12", "characters/12.json", "characters/12.atlas");

    /** TEMPORARY */
    this.load.audio("attack", "audio/gameplay/attack.wav");
    this.load.audio("burn", "audio/gameplay/burn.wav");
    this.load.audio("defend", "audio/gameplay/defend.wav");
    this.load.audio("hit", "audio/gameplay/hit.wav");
    this.load.audio("background", "audio/gameplay/background.mp3");

    [
      "countdown",
      "eye_select",
      "menu_click",
      "number_select",
      "shield_select",
      "x2_select",
    ].forEach((key) => this.load.audio(key, `audio/ui/${key}.wav`));

    this.load.image(
      "background",
      `backgrounds/${Phaser.Math.RND.integerInRange(1, 4)}.jpg`
    );
  }

  async create() {
    /**
     * Play background audio
     */
    this.sound.play("background", { loop: true, volume: 0.5 });
    /**
     * Add backgorund
     */
    this.background = this.add
      .image(0, 0, "background")
      .setOrigin(0)
      .setDepth(-1)
      .setDisplaySize(this.renderer.width, this.renderer.height);

    /**
     * Add characters
     */
    this.userCharacter = new Character(this, "17", "left");
    this.opponentCharacter = new Character(this, "12", "right");

    /**
     * Create connection popup
     */
    this.connectionPopup = new ConnectionPopup(this);

    /**
     * Add Timer
     */
    this.timer = new Timer(this).hide(false);

    /**
     * Add Player Infos
     */
    this.userInfo = new PlayerInfo(
      this,
      "left",
      "CHARACTER NAME",
      "asdnonasdnalsndjnasd"
    ).hide(false);
    this.opponentInfo = new PlayerInfo(
      this,
      "right",
      "CHARACTER NAME",
      "asdnonasdnalsndjnasd"
    ).hide(false);

    /**
     * Add Action bar
     */
    this.actionBar = new ActionBar(this);
    this.actionBar.on("itemActivated", console.log);

    /**
     * Create countdown popup
     */
    this.countDownPopup = new CountDownPopup(this).hide(false);

    /**
     * Create message bar
     */
    this.messageBar = new MessageBar(this).hide(false);

    /**
     * Create info bar
     */
    this.infoBar = new InfoBar(this).hide(false);

    /**
     * Create Score Popup
     */
    this.scorePopup = new ScorePopup(this);

    /**
     * Create Result Popup
     */
    this.resultPopup = new ResultPopup(this).hide(false);

    /**
     * Start game once user clicks ready
     */
    this.connectionPopup.once("ready", async () => {
      /**
       *  Wait some time
       */
      await this.wait(0.5);
      /**
       * Open game screen
       */
      this.connectionPopup.hide();
      [this.userInfo, this.opponentInfo, this.timer].forEach((ui) =>
        ui.setAnimatedAlpha(1)
      );
      /**
       * Play
       */
      this.play(3);
    });
  }

  private round = 1;
  async play(rounds: number = 3) {
    /**
     * Countdown
     */
    await this.countDownPopup.countDown();

    /**
     * Save rounds results
     */
    this.roundResults = Array(rounds).fill(undefined);

    /**
     * Run round loop
     */
    roundLoop: for (this.round = 1; this.round <= rounds; this.round++) {
      /**
       * Reset everything before starting new round
       */
      this.resetRound();

      /**
       * Start timer
       */
      this.timer.start();

      /**
       * Run Game loop
       */
      gameLoop: while (true) {
        this.userCharacter.play(CharacterAnimation.Idle, true);
        this.opponentCharacter.play(CharacterAnimation.Idle, true);

        /**
         * When attacking
         */
        if (this.actionMode == "attack") {
          /**
           * Show Message
           */
          this.messageBar.show("sword", "YOUR TURN! ATTACK!", false);

          /**
           * Let user attack
           */
          const {
            selectedNumber: userSelectedNumber,
            selectedItems: userSelectedItems,
          } = await this.actionBar
            .setMode("attack")
            .setDisabledItems(this.userUsedItems)
            .waitForInput();
          Utils.addSet(this.userUsedItems, userSelectedItems);

          /**
           * Generate random data as opponent's chosen points
           */
          const [opponentSelectedNumber, opponentSelectedItems] =
            this.getOpponentsChoice("defense");
          Utils.addSet(this.opponentUsedItems, opponentSelectedItems);

          /**
           * Hide message
           */
          this.messageBar.hide();

          /**
           * Calculate damage
           */
          let damage = Math.abs(userSelectedNumber - opponentSelectedNumber);
          /** Multiply damage if x2 is activated */
          if (userSelectedItems.has("x2")) damage *= 2;
          /** Set damage to 0 if shield is selected */
          if (opponentSelectedItems.has("shield")) damage = 0;

          /**
           * Show Info
           */
          this.infoBar.show(
            {
              userItems: [...userSelectedItems],
              userNumber: userSelectedNumber,
              damage,
              opponentItems: [...opponentSelectedItems],
              opponentNumber: opponentSelectedNumber,
            },
            false
          );

          /**
           * Play attack and hit animations
           */
          this.userCharacter
            .play(
              damage > 4
                ? CharacterAnimation.SuperAttack
                : CharacterAnimation.Attack
            )
            .chain(CharacterAnimation.Idle, true);
          /** Draw attacker on top of victim */
          this.userCharacter.setDepth(1);
          this.opponentCharacter.setDepth(0);
          /** Play attack sound */
          this.sound.play("attack");
          await this.wait(this.userCharacter.getAnimationDuration() / 2);
          /** Show popup */
          this.scorePopup.popup(
            "right",
            damage,
            damage == 0 ? "BLOCK" : "ATTACK"
          );
          this.opponentCharacter
            .play(
              opponentSelectedItems.has("shield")
                ? CharacterAnimation.Defend
                : CharacterAnimation.Hit
            )
            .chain(CharacterAnimation.Idle, true);
          /** play hit or defend sound */
          this.sound.play(
            opponentSelectedItems.has("shield") ? "defend" : "hit"
          );

          /**
           * Update Health
           */
          this.opponentHealth = Phaser.Math.MinSub(
            this.opponentHealth,
            damage,
            0
          );
          this.opponentInfo.setHealth(this.opponentHealth);

          /**
           * Wait some time
           */
          await this.wait(1);

          /**
           * Hide info
           */
          this.infoBar.hide();

          /**
           * Check if opponent died
           */
          if (this.opponentHealth == 0) {
            this.userCharacter.play(CharacterAnimation.Celebrate, true);
            this.opponentCharacter.play(CharacterAnimation.Die);
            /** Play death sound */
            this.sound.play("burn");
            await this.resultPopup.show("Victory");
            this.setRoundWinner("user");
          }
        } else {
          /**
           * Show message
           */
          this.messageBar.show("shield", "YOUR TURN! DEFEND!", true);

          /**
           * Get opponent's random choice in attack mode
           */
          const [opponentSelectedNumber, opponentSelectedItems] =
            this.getOpponentsChoice("attack");
          Utils.addSet(this.opponentUsedItems, opponentSelectedItems);

          /**
           * Let user defend
           */
          const {
            selectedNumber: userSelectedNumber,
            selectedItems: userSelectedItems,
          } = await this.actionBar
            .setMode("defense")
            .setDisabledItems(this.userUsedItems)
            .setEnemySelectedNumber(opponentSelectedNumber)
            .waitForInput();
          Utils.addSet(this.userUsedItems, userSelectedItems);

          /**
           * Hide message
           */
          this.messageBar.hide();

          /** Wait some artifical time */
          await this.wait(1);

          /**
           * Calculate damage
           */
          let damage = Math.abs(userSelectedNumber - opponentSelectedNumber);
          /** Multiply damage if x2 is activated */
          if (opponentSelectedItems.has("x2")) damage *= 2;
          /** Set damage to 0 if shield is selected */
          if (userSelectedItems.has("shield")) damage = 0;

          /**
           * Show Info
           */
          this.infoBar.show(
            {
              userItems: [...userSelectedItems],
              userNumber: userSelectedNumber,
              damage,
              opponentItems: [...opponentSelectedItems],
              opponentNumber: opponentSelectedNumber,
            },
            true
          );

          /**
           * Play attack and hit animations
           */
          this.opponentCharacter
            .play(
              damage > 4
                ? CharacterAnimation.SuperAttack
                : CharacterAnimation.Attack
            )
            .chain(CharacterAnimation.Idle, true);
          this.opponentCharacter.setDepth(1);
          this.userCharacter.setDepth(0);
          /** Play attack sound */
          this.sound.play("attack");
          await this.wait(this.opponentCharacter.getAnimationDuration() / 2);

          /** Show popup */
          this.scorePopup.popup(
            "left",
            -damage,
            damage == 0 ? "BLOCK" : "DAMAGE"
          );
          this.userCharacter
            .play(
              userSelectedItems.has("shield")
                ? CharacterAnimation.Defend
                : CharacterAnimation.Hit
            )
            .chain(CharacterAnimation.Idle, true);
          /** play hit or defend sound */
          this.sound.play(
            opponentSelectedItems.has("shield") ? "defend" : "hit"
          );

          /**
           * Update Health
           */
          this.userHealth = Phaser.Math.MinSub(this.userHealth, damage, 0);
          this.userInfo.setHealth(this.userHealth);

          /**
           * Wait some time
           */
          await this.wait(1);

          /**
           * Hide info
           */
          this.infoBar.hide();

          /**
           * Check if player died
           */
          if (this.userHealth == 0) {
            this.opponentCharacter.play(CharacterAnimation.Celebrate, true);
            this.userCharacter.play(CharacterAnimation.Die);
            /** Play death sound */
            this.sound.play("burn");
            await this.resultPopup.show("Defeat");
            this.setRoundWinner("opponent");
          }
        }

        /**
         * Reset action bar
         */
        this.actionBar.reset();

        await this.wait(1);

        /**
         * Switch Mode
         */
        this.toggleActionMode();

        /**
         * Check if round is ended
         */
        if (this.userHealth == 0 || this.opponentHealth == 0) break gameLoop;
      }
    }
  }

  actionMode: ActionMode = "attack";
  setActionMode(value: ActionMode) {
    this.actionMode = value;
    return this;
  }

  toggleActionMode() {
    this.actionMode = this.actionMode == "attack" ? "defense" : "attack";
    return this;
  }

  getOpponentsChoice(
    mode: "attack" | "defense"
  ): [selectedNumber: number, selectedItems: Set<Item>] {
    return [
      Phaser.Math.RND.integerInRange(1, 9),
      Utils.diffSet(
        mode == "attack"
          ? Utils.randomSet(["x2"])
          : Utils.randomSet(["eye", "shield"]),
        this.opponentUsedItems
      ),
    ];
  }

  setRoundWinner(winner: "user" | "opponent") {
    this.roundResults[this.round - 1] = winner;
    this.userInfo.setRounds(this.roundResults.map((w) => w == "user"));
    this.opponentInfo.setRounds(this.roundResults.map((w) => w == "opponent"));
    return this;
  }

  resetRound() {
    this.userHealth = GameScene.MAX_HEALTH;
    this.userInfo.setHealth(this.userHealth);
    this.opponentHealth = GameScene.MAX_HEALTH;
    this.opponentInfo.setHealth(this.opponentHealth);

    this.userUsedItems = new Set<Item>();
    this.opponentUsedItems = new Set<Item>();
  }

  /**
   *
   * @param delay seconds
   */
  async wait(delay: number) {
    return new Promise<void>((onComplete) =>
      this.time.delayedCall(delay * 1000, onComplete)
    );
  }
}

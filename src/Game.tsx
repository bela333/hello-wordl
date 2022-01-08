import { useEffect, useMemo, useState } from "react";
import { Row, RowState } from "./Row";
import dictionary from "./dictionary.json";
import { Clue, clue } from "./clue";
import { Keyboard } from "./Keyboard";
import common from "./common.json";
import { dictionarySet, pick, resetRng, seed } from "./util";
import { names } from "./names";
import { Trans, useTranslation } from "react-i18next";

enum GameState {
  Playing,
  Won,
  Lost,
}

interface GameProps {
  maxGuesses: number;
  hidden: boolean;
}

const targets = common
  .slice(0, 20000) // adjust for max target freakiness
  .filter((word) => dictionarySet.has(word));

function randomTarget(wordLength: number) {
  const eligible = targets.filter((word) => word.length === wordLength);
  return pick(eligible);
}

function Game(props: GameProps) {
  const {t} = useTranslation();
  const [gameState, setGameState] = useState(GameState.Playing);
  const [guesses, setGuesses] = useState<string[]>([]);
  const [currentGuess, setCurrentGuess] = useState<string>("");
  const [wordLength, setWordLength] = useState(5);
  const [_hint, setHint] = useState<string|null>(null);
  //Make your first guess!
  const hint = useMemo(()=>_hint ?? t("defaultHint"), [_hint, t])
  const [target, setTarget] = useState(() => {
    resetRng();
    return randomTarget(wordLength);
  });
  const [gameNumber, setGameNumber] = useState(1);

  const startNextGame = () => {
    setTarget(randomTarget(wordLength));
    setGuesses([]);
    setCurrentGuess("");
    setHint("");
    setGameState(GameState.Playing);
    setGameNumber((x) => x + 1);
  };

  const onKey = (key: string) => {
    if (gameState !== GameState.Playing) {
      if (key === "Enter") {
        startNextGame();
      }
      return;
    }
    if (guesses.length === props.maxGuesses) return;
    if (/^[a-zárvíztűrőtükörfúrógépA-ZÁRVÍZTŰRŐTÜKÖRFÚRÓGÉP]$/.test(key)) {
      setCurrentGuess((guess) => (guess + key).slice(0, wordLength));
      setHint("");
    } else if (key === "Backspace") {
      setCurrentGuess((guess) => guess.slice(0, -1));
      setHint("");
    } else if (key === "Enter") {
      if (currentGuess.length !== wordLength) {
        setHint("Too short");
        return;
      }
      if (!dictionary.includes(currentGuess)) {
        setHint(t("invalidWord"));
        return;
      }
      setGuesses((guesses) => guesses.concat([currentGuess]));
      setCurrentGuess((guess) => "");
      if (currentGuess === target) {
        setHint(t("win"));
        setGameState(GameState.Won);
      } else if (guesses.length + 1 === props.maxGuesses) {
        setHint(
          t("lost", {answer: target.toUpperCase()})
        );
        setGameState(GameState.Lost);
      } else {
        setHint("");
      }
    }
  };

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (!e.ctrlKey && !e.metaKey) {
        onKey(e.key);
      }
    };
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [currentGuess, gameState]);

  let letterInfo = new Map<string, Clue>();
  const rowDivs = Array(props.maxGuesses)
    .fill(undefined)
    .map((_, i) => {
      const guess = [...guesses, currentGuess][i] ?? "";
      const cluedLetters = clue(guess, target);
      const lockedIn = i < guesses.length;
      if (lockedIn) {
        for (const { clue, letter } of cluedLetters) {
          if (clue === undefined) break;
          const old = letterInfo.get(letter);
          if (old === undefined || clue > old) {
            letterInfo.set(letter, clue);
          }
        }
      }
      return (
        <Row
          key={i}
          wordLength={wordLength}
          rowState={lockedIn ? RowState.LockedIn : RowState.Pending}
          cluedLetters={cluedLetters}
        />
      );
    });

  return (
    <div className="Game" style={{ display: props.hidden ? "none" : "block" }}>
      <div className="Game-options">
        <label htmlFor="wordLength"><Trans i18nKey="letterCount" /></label>
        <input
          type="range"
          min="4"
          max="11"
          id="wordLength"
          disabled={
            gameState === GameState.Playing &&
            (guesses.length > 0 || currentGuess !== "")
          }
          value={wordLength}
          onChange={(e) => {
            const length = Number(e.target.value);
            resetRng();
            setGameNumber(1);
            setGameState(GameState.Playing);
            setGuesses([]);
            setTarget(randomTarget(length));
            setWordLength(length);
            setHint(`${length} letters`);
            (document.activeElement as HTMLElement)?.blur();
          }}
        ></input>
        <button
          style={{ flex: "0" }}
          disabled={gameState !== GameState.Playing || guesses.length === 0}
          onClick={() => {
            setHint(
              t("givenUp", {answer: target.toUpperCase()})
            );
            setGameState(GameState.Lost);
            (document.activeElement as HTMLElement)?.blur();
          }}
        >
          <Trans i18nKey="giveUp" />
        </button>
      </div>
      {rowDivs}
      <p>{hint || `\u00a0`}</p>
      <Keyboard letterInfo={letterInfo} onKey={onKey} />
      {seed ? (
        <div className="Game-seed-info">
          {t("seedInfo", {seed, length: wordLength, game: gameNumber})}
        </div>
      ) : undefined}
    </div>
  );
}

export default Game;

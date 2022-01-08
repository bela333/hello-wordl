import "./App.css";
import common from "./common.json";
import { dictionarySet, pick, seed } from "./util";
import Game from "./Game";
import { names } from "./names";
import { useState } from "react";
import { Row, RowState } from "./Row";
import { Clue } from "./clue";
import i18n from "i18next";
import { initReactI18next, Trans, useTranslation } from "react-i18next";
import translationEn from "./locales/en.json"
import translationHu from "./locales/hu.json"

const resources = {
  en:{
    translation: translationEn
  },
  hu:{
    translation: translationHu
  }
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: "hu",        //TODO: Change to Hungarian
    fallbackLng: "en",
    debug: true,

    interpolation: {
      escapeValue: false
    }
  });

function App() {
  const {t} = useTranslation();
  const [about, setAbout] = useState(false);
  const maxGuesses = 6;
  return (
    <div className="App-container">
      <h1>{t("title")}</h1>
      <div style={{ position: "absolute", right: 5, top: 5 }}>
        <a href="#" onClick={() => setAbout((a) => !a)}>
          {about ? t("close") : t("about")}
        </a>
      </div>
      <div style={{ position: "absolute", left: 5, top: 5 }}>
        <a
          href="#"
          onClick={() =>
            (document.location = seed
              ? "/"
              : "?seed=" +
                new Date().toISOString().replace(/-/g, "").slice(0, 8))
          }
        >
          {seed ? t("random") : t("today")}
        </a>
      </div>
      {about && (
        <div className="App-about">
          <p>
            <Trans i18nKey="aboutText1">
                <i>hello wordl</i> is a remake of the word game{" "}
                <a href="https://www.powerlanguage.co.uk/wordle/">
                  Wordle
                </a>
                , which I think is based on the TV show <i>Lingo</i>.
            </Trans>
          </p>
          
            <p>
            <Trans i18nKey="aboutText2" count={maxGuesses}>
              You get {maxGuesses} tries to guess a target word.
              </Trans>
              <br />
              <Trans i18nKey="aboutText3">
              After each guess, you get Mastermind-style feedback:
              </Trans>
            </p>
          
          <p>
            <Row
              rowState={RowState.LockedIn}
              wordLength={4}
              cluedLetters={[
                { clue: Clue.Absent, letter: "w" },
                { clue: Clue.Absent, letter: "o" },
                { clue: Clue.Correct, letter: "r" },
                { clue: Clue.Elsewhere, letter: "d" },
              ]}
            />
          </p>
          <p>
            <Trans i18nKey="aboutText4">
              <b>W</b> and <b>O</b> aren't in the target word at all.
            </Trans>
            <br />
            <Trans i18nKey="aboutText5">
              <b>R</b> is correct! The third letter is <b>R</b>
            .
            </Trans>
            <br />
            <Trans i18nKey="aboutText6">
              <b>D</b> occurs <em>elsewhere</em> in the target word.
            </Trans>
          </p>
          <p>
            <Trans i18nKey="aboutText7">
              Let's move the <b>D</b> in our next guess:
            </Trans>
            <Row
              rowState={RowState.LockedIn}
              wordLength={4}
              cluedLetters={[
                { clue: Clue.Correct, letter: "d" },
                { clue: Clue.Correct, letter: "a" },
                { clue: Clue.Correct, letter: "r" },
                { clue: Clue.Absent, letter: "k" },
              ]}
            />
            <Trans i18nKey="aboutText8">So close!</Trans>
            <Row
              rowState={RowState.LockedIn}
              wordLength={4}
              cluedLetters={[
                { clue: Clue.Correct, letter: "d" },
                { clue: Clue.Correct, letter: "a" },
                { clue: Clue.Correct, letter: "r" },
                { clue: Clue.Correct, letter: "t" },
              ]}
            />
            <Trans i18nKey="aboutText9">
            Got it!
            </Trans>
          </p>
          <Trans i18nKey="report">
            Report issues{" "}
            <a href="https://github.com/bela333/hello-wordl/issues">here</a>, or
            tweet <a href="https://twitter.com/bela333">@bela333</a>.
          </Trans>
          <br />
          <Trans i18nKey="madeBy">
            Made by <a href="https://twitter.com/chordbug">@chordbug</a>
          </Trans>
          <br />
          <Trans i18nKey="translatedBy">
            Translated by <a href="https://twitter.com/bela333">@bela333</a>
          </Trans>
        </div>
      )}
      <Game maxGuesses={maxGuesses} hidden={about} />
    </div>
  );
}

export default App;

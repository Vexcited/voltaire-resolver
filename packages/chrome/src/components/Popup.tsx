import { type Component, onMount, createSignal, createEffect, Show } from "solid-js";
import VoltaireResolver from "voltaire-resolver";
import browser from "webextension-polyfill";

const CorrectSentence: Component<{ sentence: string }> = (props) => {
  createEffect(() => {
    const parts: string[] = [];

    let currentIndex = 0, currentPart = "";
    while (currentIndex < props.sentence.length) {
      // whenever we find <B> we start a new part
      if (props.sentence[currentIndex] === "<" && props.sentence[currentIndex + 1] === "B" && props.sentence[currentIndex + 2] === ">") {
        parts.push(currentPart);
        currentPart = "";
        currentIndex += 3;
      }
      else if (props.sentence[currentIndex] === "<" && props.sentence[currentIndex + 1] === "/" && props.sentence[currentIndex + 2] === "B" && props.sentence[currentIndex + 3] === ">") {
        parts.push(currentPart);
        currentPart = "";
        currentIndex += 4;
      }
      else {
        currentIndex++;
        currentPart += props.sentence[currentIndex];
      }
    }
  });

  return (
    <div>
      <p>{props.sentence}</p>
    </div>
  );
}

const Popup: Component = () => {
  const [correct, setCorrect] = createSignal<string | null>(null);

  onMount(async () => {
    const file_data = await browser.storage.local.get("VOLTAIRE_SENTENCES") as {
      VOLTAIRE_SENTENCES: string;
    }

    const { VOLTAIRE_CURRENT_SENTENCE: current_sentence } = await browser.storage.local.get("VOLTAIRE_CURRENT_SENTENCE") as {
      VOLTAIRE_CURRENT_SENTENCE: string;
    };

    if (!current_sentence) return;

    const resolver = new VoltaireResolver(file_data.VOLTAIRE_SENTENCES);
    const correct = resolver.check(current_sentence);
    setCorrect(correct.correct ? "Correct" : correct.correct_sentence);
  });

  return (
    <Show when={correct()} fallback={<div>No data</div>}>
      <CorrectSentence sentence={correct()!} />
    </Show>
  );
};

export default Popup;

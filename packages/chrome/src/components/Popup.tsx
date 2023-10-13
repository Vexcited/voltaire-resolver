import { type Component, onMount, createSignal, Show } from "solid-js";
import VoltaireResolver from "voltaire-resolver";

const Popup: Component = () => {
  const [correct, setCorrect] = createSignal<string | null>(null);

  onMount(async () => {
    const file_data = await chrome.storage.local.get(["VOLTAIRE_SENTENCES"]) as {
      VOLTAIRE_SENTENCES: string;
    }

    const { VOLTAIRE_CURRENT_SENTENCE: current_sentence } = await chrome.storage.local.get(["VOLTAIRE_CURRENT_SENTENCE"]) as {
      VOLTAIRE_CURRENT_SENTENCE: string;
    };

    if (!current_sentence) return;

    const resolver = new VoltaireResolver(file_data.VOLTAIRE_SENTENCES);
    const correct = resolver.check(current_sentence);
    setCorrect(correct.correct ? "Correct" : correct.correct_sentence);
  });

  return (
    <Show when={correct()} fallback={<div>No data</div>}>
      <p>{correct()}</p>
    </Show>
  );
};

export default Popup;

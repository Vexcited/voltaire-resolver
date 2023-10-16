// @ts-expect-error
import script_raw from "./content_proxy?script&module";

const script = document.createElement('script');
script.src = chrome.runtime.getURL(script_raw);
let parent = (document.head || document.documentElement);
parent.insertBefore(script, parent.firstChild);
script.onload = () => script.remove();

let index_req = 0;
document.addEventListener('__GOT_PROXIED_RESPONSE_VOLTAIRE', async function (event) {
  index_req++;
  if (index_req !== 2) return;
  
  // @ts-expect-error
  const data = event.detail;
  await chrome.storage.local.set({ VOLTAIRE_SENTENCES: data });

  console.info("[voltaire-resolver]: stored sentences.");
});

setInterval(() => {
  const sentence_html = document.querySelector(".sentence") as HTMLDivElement;
  if (!sentence_html) {
    console.info("[voltaire-resolver]: sentence not found, clearing the store.");
    chrome.storage.local.set({ VOLTAIRE_CURRENT_SENTENCE: "" });
    return;
  };

  const sentence = sentence_html.innerText;
  chrome.storage.local.set({ VOLTAIRE_CURRENT_SENTENCE: sentence })
    .then(() => console.info("[voltaire-resolver]: stored current sentence ::", sentence));
}, 1000);

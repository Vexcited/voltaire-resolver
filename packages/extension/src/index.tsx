import { render } from "solid-js/web";
import Popup from "./components/Popup";

render(
  () => <Popup />,
  document.getElementById("app-container") as HTMLDivElement
);

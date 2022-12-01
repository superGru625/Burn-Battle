/* @refresh reload */
import { render } from "solid-js/web";

import "./index.scss";
import App from "./App";
import { Router } from "solid-app-router";

const root = document.getElementById("root")!;

/**
 * Adjust scaling using css em-s to mimic design in figma
 */
const resizeCallback = () =>
  (root.style.fontSize = `${Math.min(
    window.innerHeight / 1024,
    window.innerWidth / 1440,
    1
  )}em`);
resizeCallback();
window.addEventListener("resize", resizeCallback);

render(
  () => (
    <Router>
      <App />
    </Router>
  ),
  root
);

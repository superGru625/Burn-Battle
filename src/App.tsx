import { Component, lazy } from "solid-js";
import { Routes, Route } from "solid-app-router";
/**
 * Lazy import to enable code splitting
 */
const HomePage = lazy(() => import("@pages/Home"));
const GamePage = lazy(() => import("@pages/Game"));

const App: Component = () => {
  return (
    <Routes>
      <Route path="/" component={HomePage} />
      <Route path="/game" component={GamePage} />
    </Routes>
  );
};

export default App;

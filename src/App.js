import React from "react";
import { HashRouter, Route } from "react-router-dom";
import Dashboard from "./pages/Dashboard/Dashboard";
import MainLayout from "./pages/Layouts/MainLayout";
import MagnetMap from "./pages/Map/MagnetMap";

function App() {
  return (
    <HashRouter>
      <MainLayout>
        <Route exact path="/" component={Dashboard} />
        <Route exact path="/magnet-map" component={MagnetMap} />
      </MainLayout>
    </HashRouter>
  );
}

export default App;

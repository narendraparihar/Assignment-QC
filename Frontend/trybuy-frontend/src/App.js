import React from "react";
import CustomerOrder from "./components/CustomerOrder";
import StoreOps from "./components/StoreOps";
import Rider from "./components/Rider";
import "./App.css";

function App() {
  return (
    <div className="App">
      <h1>Try & Buy Workflow</h1>
      <CustomerOrder />
      <StoreOps />
      <Rider />
    </div>
  );
}

export default App;

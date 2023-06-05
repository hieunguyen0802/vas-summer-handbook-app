import React from "react";
import Home from "./Components/Home";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Test from "./Components/Test";

const App = () => {
  return (
    <div className="content">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/test" element={<Test />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
};

export default App;

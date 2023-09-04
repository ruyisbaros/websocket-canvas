import React, { useEffect } from "react";
import WhiteBoard from "./components/WhiteBoard";
import { connectToSocketServer } from "./socketCon";
import CursorOverlay from "./crOverlay/CursorOverlay";

const App = () => {
  useEffect(() => {
    connectToSocketServer();
  }, []);
  return (
    <div>
      <WhiteBoard />
      <CursorOverlay />
    </div>
  );
};

export default App;

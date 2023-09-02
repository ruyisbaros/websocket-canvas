import React, { useEffect } from "react";
import WhiteBoard from "./components/WhiteBoard";
import { connectToSocketServer } from "./socketCon";

const App = () => {
  useEffect(() => {
    connectToSocketServer();
  }, []);
  return (
    <div>
      <WhiteBoard />
    </div>
  );
};

export default App;

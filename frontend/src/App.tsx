import "@aptos-labs/wallet-adapter-ant-design/dist/index.css";
import Homepage from "./pages/Homepage";
import { BrowserRouter, Routes, Route } from "react-router-dom";

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Homepage></Homepage>}></Route>
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;

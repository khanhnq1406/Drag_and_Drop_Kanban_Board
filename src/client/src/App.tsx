import { RecoilRoot } from "recoil";
import "./App.css";
import Navbar from "./components/Navbar";
import DragDrop from "./components/DragDrop";

function App() {
  return (
    <RecoilRoot>
      <div className="m-3">
        <Navbar />
        <DragDrop />
      </div>
    </RecoilRoot>
  );
}

export default App;

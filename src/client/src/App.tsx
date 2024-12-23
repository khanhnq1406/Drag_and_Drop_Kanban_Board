import { RecoilRoot } from "recoil";
import "./App.css";
import Navbar from "./components/Navbar";
import DragDrop from "./components/DragDrop";

function App() {
  return (
    <RecoilRoot>
      <div className="p-3 h-full">
        <Navbar />
        <DragDrop />
      </div>
    </RecoilRoot>
  );
}

export default App;

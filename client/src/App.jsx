import "./App.css";
import TI from "./components/TaskInput";
import TD from "./components/TaskDisplay";
import PS from "./components/PendingSummary";
function App() {
  return (
    <div className="App">
      <div className="box1">
        <div className="block1">
          <TI />
        </div>
        <div className="seperator"></div>
        <div className="block2">
          <TD />
        </div>
      </div>
      {/* <div className="box2">
        <PS />
      </div> */}
    </div>
  );
}

export default App;

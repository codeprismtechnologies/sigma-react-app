import "./App.css";
import data from "./data/data.json"; // Import your JSON data
import GraphRenderer from "./components/GraphRenderer";
import HomePage from "./views/Home.screen";

function App() {
  console.log(data);
  return (
    <div className="App">
      {/* <GraphRenderer data={data} /> */}
      <HomePage />
    </div>
  );
}

export default App;

import "./App.css";
import data from "./data/data.json"; // Import your JSON data
import GraphRenderer from "./components/GraphRenderer";

function App() {
  console.log(data);
  return (
    <div className="App">
      <GraphRenderer data={data} />
    </div>
  );
}

export default App;

import React, { useEffect, useState } from "react";
import GraphRenderer from "../components/GraphRenderer";
import api from "../api/api";
import { exportGEXF } from "../utils/gexf_utils";
import { getParsedRenderData } from "../utils/render_utils";

const HomePage = () => {
  const queries = [
    "MATCH (m:Movie)-[r:ACTED_IN]-(p:Person) RETURN m,r,p",
    "MATCH (m:Movie)-[r:DIRECTED|WROTE|PRODUCED]-(p:Person) RETURN m, r, p",
  ];
  const [currentQuery, setCurrentQuery] = useState(queries[0]);
  const [queryData, setQueryData] = useState([]);

  useEffect(() => {
    console.log("Firing");
    const headers = {
      "Content-Type": "application/json",
      "ngrok-skip-browser-warning": true,
    };
    api
      .post(
        "/movies",
        {
          cipherQuery: currentQuery,
        },
        { headers }
      )
      .then(async (value) => {
        const parsedData = getParsedRenderData(value.data);
        //@ts-ignore
        setQueryData(parsedData);
        // console.log(JSON.stringify(parsedData));
        // const gexf = exportGEXF(value.data);
        // console.log("gexf", gexf);
      })
      .catch((e) => {});
  }, [currentQuery]);

  const handleSelectChange = (event: any) => {
    setCurrentQuery(event.target.value);
  };

  return (
    <div style={{ display: "flex", height: "100vh" }}>
      {/* 20% for Dropdown */}
      <div
        style={{
          flex: "20%",
          padding: "20px",
          boxSizing: "border-box",
          zIndex: 1000,
        }}
      >
        {/* Your Dropdown component goes here */}
        <label htmlFor="dropdown">Select an option: </label>
        <select
          id="dropdown"
          value={currentQuery}
          onChange={handleSelectChange}
          style={{ width: "100%" }}
        >
          <option value="">-- Select --</option>
          {queries.map((option, index) => (
            <option key={index} value={option}>
              {option}
            </option>
          ))}
        </select>
      </div>

      {/* 80% for GraphRenderer */}
      <div
        style={{ flex: "80%", borderLeft: "1px solid #ccc", padding: "20px" }}
      >
        {/* Pass the selected option to GraphRenderer or use it as needed */}
        <GraphRenderer selectedOption={currentQuery} />
      </div>
    </div>
  );
};

export default HomePage;

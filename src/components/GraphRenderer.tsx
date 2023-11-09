import React, { useEffect, useRef, useState } from "react";
//@ts-ignore
import Graph from "react-sigma-graph";
import getNodeProgramImage from "sigma/rendering/webgl/programs/node.image";
import { MultiDirectedGraph } from "graphology";
import { SigmaContainer } from "react-sigma-v2";
import GraphController from "./GraphController";
import GraphEventsController from "./GraphEventsController";
import GraphSettingsController from "./GraphSettingsController";
import api from "../api/api";
import drawLabel from "../utils/canvas_utils";
import { getParsedRenderData } from "../utils/render_utils";
import { exportGEXF } from "../utils/gexf_utils";

// Define the props for your component
interface GraphRendererProps {
  data: any; // Replace 'any' with the actual data type
}

const GraphRenderer: React.FC<GraphRendererProps> = ({ data }) => {
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);
  const [showContents, setShowContents] = useState(false);
  const [queryData, setQueryData] = useState([]);
  //"MATCH (m:Movie)-[r:ACTED_IN]-(p:Person) RETURN m,r,p"

  useEffect(() => {
    const headers = {
      "Content-Type": "application/json",
      "ngrok-skip-browser-warning": true,
    };
    api
      .post(
        "/movies",
        {
          cipherQuery:
            "MATCH (m:Movie)-[r:DIRECTED|WROTE|PRODUCED]-(p:Person) RETURN m, r, p",
        },
        { headers }
      )
      .then(async (value) => {
        // console.log(JSON.stringify(value.data));
        const parsedData = getParsedRenderData(value.data);
        //@ts-ignore
        setQueryData(parsedData);
        setShowContents(true);
        console.log(JSON.stringify(parsedData));
        const gexf = exportGEXF(value.data);
        console.log("gexf", gexf);
      })
      .catch((e) => {});
  }, []);

  return (
    <div id="app-root" className={showContents ? "show-contents" : ""}>
      <SigmaContainer
        //@ts-ignore
        graph={MultiDirectedGraph}
        graphOptions={{ type: "directed" }}
        initialSettings={{
          nodeProgramClasses: { image: getNodeProgramImage() },
          labelRenderer: drawLabel,
          defaultNodeType: "image",
          defaultEdgeType: "arrow",
          labelDensity: 0.07,
          labelGridCellSize: 60,
          labelRenderedSizeThreshold: 15,
          labelFont: "Lato, sans-serif",
          zIndex: false,
        }}
        className="react-sigma"
      >
        <GraphSettingsController hoveredNode={hoveredNode} />
        <GraphEventsController setHoveredNode={setHoveredNode} />
        {showContents && <GraphController data={queryData} />}
      </SigmaContainer>
    </div>
  );
};

export default GraphRenderer;

import React, { useEffect, useRef, useState } from "react";
//@ts-ignore
import Graph from "react-sigma-graph";
import getNodeProgramImage from "sigma/rendering/webgl/programs/node.image";
import { MultiDirectedGraph } from "graphology";
import { ForceAtlasControl, SigmaContainer } from "react-sigma-v2";
import GraphController from "./GraphController";
import GraphEventsController from "./GraphEventsController";
import GraphSettingsController from "./GraphSettingsController";
import api from "../api/api";
import drawLabel from "../utils/canvas_utils";
import { getParsedRenderData } from "../utils/render_utils";
import { exportGEXF } from "../utils/gexf_utils";
import ForceAtlas2 from "react-sigma-v2";

// Define the props for your component
interface GraphRendererProps {
  selectedOption: string;
}

const GraphRenderer: React.FC<GraphRendererProps> = (props) => {
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);
  const [showContents, setShowContents] = useState(false);
  const [queryData, setQueryData] = useState([]);

  useEffect(() => {
    const headers = {
      "Content-Type": "application/json",
      "ngrok-skip-browser-warning": true,
    };
    api
      .post(
        "/movies",
        {
          cipherQuery: props.selectedOption,
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
  }, [props.selectedOption]);

  return (
    <div id="app-root" className={showContents ? "show-contents" : ""}>
      <SigmaContainer
        graphOptions={{ type: "directed", multi: true }}
        initialSettings={{
          nodeProgramClasses: { image: getNodeProgramImage() },
          labelRenderer: drawLabel,
          defaultNodeType: "image",
          defaultEdgeType: "arrow",
          labelDensity: 0.07,
          labelGridCellSize: 60,
          labelRenderedSizeThreshold: 15,
          labelFont: "Lato, sans-serif",
          zIndex: true,
        }}
        className="react-sigma"
      >
        <GraphSettingsController hoveredNode={hoveredNode} />
        <GraphEventsController setHoveredNode={setHoveredNode} />
        <ForceAtlasControl
          autoRunFor={2000}
          settings={{
            weighted: true,
            settings: {
              barnesHutOptimize: true,
              gravity: 20,
              strongGravityMode: true,
            },
          }}
        />

        {/* <ForceAtlas2
          iterationsPerRender={1}
          barnesHutOptimize
          barnesHutTheta={1}
          timeout={50000}
          worker
        /> */}
        {showContents && <GraphController data={queryData} />}
      </SigmaContainer>
    </div>
  );
};

export default GraphRenderer;

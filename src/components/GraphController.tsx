import { keyBy, omit } from "lodash";
import React, { useEffect } from "react";
import { useSigma } from "react-sigma-v2";
// import { keyBy, omit } from "lodash";

interface GraphControllerProps {
  data: any;
}

const GraphController: React.FunctionComponent<GraphControllerProps> = (
  props
) => {
  const sigma = useSigma();
  const graph = sigma.getGraph();

  const clusters = keyBy(props.data.clusters, "key");
  //@ts-ignore
  //   const tags = keyBy(props.data.tags, "key");

  useEffect(() => {
    console.log("props.data", props.data);
    if (!graph || !props.data) return;

    props.data.nodes.forEach((node: any) =>
      graph.addNode(node.key, {
        ...node,
        ...omit(clusters[node.cluster], "key"),
        name: node.attributes.title,
      })
    );
    //@ts-ignore
    props.data.edges.forEach((element: any) =>
      graph.addEdge(element.source, element.target, { size: 2, label: "A" })
    );

    graph.forEachNode((node) => graph.setNodeAttribute(node, "size", 30));

    return () => graph.clear();
  }, [graph, props.data]);
  return <>{props.children}</>;
};

export default GraphController;

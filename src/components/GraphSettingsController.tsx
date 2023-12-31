import { useSigma } from "react-sigma-v2";
import { FC, useEffect } from "react";
import useDebounce from "../utils/useDebounce";
import { drawHover } from "../utils/canvas_utils";

const NODE_FADE_COLOR = "#bbb";
const EDGE_FADE_COLOR = "#eee";

const GraphSettingsController: FC<{ hoveredNode: string | null }> = ({
  children,
  hoveredNode,
}) => {
  console.log("Hovered node", hoveredNode);
  const sigma = useSigma();
  const graph = sigma.getGraph();

  // Here we debounce the value to avoid having too much highlights refresh when
  // moving the mouse over the graph:
  const debouncedHoveredNode = useDebounce(hoveredNode, 40);

  /**
   * Initialize here settings that require to know the graph and/or the sigma
   * instance:
   */
  useEffect(() => {
    sigma.setSetting("hoverRenderer", (context, data, settings) => {
      console.log(context, data, settings, "A");
      return drawHover(
        context,
        { ...sigma.getNodeDisplayData(hoveredNode), ...data },
        settings
      );
    });
  }, [sigma, graph]);

  /**
   * Update node and edge reducers when a node is hovered, to highlight its
   * neighborhood:
   */
  useEffect(() => {
    const hoveredColor: string = debouncedHoveredNode
      ? sigma.getNodeDisplayData(debouncedHoveredNode)!.color
      : "";

    sigma.setSetting(
      "nodeReducer",
      debouncedHoveredNode
        ? (node, data) =>
            node === debouncedHoveredNode ||
            graph.hasEdge(node, debouncedHoveredNode) ||
            graph.hasEdge(debouncedHoveredNode, node)
              ? { ...data, zIndex: 1, label: data.title }
              : {
                  ...data,
                  zIndex: 0,
                  label: "",
                  color: NODE_FADE_COLOR,
                  image: null,
                  highlighted: false,
                }
        : null
    );
    sigma.setSetting(
      "edgeReducer",
      debouncedHoveredNode
        ? (edge, data) =>
            graph.hasExtremity(edge, debouncedHoveredNode)
              ? { ...data, color: hoveredColor, size: 4, label: "A" }
              : { ...data, color: EDGE_FADE_COLOR, hidden: true }
        : null
    );
  }, [debouncedHoveredNode]);

  return <>{children}</>;
};

export default GraphSettingsController;

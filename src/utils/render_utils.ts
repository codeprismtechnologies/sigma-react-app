//@ts-nocheck
export function getParsedRenderData(inputData: any) {
    const nodes = [];
    const edges = [];
    const uniqueKeys = new Set();
    inputData.forEach(entry => {
        const movie = entry._fields[0];
        const person = entry._fields[2];
        const addNode = (element, label) => {
            const key = element.identity.low.toString();
            if (!uniqueKeys.has(key)) {
                nodes.push({
                    key: key,
                    id: element.elementId,
                    attributes: { ...element.properties, label: label },
                    x: Math.random(),
                    y: Math.random(),
                    cluster: label === "Person" ? 0 : 1,
                });
                uniqueKeys.add(key);
            }
        };
        addNode(movie, 'Movie');
        addNode(person, 'Person');
        edges.push({
            key: entry._fields[1].identity.low.toString(),
            source: person.identity.low.toString(),
            target: movie.identity.low.toString(),
            type: entry._fields[1].type,
            attributes: { ...entry._fields[1].properties },
            label: entry._fields[1].name
        });
    });
    const result = {
        attributes: {},
        nodes,
        edges,
        clusters: [
            { "key": "0", "color": "#6c3e81", "clusterLabel": "Actor" },
            { "key": "1", "color": "#cf7435", "clusterLabel": "Movie" },
        ],
        options: {
            type: "directed",
            multi: true,
            allowSelfLoops: true
        }
    };
    // return JSON.stringify(result, null, 2);
    return result;
}






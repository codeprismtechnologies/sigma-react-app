import * as xml from 'xmlbuilder2';

export const exportGEXF = (inputData: any) => {
    const nodes: any = [];
    const edges: any = [];
    const uniqueKeys = new Set();

    inputData.forEach((entry: any) => {
        const movie = entry._fields[0];
        const actedIn = entry._fields[2];

        const addNode = (element: any, label: any) => {
            const key = element.identity.low.toString();
            if (!uniqueKeys.has(key)) {
                nodes.push({
                    node: {
                        id: key,
                        label: label,
                        attvalues: Object.entries(element.properties).map(([key, value]) => ({
                            id: key,
                            //@ts-ignore
                            value: value.toString(),
                        })),
                    },
                });
                uniqueKeys.add(key);
            }
        };

        addNode(movie, 'Movie');
        addNode(actedIn, 'Person');

        edges.push({
            edge: {
                id: entry._fields[1].identity.low.toString(),
                source: movie.identity.low.toString(),
                target: actedIn.identity.low.toString(),
            },
        });
    });

    const gexfData = {
        gexf: {
            graph: {
                attributes: {
                    class: 'node',
                    type: 'static',
                    attribute: [
                        { id: '0', title: 'nodedef', type: 'string' },
                        { id: '1', title: 'label', type: 'string' },
                        { id: '2', title: 'occurrences', type: 'integer' },
                    ],
                },
                nodes: nodes,
                edges: edges,
            },
        },
    };
    const doc: any = xml.create(gexfData);
    const d = doc.end({ prettyPrint: true });
    console.log(d);
    return d;

}
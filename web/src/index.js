import * as d3 from "d3";
import * as data from "./flare.json";

function chart() {
    const width = 928;
    let isMouseOverTooltip = false;
    let isMouseOverText = false;
    let hideTooltipTimeoutId = null;
    let showTooltipTimeoutId = null;

    // Compute the tree height; this approach will allow the height of the
    // SVG to scale according to the breadth (width) of the tree layout.
    const root = d3.hierarchy(data);
    const dx = 10;
    const dy = width / (root.height + 1);

    // Create a tree layout.
    const tree = d3.cluster().nodeSize([dx, dy]);

    // Sort the tree and apply the layout.
    root.sort((a, b) => d3.ascending(a.data.name, b.data.name));
    tree(root);

    // Compute the extent of the tree. Note that x and y are swapped here
    // because in the tree layout, x is the breadth, but when displayed, the
    // tree extends right rather than down.
    let x0 = Infinity;
    let x1 = -x0;
    root.each(d => {
        if (d.x > x1) x1 = d.x;
        if (d.x < x0) x0 = d.x;
    });

    // Compute the adjusted height of the tree.
    const height = x1 - x0 + dx * 2;

    const svg = d3.create("svg")
        .attr("width", width)
        .attr("height", height)
        .attr("viewBox", [-dy / 3, x0 - dx, width, height])
        .attr("style", "max-width: 100%; height: auto; font: 10px sans-serif;");

    const link = svg.append("g")
        .attr("fill", "none")
        .attr("stroke", "#555")
        .attr("stroke-opacity", 0.4)
        .attr("stroke-width", 1.5)
        .selectAll()
        .data(root.links())
        .join("path")
        .attr("d", d3.linkHorizontal()
            .x(d => d.y)
            .y(d => d.x));

    const node = svg.append("g")
        .attr("stroke-linejoin", "round")
        .attr("stroke-width", 3)
        .selectAll()
        .data(root.descendants())
        .join("g")
        .attr("transform", d => `translate(${d.y},${d.x})`);

    node.append("circle")
        .attr("fill", d => d.children ? "#555" : "#999")
        .attr("r", 2.5);

    console.log("Creating textNodes");

    node.append("text")
        .attr("dy", "0.31em")
        .attr("x", d => d.children ? -6 : 6)
        .attr("text-anchor", d => d.children ? "end" : "start")
        .text(d => d.data.name)
        .on('mouseover', function(event, d) {
            d3.selectAll("text").classed("no-pointer-events", function(current) {
                return d !== current;
            });
            isMouseOverText = true;
            console.log("text mouseover");
            const tooltip = d3.select('#tooltip');

            // Get the bounding rectangle of the target text element
            const rect = event.target.getBoundingClientRect();
            
            // Calculate position based on the bounding rectangle
            // Adjust '20' based on desired tooltip position relative to the text
            const x = rect.left + (rect.width / 2) + window.scrollX;
            const y = rect.top + window.scrollY;   
            tooltip.style('opacity', 1)
                    .style('display', 'block')
                    .style('left', `${x - 50}px`)
                    .style('top', `${y - 28}px`) // Position below the cursor or element
                    .html(`<a href="https://github.com" target="_blank">Generic Link</a>`); // Add a clickable link
            
        })


        .on('mouseout', function() {
            console.log("text mouseout");
            isMouseOverText = false;
            
            hideTooltipTimeoutId = setTimeout(() => {
            if(!isMouseOverTooltip && !isMouseOverText) {
                d3.select('#tooltip').style('opacity', 0).style('display', 'none');
                node.selectAll("text").classed("no-pointer-events", false);

            }
            }, 50);
        })
        .clone(true).lower()
        .attr("stroke", "white");

    d3.select('#tooltip')
    .on('mouseover', function() {
        console.log("tooltip mouseover");
        isMouseOverTooltip = true;
        clearTimeout(hideTooltipTimeoutId); // Prevent the tooltip from showing if the hover was too brief

        
    })
    .on('mouseout', function() {
        console.log("tooltip mouseout");
        clearTimeout(hideTooltipTimeoutId); // Prevent the tooltip from hiding when mouse moves over it
        isMouseOverTooltip = false;
        if (!isMouseOverText && !isMouseOverTooltip) {
            d3.select(this).style('opacity', 0).style('display', 'none'); 
            node.selectAll("text").style("pointer-events", "auto");
        }
    });

    return svg.node();
}

console.log(chart());

document.getElementById("chart").appendChild(chart());
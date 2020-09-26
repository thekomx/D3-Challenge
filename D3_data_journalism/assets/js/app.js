// @TODO: YOUR CODE HERE!
const svgHeight = 500;
const svgWidth = 750;
const svgMargin = {
                    top : 25,
                    right : 25,
                    bottom : 75,
                    left : 75
                }
const width = svgWidth - svgMargin.left - svgMargin.right;
const height = svgHeight - svgMargin.top - svgMargin.bottom;

const svg = d3.select('#scatter')
            .append('svg')
            .attr('height', svgHeight)
            .attr('width', svgWidth);

const chartGroup = svg.append('g')
                    .attr('transform', `translate(${svgMargin.left}, ${svgMargin.top})`);


function num_Converter(data){
    data.forEach(d => {
        Object.keys(d).forEach(k => {d[k] = (['state','abbr'].indexOf(k) === -1)?+d[k] : d[k]})
    })
}


d3.csv('./assets/data/data.csv').then(data =>{
    num_Converter(data);

    const xLinearScale = d3.scaleLinear()
                            .domain([d3.min(data, d=>d.poverty)-1, d3.max(data, d=>d.poverty)])
                            .range([0, width]);
    const yLinearScale = d3.scaleLinear()
                            .domain([d3.min(data, d=>d.healthcare)-2, d3.max(data, d=>d.healthcare)])
                            .range([height, 0]);

    const bottomAxis = d3.axisBottom(xLinearScale);
    const leftAxis = d3.axisLeft(yLinearScale);

    chartGroup.append('g').attr('transform', `translate(0,${height})`).call(bottomAxis);
    chartGroup.append('g').call(leftAxis);

    chartGroup.append('text')
        .attr('transform', 'rotate(-90)')
        .attr('y', 0 - svgMargin.left + 40)
        .attr('x', 0 - (svgHeight / 2))
        .attr('class', 'axistitle')
        .text('Lacks Healthcare (%)');

    chartGroup.append('text')
        .attr('transform', `translate(${svgWidth / 3}, ${svgHeight-50})`)
        .attr('class', 'axistitle')
        .text('In Poverty (%)');

    chartGroup.selectAll('label').data(data).enter().append('text')
                .attr('x', d=>xLinearScale(d.poverty)-8)
                .attr('y', d=>yLinearScale(d.healthcare)+5)
                .classed('circletext',true)
                .attr("font-family","sans-serif").attr("font-size",11)
                .text(d=>d.abbr);

    chartGroup.selectAll('circle').data(data).enter()
                .append('circle')
                .attr('cx', d=>xLinearScale(d.poverty))
                .attr('cy', d=>yLinearScale(d.healthcare))
                .attr('r', 13)
                .attr('fill', 'aqua')
                .attr('opacity', 0.5);
})
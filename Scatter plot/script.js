const render = dataset => {
    const xValue = d => d.Year;
    const yValue = d => d.Time;
    const timeValue = d => d3.timeFormat("%M:%S")(d.Time);
    const nameValue = d => d.Name;
    const nationalityValue = d => d.Nationality;
    const dopingValue = d => d.Doping;

    const width = 1260;
    const height = 600;
    const radius = 8;

    const margin = { top: 50, right: 60, bottom: 50, left: 80 };
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;

    const xAxisPadding = 1;

    const svg = d3.select('body')
                  .append('svg')
                  .attr('viewBox', `0 0 ${width} ${height}`);

    const scatterplot = svg.append('g')
      .attr('transform', `translate(${margin.left}, ${margin.top})`);

    const xScale = d3.scaleTime()
      .domain([d3.min(dataset, xValue) - xAxisPadding, d3.max(dataset, xValue) + xAxisPadding])
      .range([0, innerWidth]);

    const yScale = d3.scaleTime()
      .domain([d3.min(dataset, yValue), d3.max(dataset, yValue)])
      .range([0, innerHeight]);

    const xAxis = d3.axisBottom(xScale)
      .tickFormat(d => d3.timeFormat('%Y')(new Date(0).setFullYear(d)))
      .tickSizeOuter(0);
    const yAxis = d3.axisLeft(yScale)
      .tickFormat(d3.timeFormat('%M:%S'))
      .tickSizeOuter(0);

    scatterplot.append('g')
      .attr('id', 'x-axis')
      .attr('transform', `translate(0, ${innerHeight})`)
      .call(xAxis);

    scatterplot.append('g')
       .attr('id', 'y-axis')
       .call(yAxis)
       .append('text')
       .attr('id', 'yAxis-label')
       .attr('x', -50)
       .attr('y', -50)
       .attr('transform', 'rotate(-90)')
       .text('Time in Minutes');

    scatterplot.append('text')
      .attr('id', 'title')
      .attr('x', innerWidth / 2)
      .attr('y', -10)
      .attr('text-anchor', 'middle')
      .text('Doping in Professional Bicycle Racing');

    scatterplot.append('text')
      .attr('id', 'subtitle')
      .attr('x', innerWidth / 2)
      .attr('y', 12)
      .attr('text-anchor', 'middle')
      .text("35 Fastest times up Alpe d'Huez");

    const legend = scatterplot.append('g').attr('id', 'legend');

    legend.append('text')
      .attr('class', 'legend-text')
      .attr('x', innerWidth)
      .attr('y', innerHeight * 0.4)
      .text('No doping allegations');

    legend.append('text')
      .attr('class', 'legend-text')
      .attr('x', innerWidth)
      .attr('y', innerHeight * 0.4 + 30)
      .text('Riders with doping allegations');

    legend.append('rect')
      .attr('x', innerWidth + 10)
      .attr('y', innerHeight * 0.37)
      .attr('width', 20)
      .attr('height', 20)
      .attr('fill', '#07e83f');

    legend.append('rect')
      .attr('x', innerWidth + 10)
      .attr('y', innerHeight * 0.37 + 30)
      .attr('width', 20)
      .attr('height', 20)
      .attr('fill', '#e83407');

    const tooltip = d3.select('body').append('div')
      .attr('id', 'tooltip')
      .style('opacity', 0);

    scatterplot.selectAll('circle').data(dataset)
       .enter().append('circle')
       .attr('cx', d => xScale(xValue(d)))
       .attr('cy', d => yScale(yValue(d)))
       .attr('r', radius)
       .attr('class', 'dot')
       .attr('data-xvalue', xValue)
       .attr('data-yvalue', yValue)
       .attr('fill', d => dopingValue(d) ? '#e83407' : '#07e83f')
       .on('mouseover', d => {
          tooltip.transition().duration(200).style('opacity', 0.9);
          tooltip.html(`${nameValue(d)}: ${nationalityValue(d)} <br>Year: ${xValue(d)}, Time: ${timeValue(d)}<br><br>${dopingValue(d)}`)
            .style('left', d3.event.pageX + "px")
            .style('top', d3.event.pageY + "px")
            .attr('data-year', xValue(d));
       })
       .on('mouseout', () => {
          tooltip.transition().duration(500).style('opacity', 0);
       });
  };

  document.addEventListener('DOMContentLoaded', function() {
    const request = new XMLHttpRequest();
    request.open('GET', 'https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/cyclist-data.json', true);
    request.send();
    request.onload = function () {
      let dataset = JSON.parse(request.responseText);

      dataset.forEach(d => {
        let parsedTime = d.Time.split(':');
        d.Time = new Date(1970, 0, 1, 0, parsedTime[0], parsedTime[1]);
      });

      render(dataset);
    };
  });
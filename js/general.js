function precisionRound(number, decimalPlaces){
    return (Math.round(number*Math.pow(10, decimalPlaces)))/Math.pow(10, decimalPlaces)
}

function isEqual(setA, setB) {
    if (setA.length !== setB.length) return false;
    for (var i = 0; i < setA.length; i++) {
        if (setA[i] !== setB[i]) return false;
    }
    return true;
}


function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
}

function boundIndex(index, boundary) {
    return index < 0 ? boundary + index : index % boundary;
}

function draw_line_chart(output,data,x_label,y_label,legend_values,x_max,y_max_flex) {
    var margin = {top: 30, right: 50, bottom: 50, left: 50},
        width = 550 - margin.left - margin.right,
        height = 300 - margin.top - margin.bottom;

    var version = d3.scale ? 3 : 4;
    var color = (version == 3 ? d3.scale.category10() : d3.scaleOrdinal(d3.schemeCategory10));
                
    if (!x_max) {
        x_max = data[0].length > 0 ? data[0].length : data.length
    }
                
    var y_max = data[0].length > 0 ? d3.max(data, function(array) {
            return d3.max(array);
        }) : d3.max(data);

    var x = (version == 3 ? d3.scale.linear() : d3.scaleLinear())
        .domain([0,x_max])
        .range([0, width]);

    var y = y_max_flex ? (version == 3 ? d3.scale.linear() : d3.scaleLinear())
        .domain([0, 1.1 * y_max])
        .range([height, 0]) : (version == 3 ? d3.scale.linear() : d3.scaleLinear())
        .range([height, 0]);
        
    var xAxis = (version == 3 ? d3.svg.axis().scale(x).orient("bottom") : 
    	d3.axisBottom().scale(x));

    var yAxis = (version == 3 ? d3.svg.axis().scale(y).orient("left") : 
    	d3.axisLeft().scale(y));

    var line = (version == 3 ? d3.svg.line() : d3.line())
        .x(function (d, i) {
            var dat = (data[0].length > 0 ? data[0] : data);
            return x((i/(dat.length-1)) * x_max);
        })
        .y(function (d) {
            return y(d);
        });
        
    var svg = d3.select(output).append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis)
        .append("text")
        .style("text-anchor", "middle")
        .attr("x", width / 2)
        .attr("y", 6)
        .attr("dy", "3em")
        .style("fill", "#eee")
        .style("font-family", "Courier New")
        .text(x_label);

    svg.append("g")
        .attr("class", "y axis")
        .call(yAxis)
        .append("text")
        .attr("transform", "rotate(-90)")
        .attr("x", -height / 2)
        .attr("dy", "-3.5em")
        .style("text-anchor", "middle")
        .style("fill", "#eee")
        .style("font-family", "Courier New")
        .text(y_label);

    if (legend_values.length > 0) {		
        var legend = svg.append("text")
            .attr("text-anchor", "star")
            .attr("y", 30)
            .attr("x", width-100)
            .append("tspan").attr("class", "legend_title")
            .text(legend_values[0])
            .append("tspan").attr("class", "legend_text")
            .attr("x", width-100).attr("dy", 20).text(legend_values[1])
            .append("tspan").attr("class", "legend_title")
            .attr("x", width-100).attr("dy", 20).text(legend_values[2])
            .append("tspan").attr("class", "legend_text")
            .attr("x", width-100).attr("dy", 20).text(legend_values[3]);
    }
    else {
        svg.selectAll("line.horizontalGridY")
            .data(y.ticks(10)).enter()
            .append("line")
            .attr("x1", 1)
            .attr("x2", width)
            .attr("y1", function(d){ return y(d);})
            .attr("y2", function(d){ return y(d);})
            .style("fill", "none")
            .style("shape-rendering", "crispEdges")
            .style("stroke", "#262626")
            .style("stroke-width", "1px");

        svg.selectAll("line.horizontalGridX")
            .data(x.ticks(10)).enter()
            .append("line")
            .attr("x1", function(d,i){ return x(d);})
            .attr("x2", function(d,i){ return x(d);})
            .attr("y1", 1)
            .attr("y2", height)
            .style("fill", "none")
            .style("shape-rendering", "crispEdges")
            .style("stroke", "#262626")
            .style("stroke-width", "1px");
    }

    // d3.select("body").style("font","10px sans-serif");
    // d3.selectAll(".axis line").style("stroke","#000"); 
    // d3.selectAll(".y.axis path").style("display","none"); 
    // d3.selectAll(".x.axis path").style("display","none");    
    d3.selectAll(".legend_title")
        .style("font-size","12px").style("fill","#555").style("font-weight","400");
    d3.selectAll(".legend_text")
        .style("font-size","20px").style("fill","#bbb").style("font-weight","700");

    if (data[0].length > 0) {
        var simulation = svg.selectAll(".simulation")
            .data(data)
            .enter().append("g")
            .attr("class", "simulation");

        simulation.append("path")
            .attr("class", "line")
            .attr("fill", "none")
            .attr("d", function(d) { return line(d); })
            .style("stroke", function(d,i) { return color(i); });
    } 
    else {
        svg.append("path")
            .datum(data)
            .attr("class", "line")
            .attr("fill", "none")
            .attr("d", line)
            .style("stroke","green");
    }
    d3.selectAll(".line").style("fill", "none").style("stroke-width","1.5px");    
}

function draw_grid(output,data,colors) {
    var width = 500;
    var height = 500;
    var grid_length = data.length;

    var svg = d3.select(output).append('svg')
          .attr('width', width)
          .attr('height', height);

    var rw = Math.floor(width/grid_length);
    var rh = Math.floor(height/grid_length);

    var g = svg.selectAll('g')
            .data(data)
            .enter()
            .append('g')
            .attr('transform', function (d, i) {
              return 'translate(0, ' + (width/grid_length) * i + ')';
            });
    g.selectAll('rect')
            .data(function (d) {
              return d;
            })
            .enter()
            .append('rect')
            .attr('x', function (d, i) {
              return (width/grid_length) * i;
            })
            .attr('width', rw)
            .attr('height', rh)
            .attr('class',function(d) {
              return d;
            });
    if (!colors) {
    	d3.selectAll(".A1A1").style("fill","#fff");
        d3.selectAll(".A1A2").style("fill","#2176c9");
        d3.selectAll(".A2A2").style("fill","#042029");
    }
    else {
        for (var i = 0; i < colors.length; i = i + 2) {
            d3.selectAll("."+colors[i]).style("fill",colors[i+1]);	
        }
    }
}

function update_grid(output,data,colors){
    var grid_length = data.length;
    d3.select(output).select('svg').selectAll('g')
        .data(data)
        .selectAll('rect')
        .data(function (d) {
          return d;
        })
        .attr('class',function(d) {
          return d;
        });
    if (!colors) {
    	d3.selectAll(".A1A1").style("fill","#fff");
        d3.selectAll(".A1A2").style("fill","#2176c9");
        d3.selectAll(".A2A2").style("fill","#042029");
    }
    else {
        for (var i = 0; i < colors.length; i = i + 2) {
            d3.selectAll("."+colors[i]).style("fill",colors[i+1]);	
        }
    }
}
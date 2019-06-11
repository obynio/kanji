const width = 700;
const height = 640;
const speed = 0.005;
const svg = d3.select('#globe').attr('width', width).attr('height', height);
const projection = d3.geoOrthographic().translate([width / 2, height / 2]).scale(height / 2).clipAngle(90);
const projectionOrbit = d3.geoOrthographic().translate([width / 2, height / 2]).scale(height / 2 + 30).clipAngle(90);
const range = d3.scaleLinear().domain([0, width * 2]).range([-180, 180]);
const path = d3.geoPath().projection(projection);
const markerGroup = svg.append('g');
const center = [width/2, height/2];

var locations = [];
var timer = null;

drawGlobe();
enableRotation();

var drag = d3
.drag()
.subject(() => ({ x: range.invert(projection.rotate()[0]) }))
.on('drag', function() {
    pauseRotation();

    projection.rotate([range(d3.event.x), 0]);
    projectionOrbit.rotate([range(d3.event.x), 0]);

    svg.selectAll('path').attr('d', path);

    drawMarkers();
})
.on('end', function () { 
  resumeRotation();
});

svg.call(drag);

function drawGlobe() {
    d3.queue()
        .defer(d3.json, '/js/world.json')
        .defer(d3.json, '/js/locations.json')
        .await((error, worldData, locationData) => {
            svg.append('path')
            .datum(topojson.feature(worldData, worldData.objects.land))
            .attr('d', path)
            .attr('class', 'land-boundary')
            .style('fill', '#b7efe9');

            locations = locationData;

            drawMarkers();
        });
}

function enableRotation() {
    timer = d3.timer(function (elapsed) {
        projection.rotate([speed * elapsed, 0]);
        projectionOrbit.rotate([speed * elapsed, 0]);

        svg.selectAll('path').attr('d', path);

        drawMarkers();
    });
}

function pauseRotation() {
    timer.stop();
}

function resumeRotation() {
    rot = projection.rotate()[0];
    rotOrbit = projectionOrbit.rotate()[0];

    timer.restart(function (elapsed) {
        projection.rotate([rot + speed * elapsed, 0]);
        projectionOrbit.rotate([rotOrbit + speed * elapsed, 0]);
    
        svg.selectAll('path').attr('d', path);

        drawMarkers();
    });
}

// Over function to be called on mouseover
function over(d, i) {
    pauseRotation();
    d3.select(this).attr('r', 25).style('fill', 'white');
}

// Out function to be called on mouseout
function out(d, i) {
    resumeRotation();
    d3.select(this).attr('r', 8).style('fill', null);
}

function drawMarkers() {
    circles = markerGroup.selectAll('circle').data(locations);
    lines = markerGroup.selectAll('line').data(locations);

    lines
        .enter()
        .append('line')
        .merge(lines)
        .attr('x1', d => projection([d.longitude, d.latitude])[0])
        .attr('y1', d => projection([d.longitude, d.latitude])[1])
        .attr('x2', d => projectionOrbit([d.longitude, d.latitude])[0])
        .attr('y2', d => projectionOrbit([d.longitude, d.latitude])[1])
        .attr('class', 'pin__line')
        .attr('visibility', d => {
            const coordinate = [d.longitude, d.latitude];
            gdistance = d3.geoDistance(coordinate, projection.invert(center));
            return gdistance > 1.57 ? 'hidden' : 'visible';
        });

    circles
        .enter()
        .append('circle')
        .merge(circles)
        .attr('r', 8)
        .on('mouseover', over)
        .on('mouseout', out)
        .attr('cx', d => projectionOrbit([d.longitude, d.latitude])[0])
        .attr('cy', d => projectionOrbit([d.longitude, d.latitude])[1])
        .attr('class', 'pin__circle')
        .attr('visibility', d => {
            const coordinate = [d.longitude, d.latitude];
            gdistance = d3.geoDistance(coordinate, projection.invert(center));
            return gdistance > 1.57 ? 'hidden' : 'visible';
        });

    markerGroup.each(function () {
        this.parentNode.appendChild(this);
    });
}
const width = 700;
const height = 640;
const config = {
    speed: 0.005,
    verticalTilt: 0,
    horizontalTilt: 0
}
const svg = d3.select('#globe').attr('width', width).attr('height', height);
const projection = d3.geoOrthographic().translate([width / 2, height / 2]).scale(height / 2).clipAngle(90);
const projectionOrbit = d3.geoOrthographic().translate([width / 2, height / 2]).scale(height / 2 + 30).clipAngle(90);
const path = d3.geoPath().projection(projection);
const markerGroup = svg.append('g');
const center = [width/2, height/2];

let locations = [];

drawGlobe();
enableRotation();

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
    d3.timer(function (elapsed) {
        projection.rotate([config.speed * elapsed - 120, config.verticalTilt, config.horizontalTilt]);
        projectionOrbit.rotate([config.speed * elapsed - 120, config.verticalTilt, config.horizontalTilt]);

        svg.selectAll("path").attr("d", path);
        drawMarkers();
    });
}

// Over function to be called on mouseover
function over(d, i) {
    d3.select(this).style("fill", "green");
}

// Out function to be called on mouseout
function out(d, i) {
    d3.select(this).style("fill", null);
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
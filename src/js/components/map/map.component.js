(function () {
    'use strict';


    angular
        .module('visualizations')
        .directive('map', worldMap)

    function worldMap() {
        return {
            templateUrl: 'src/js/components/map/map.html',
            controller: MapController,
            controllerAs: 'mapCtrl',
            bindToController: {
                config: '<'
            },
            link: link
        }
    }

    function link(scope, element, attrs, $ctrl) {

        var width = 1000,
            height = 1100,
            // SVG element as a JavaScript object that we can manipulate later
            svg = d3.select(element[0]).append("svg")
                .attr("id", "map")
                .attr("width", width)
                .attr("height", height);

        // Instantiate the projection object
        var projection = d3.geoMercator()
            .scale(width / 2 / Math.PI)
            //.scale(100)
            .translate([width / 2, height / 2])

        var path = d3.geoPath().projection(projection);

        var g = svg.append("g");

        var url = "http://enjalot.github.io/wwsd/data/world/world-110m.geojson";
        d3.json(url, function (err, geojson) {
            g.append("path")
                .attr("d", path(geojson));

            // load and display the cities
            d3.csv("cities.csv", function (error, data) {
                g.selectAll("circle")
                    .data(data)
                    .enter()
                    .append("circle")
                    .attr('class', 'circle')
                    .attr("cx", function (d) {
                        return projection([d.lon, d.lat])[0];
                    })
                    .attr("cy", function (d) {
                        return projection([d.lon, d.lat])[1];
                    })
                    .attr("r", function (d) {
                        console.log(d);

                        return d.average * 3;
                    })
                    .style("fill", "red");
            });
        })


    }

    function MapController() {

    }

})();
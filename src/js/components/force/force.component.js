(function () {
    'use strict';

    angular
        .module('visualizations')
        .directive('force', force)

    function force() {
        return {
            templateUrl: 'src/js/components/force/force.html',
            controller: ForceController,
            controllerAs: 'forceCtrl',
            bindToController: {
                config: '<'
            },
            link: link
        }
    }

    function link(scope, element, attrs, $ctrl) {

        $ctrl.svg = d3.select(element[0])
            .append('svg')
            .attr("viewBox", "0 0 " + 960 + " " + 600)
            .attr("preserveAspectRatio", "xMidYMid meet");

    }

    function ForceController() {
        var $ctrl = this;
        var width, height, color, simulation;

        function init() {
            color = d3.scaleOrdinal(d3.schemeCategory20);

            simulation = d3.forceSimulation()
                .force("link", d3.forceLink().id(function (d) { return d.id; }))
                // .force("collide", d3.forceCollide(function (d) { console.log(d); return 20 }))
                .force("charge", d3.forceManyBody().strength(function () { return -60; }))
                .force("center", d3.forceCenter(960 / 2, 600 / 2));
        }

        function getNetworkData() {
            d3.json("mocks/data.json", function (error, graph) {

                if (error) throw error;

                // Create links
                var link = d3.select('svg').append("g")
                    .attr("class", "links")
                    .selectAll("line")
                    .data(graph.links)
                    .enter().append("line")
                    .attr("stroke-width", function (d) { return Math.sqrt(d.value); });

                // Create nodes
                // var node = svg.append("g")
                //     .attr("class", "nodes")
                //     .selectAll("circle")
                //     .data(graph.nodes)
                //     .enter().append("circle")
                //     .attr("r", function () { return Math.random() * $ctrl.config.radius })
                //     .attr("fill", function (d) { return color(d.group); });
                // .call(d3.drag()
                //     .on("start", dragstarted)
                //     .on("drag", dragged)
                //     .on("end", dragended));



                var label = d3.select('svg').append("g")
                    .attr("class", "labels")
                    .selectAll("text")
                    .data(graph.nodes)
                    .enter().append("text")
                    .text(function (d) { return d.id });

                var monster = d3.select('svg').append('g')
                    .attr('class', 'monsters')
                    .selectAll('path')
                    .data(graph.nodes)
                    .enter().append('path')
                    .attr('class', 'monster')
                    .attr('d', 'M24 13.313c0-2.053-.754-3.026-1.417-3.489.391-1.524 1.03-5.146-.963-7.409-.938-1.065-2.464-1.54-4.12-1.274-1.301-.557-3.266-1.141-5.5-1.141s-4.199.584-5.5 1.141c-1.656-.266-3.182.208-4.12 1.274-1.993 2.263-1.353 5.885-.963 7.409-.663.463-1.417 1.435-1.417 3.489 0 .996.326 2.131.986 3.102-.485 1.421.523 3.049 2.283 2.854-.318 1.622 1.365 2.928 3.082 2.128-.201 1.163 1.421 2.58 3.443 1.569.671.572 1.188 1.034 2.204 1.034 1.155 0 1.846-.643 2.277-1.035 2.022 1.012 3.574-.406 3.374-1.569 1.718.8 3.4-.506 3.082-2.128 1.76.195 2.768-1.433 2.283-2.854.659-.97.986-2.106.986-3.101zm-12 6.57c-1.722 0-2.4-1.883-2.4-1.883h4.8s-.612 1.883-2.4 1.883zm3.578-2.992c-1.052-.515-2.455-1.126-3.578-.322-1.124-.804-2.526-.193-3.578.322-4.251 2.08-8.024-4.023-5.842-5.444.204-.132.488-.135.672-.053.661.292 1.406-.191 1.406-.914 0-2.214.692-4.434 2.154-5.988l.015-.01c2.604-2.596 7.741-2.596 10.345 0l.016.011c1.462 1.554 2.154 3.774 2.154 5.987 0 .726.748 1.205 1.406.914.141-.063.436-.1.671.053 2.15 1.392-1.514 7.561-5.841 5.444zm.172-7.391c-1.124 0-2.094.629-2.607 1.546-.373-.116-.744-.174-1.143-.174s-.77.058-1.143.174c-.513-.917-1.483-1.546-2.607-1.546-1.654 0-3 1.346-3 3s1.346 3 3 3c1.231 0 2.285-.748 2.747-1.811.246-.566.394-1.301 1.003-1.301s.758.735 1.003 1.301c.462 1.063 1.516 1.811 2.747 1.811 1.654 0 3-1.346 3-3s-1.346-3-3-3zm-7.5 4.5c-.828 0-1.5-.672-1.5-1.5s.672-1.5 1.5-1.5 1.5.672 1.5 1.5-.672 1.5-1.5 1.5zm7.5 0c-.828 0-1.5-.672-1.5-1.5s.672-1.5 1.5-1.5 1.5.672 1.5 1.5-.672 1.5-1.5 1.5z')
                    .call(d3.drag()
                        .on("start", dragstarted)
                        .on("drag", dragged)
                        .on("end", dragended));

                simulation
                    .nodes(graph.nodes)
                    .on("tick", ticked);

                simulation.force("link")
                    .links(graph.links);

                // Add coordinates to elements
                function ticked() {
                    link
                        .attr("x1", function (d) { return d.source.x; })
                        .attr("y1", function (d) { return d.source.y; })
                        .attr("x2", function (d) { return d.target.x; })
                        .attr("y2", function (d) { return d.target.y; });

                    // node
                    //     .attr("cx", function (d) { return d.x; })
                    //     .attr("cy", function (d) { return d.y; });

                    label
                        .attr("dx", function (d) { return d.x + 10; })
                        .attr("dy", function (d) { return d.y - 10; });

                    monster
                        .attr("transform", function (d) { return 'translate(' + (d.x - 10) + ',' + (d.y - 10) + ')' })
                }
            });
        }

        function setRadius() {
            if (d3.select('svg')) {
                d3.select('svg').selectAll("circle")
                    .attr("r", $ctrl.config.radius);
            }
        }

        function dragstarted(d) {
            if (!d3.event.active) simulation.alphaTarget(0.3).restart();
            d.fx = d.x;
            d.fy = d.y;
        }

        function dragged(d) {
            d.fx = d3.event.x;
            d.fy = d3.event.y;
        }

        function dragended(d) {
            if (!d3.event.active) simulation.alphaTarget(0);
        }

        $ctrl.$onInit = function () {
            init();
            getNetworkData();
        };

        $ctrl.$onChanges = function (bindings) {
            setRadius();
        };

        $ctrl.$onDestory = function () {

        };
    }

})();
(function () {
    'use strict';

    angular
        .module('visualizations')
        .component('time', {
            template: '<svg id="line1" width="960" height="500"></svg>',
            controller: TimeController,
            bindings: {},
        });

    function TimeController() {
        var $ctrl = this;

        var graph = d3.select("#line1"),
            margin = { top: 20, right: 20, bottom: 30, left: 50 },
            width = +graph.attr("width") - margin.left - margin.right,
            height = +graph.attr("height") - margin.top - margin.bottom,
            g = graph.append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");

        // set the ranges
        var x = d3.scaleLinear().range([0, width]);
        var y = d3.scaleLinear().range([height, 0]);

        // define the line
        var line = d3.line()
            .x(function (d) { return x(d.round); })
            .y(function (d) { return y(d.score); });

        d3.json("mocks/score.json", function (error, response) {
            if (error) throw error;

            var allScores = [];
            var rounds = [];
            response.forEach(function (item, index) {
                response[index] = response[index].scores.map(function (score, i) {
                    return {
                        round: i + 1,
                        score: score.total
                    }
                });
                allScores = allScores.concat(item.scores);
                rounds.push(item.scores.length);
            });

            var mostRounds = rounds.reduce(function (a, b) {
                return Math.max(a, b);
            });

            allScores = allScores.map(function (score, i) {
                return {
                    round: i + 1,
                    score: score.total
                }
            });

            // Scale the range of the data
            x.domain([1, mostRounds]);
            y.domain([0, d3.max(allScores, function (d) {
                return d.score;
            })]);

            response.forEach(function (data) {
                drawLine(data);
            });

            // Add the valueline path.
            function drawLine(data) {
                g.append("path")
                    .data([data])
                    .attr("class", "line")
                    .attr("d", line);
            }
            // Add the X Axis
            g.append("g")
                .attr("transform", "translate(0," + height + ")")
                .call(d3.axisBottom(x))
                .append("text");

            // Add the Y Axis
            g.append("g")
                .call(d3.axisLeft(y));
        });


    }
})();
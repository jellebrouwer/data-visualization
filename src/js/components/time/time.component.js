(function () {
    'use strict';

    angular
        .module('visualizations')
        .directive('time', time);

    function time() {
        return {
            restrict: 'E',
            template: '<svg id="graph"></svg>',
            link: link
        };
    }

    function link(scope, element, attrs) {
        var $ctrl = this;

        element.addClass('svg-container');

        var margin = { top: 20, right: 120, bottom: 60, left: 60 },
            width = 960 - margin.left - margin.right,
            height = 500 - margin.top - margin.bottom;

        var graph = d3.select("#graph")
            .attr("preserveAspectRatio", "xMinYMin meet")
            .attr("viewBox", "0 0 960 500")
            .attr('class', 'svg-content')
            .append("g")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

        // set the ranges
        var x = d3.scaleLinear().range([0, width]),
            y = d3.scaleLinear().range([height, 0]);

        // define the line
        var line = d3.line()
            .x(function (d) { return x(d.round); })
            .y(function (d) { return y(d.total); });

        // Color scheme
        var color = d3.scaleOrdinal(d3.schemeCategory10);

        d3.json("mocks/score.json", function (error, response) {
            if (error) throw error;

            var users = [], allScores = [], rounds = [], userNames = [];

            response.forEach(function (item, index) {
                users[index] = {
                    scores: response[index].scores.map(function (score, i) {
                        score.round = i + 1;
                        return score;
                    }),
                    user: item.user
                }
                allScores = allScores.concat(item.scores);
                rounds.push(item.scores.length);
                userNames.push(item.user.name);
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

            // Add the X Axis
            graph.append("g")
                .attr("transform", "translate(0," + height + ")")
                .attr("class", "x-axis")
                .call(d3.axisBottom(x).ticks(mostRounds));

            // Add the Y Axis
            graph.append("g")
                .attr("class", 'y-axis')
                .call(d3.axisLeft(y));

            // Label X Axis
            graph.append('text')
                .attr("text-anchor", "middle")  // transform is applied to the anchor
                .attr("transform",
                "translate(" + (width / 2) + " ," +
                (height + margin.top + 30) + ")")
                .text("Round");

            // text label for the y axis
            graph.append("text")
                .attr("transform", "rotate(-90)")
                .attr("y", 0 - margin.left)
                .attr("x", 0 - (height / 2))
                .attr("dy", "1em")
                .style("text-anchor", "middle")
                .text("Points");

            var user = graph.selectAll(".user")
                .data(users)
                .enter().append("g")
                .attr("class", "user");

            user.append("path")
                .attr("class", "line")
                .attr("d", function (d) { return line(d.scores); })
                .style("stroke", function (d) { return color(d.user.name); });

            user.append("text")
                .datum(function (d) { console.log(d.scores[d.scores.length - 1]); return { name: d.user.name, value: d.scores[d.scores.length - 1] }; })
                .attr("transform", function (d) { return "translate(" + x(d.value.round) + "," + y(d.value.total) + ")"; })
                .attr("x", 5)
                .attr("dy", ".35em")
                .text(function (d) { return d.name; });
        });


    }
})();
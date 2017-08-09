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

        .force("link", d3.forceLink()
          .id(function (d) { return d.details.id; })
          .distance(function (d) { return d.distance * 10; }))

        .force("collide", d3.forceCollide(function (d) { return 40 }))
        .force("charge", d3.forceManyBody().strength(function () { return -60; }))
        .force("center", d3.forceCenter(960 / 2, 600 / 2));
    }

    function getNetworkData() {
      d3.json("mocks/data.json", function (error, network) {

        if (error) throw error;

        var nodes = [];
        var links = [];

        // nodes
        network.employees.forEach(function (employee) {
          employee.type = 'employee';
          nodes.push({
            details: employee
          });
        });

        network.employers.forEach(function (employer) {
          employer.type = 'employer';
          nodes.push({
            details: employer
          });
        });

        // link companies
        network.employers.forEach(function (employer) {

          if (employer.id !== 'Codezilla') {
            links.push({
              source: "Codezilla",
              target: employer.id,
              distance: 15
            });
          }

        });

        // link people
        network.employees.forEach(function (employee) {
          links.push({
            source: employee.id,
            target: employee.employer,
            distance: 5
          });
        });

        // Create links
        var link = d3.select('svg').append("g")
          .attr("class", "links")
          .selectAll("line")
          .data(links)
          .enter().append("line")
          .attr("stroke-width", function (d) { return Math.sqrt(d.value); });

        var label = d3.select('svg').append("g")
          .attr("class", "labels")
          .selectAll("text")
          .data(nodes)
          .enter().append("text")
          .text(function (d) { return d.details.type === 'employee' ? d.details.id : null })
          .attr("x", 20)

        var monster = d3.select('svg').append('g')
          .attr('class', 'monsters')
          .selectAll('svg')
          .data(nodes)
          .enter()

          // inspiration: http://bl.ocks.org/eesur/be2abfb3155a38be4de4
          .append('image')
          .attr("xlink:href", function (d) { return getImageSource(d.details); })
          .attr('class', 'monster')
          .attr('width', '50px')
          .attr('height', '50px')

          .call(d3.drag()
            .on("start", dragstarted)
            .on("drag", dragged)
            .on("end", dragended));

        simulation
          .nodes(nodes)
          .on("tick", ticked);

        simulation.force("link")
          .links(links);

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

    function getImageSource(details) {
      var base = '/build/assets';
      return details.type === 'employee' ?
        base + '/monsters/' + details.imageSource :
        base + '/companies/' + details.imageSource;
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

    $ctrl.$onDestroy = function () {

    };
  }

})();
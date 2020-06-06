var csv;

// var w = 500,
var h = 300;

var w =
	d3.select('#chart').property('clientWidth') == 0 ? window.innerWidth : d3.select('#chart').property('clientWidth');

var margin = { top: 10, right: 100, bottom: 0, left: 0 },
	width = w - margin.left - margin.right,
	height = h - margin.top - margin.bottom;

var yScale = d3.scaleBand().range([ height, 0 ]).paddingInner(0.25);

var xScale = d3.scaleLinear().range([ 0, width ]).nice();

// the final line sets the transform on <g>, not on <svg>
var svg = d3
	.select('#chart')
	.append('svg')
	.attr('width', width + margin.left + margin.right)
	.attr('height', height + margin.top + margin.bottom)
	.append('g')
	.attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

// console.log(container.clientHeight);

d3.csv('data/data_clean.csv').then(function(data) {
	// put all data in a csv (for later filtering)
	csv = data;

	data.forEach(function(d) {
		d.pop = +d.pop;
		d.spending_police_pc = +d.spending_police_pc;
		d.spending_police_total = +d.spending_police_total;
		d.spending_total_pc = +d.spending_total_pc;
		d.spending_total_total = d.spending_total_total;
	});

	d3.select('#stateSelector').on('change', function() {
		selected_state = this.value;
		applyFilter(selected_state);
	});

	function applyFilter(selected_state) {
		data.sort(function(x, y) {
			return d3.ascending(x.spending_police_total, y.spending_police_total);
		});

		d3
			.select('svg')
			.attr('width', width + margin.left + margin.right)
			.attr('height', height + margin.top + margin.bottom);

		// console.log(data);

		yScale.range([ height, 0 ]).domain(
			data.map(function(d) {
				return d.state;
			})
		);

		xScale.range([ 0, width ]).domain([
			0,
			d3.max(data, function(d) {
				return d.spending_police_total;
			})
		]);

		var bars = svg.selectAll('.bar').data(data);

		bars
			.enter()
			.append('rect')
			.attr('class', 'bar')
			.attr('x', xScale(0))
			.attr('width', 0)
			.transition()
			.delay(function(d, i) {
				return i * 10;
			})
			.duration(250)
			.attr('x', 0)
			.attr('width', function(d) {
				return xScale(d.spending_police_total);
			})
			.attr('y', function(d) {
				return yScale(d.state);
			})
			.attr('height', yScale.bandwidth())
			.attr('fill', function(d) {
				if (d.state == selected_state) {
					return 'red';
				} else {
					return 'white';
				}
			});

		bars.exit().transition().duration(1000).attr('x', 0).attr('width', 0).style('fill-opacity', 1e-6).remove();

		// the "UPDATE" set:
		bars.transition().duration(1000).attr('fill', function(d) {
			if (d.state == selected_state) {
				return 'red';
			} else {
				return 'white';
			}
		});

		//// finally, css
		// make hidden display visible
		document.getElementById('hidden').style.display = 'inline-block';
		document.getElementById('footerHidden').style.display = 'block';

		// change state
		d3.select('#state').html(function(d, i) {
			return selected_state;
		});
		// change amount
		state_df = data.filter(function(d) {
			return d.state == selected_state;
		});
		var amount = state_df.map(function(d) {
			return d.spending_police_total;
		});
		document.getElementById('amount').innerHTML = formatDollar(amount);

		// change all the categories!
		document.getElementById('treatment').innerHTML = formatNumber(amount / 3100);
		document.getElementById('childcare').innerHTML = formatNumber(amount / 9600);
		document.getElementById('meals').innerHTML = formatNumber(amount / 1.4);
		document.getElementById('debt').innerHTML = formatNumber(amount / 50000);
		document.getElementById('nfp').innerHTML = formatNumber(amount / 6640);
		document.getElementById('lunches').innerHTML = formatNumber(amount / 3.22);
		document.getElementById('ppe').innerHTML = formatNumber(amount / 17.15);
	}
});

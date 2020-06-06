var formatDollar = function(d) {
	return '$' + d3.format(',.0f')(d);
};

var formatNumber = function(d) {
	return d3.format(',.0f')(d);
};

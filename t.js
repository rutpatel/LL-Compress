toBits('test');

function toBits(data){
	var len = data.length;
	var PADDING = "00000000"
	var result = '';

	for (var i = 0; i < len; i++) {
  		var compact = data.charCodeAt(i).toString(2)
  		var padded  = compact.substring(0, PADDING.length - compact.length) + compact
  		result += padded;
	}
	console.log(result);
}

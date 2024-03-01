
function hello (){
	console.log("hello world");
}


function convertDate(dateString){
    console.log("date strong : " + dateString);
	var parts = dateString.split('-');
	var day = parseInt(parts[0], 10);
	var monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
	var month = monthNames.indexOf(parts[1]);
	var year = 2000 + parseInt(parts[2], 10); // Assuming the year is in the range of 2000-2099
	return new Date(year, month, day);
}

function getIntervalDeltas(data, milestoneA, milestoneB){ //creates array
	var deltas = [];
	data.forEach(function(dataNode){
        var planned = getDifferenceDaysByDate(milestoneA, milestoneB, "planned", dataNode);
        var actual = getDifferenceDaysByDate(milestoneA, milestoneB, "actual", dataNode);
        console.log("actual, planned, actual - planned", actual, planned, actual - planned);
        if(actual != null && planned != null)
            deltas.push(actual - planned);
	});
	return deltas.sort(function(a,b){return a-b;});
}

function createActualArr(data){ //creates array
	var milestoneArr = [];
	for(var i = 1, j = 2; j < 10; i++, j++){
		var intervalArr = createIntervalArray("Milestone " + i, "Milestone " + j, "actual", data);
		milestoneArr.push(intervalArr);
	}
	return milestoneArr;
}

function createIntervalArray(milestoneA, milestoneB, type, data){
	var intervalArr = [];
	console.log("data", data)
	data.forEach(function(dataNode){
	    console.log("dataNode : ");
	    console.log(dataNode , milestoneA, milestoneB);
		if(dataNode[milestoneA][type] && dataNode[milestoneB][type])
			intervalArr.push(getDifferenceDaysByDate(milestoneA, milestoneB, type, dataNode));
	});
	console.log("interval arr: " + intervalArr);
	intervalArr = intervalArr.filter(x=>x!==undefined && x>-1);
	console.log(milestoneA,milestoneB, intervalArr.sort(function(a,b){ return a-b; }));
	return intervalArr.sort(function(a,b){ return a-b; });
}

function getDifferenceDaysByDate(milestoneA, milestoneB, type, dataNode){
    console.log(milestoneA, dataNode[milestoneA]);
    console.log(milestoneB, dataNode[milestoneB]);
	if(dataNode[milestoneB][type] && dataNode[milestoneA][type]){
	    console.log("type: " + new Date(dataNode[milestoneB][type]) + "and type 2: " +  new Date(dataNode[milestoneA][type]));
		return Math.round((new Date(dataNode[milestoneB][type]).getTime() - new Date(dataNode[milestoneA][type]).getTime()) / 86400000);
	}
}

function createIntervalMedian(intervalArr){
	var half = intervalArr.length/2;

	if(intervalArr.length %2 === 0){
		//size is even, must grab the two middle vals
		var a = intervalArr[half-1];
		var b = intervalArr[half];
		var median = Math.round((a + b)/ 2);
		return median;
	}
	else
		return intervalArr[Math.ceil(half)-1];
}

export {
    convertDate,
    getIntervalDeltas,
    createActualArr,
    createIntervalArray,
    getDifferenceDaysByDate,
    createIntervalMedian
}
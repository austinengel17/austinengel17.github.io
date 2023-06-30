
function hello (){
	console.log("hello world");
}


function convertDate(dateString){
	var parts = dateString.split('-');
	var day = parseInt(parts[0], 10);
	var monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
	var month = monthNames.indexOf(parts[1]);
	var year = 2000 + parseInt(parts[2], 10); // Assuming the year is in the range of 2000-2099
	return new Date(year, month, day);
}

function createMilestoneArr(data){
	var milestoneArr = [];
	for(i = 1, j = 2; j < 8; i++, j++){
		var intervalArr = createIntervalArray("Milestone " + i, "Milestone " + j, data);
		milestoneArr.push(intervalArr);
	}
	return milestoneArr;
}

function createIntervalArray(milestoneA, milestoneB, data){
	var intervalArr = [];
	data.forEach(function(dataNode){
		if(dataNode[milestoneA] && dataNode[milestoneB])
			intervalArr.push(getDifferenceDaysByDate(milestoneA, milestoneB, dataNode));
	});
	intervalArr = intervalArr.filter(x=>x!==undefined && x>-1);
	console.log(milestoneA,milestoneB, intervalArr.sort(function(a,b){ return a-b; }));
	return intervalArr.sort(function(a,b){ return a-b; });
}

function getDifferenceDaysByDate(milestoneA, milestoneB, dataNode){
	if(dataNode[milestoneB] && dataNode[milestoneA]){
		return Math.round((dataNode[milestoneB].getTime() - dataNode[milestoneA].getTime()) / 86400000);
	}
}

function createIntervalMedian(intervalArr){
	var half = intervalArr.length/2;

	if(intervalArr.length %2 == 0){
		//size is even, must grab the two middle vals 
		var a = intervalArr[half-1];
		var b = intervalArr[half];
		var median = Math.round((a + b)/ 2);
		return median;
	}
	else 
		return intervalArr[Math.ceil(half)-1]; 
}
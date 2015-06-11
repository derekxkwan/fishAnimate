//4321 in at 45.05, then 0420 at 48 at 1 pecks 4
var app = angular.module('animApp', []);

function animCtrl($scope, $http, $filter, $window, $interval){
var reIndex = [];
var svgId = document.getElementById("svgAnim");
$scope.seekNum = 0;
$scope.padding = 10;
$scope.arrowSize = 10;
$scope.timeStep = 10;
$scope.cirRad = 5;
//$scope.width = $window.innerWidth;
$scope.width = 900;
$scope.scaleWidth = 1;
$scope.height = 768;
$scope.timeScale = 16;
$scope.chknNum = 4;
$scope.lineSpacing = 40;
$scope.lineStart = 120;
$scope.seekBarTemp = 0;
$scope.seekBar = parseFloat(0);
$scope.playSpd = parseFloat(1);
$scope.yCoord = new Array($scope.chknNum);
$scope.factorial = function(intg){
var mult = 1;
if(intg > 2){
for(var i=1; i<=intg; i++){
mult = mult*i;

}}
return mult;
}


$scope.numTriads = $scope.factorial($scope.chknNum)/($scope.factorial($scope.chknNum - 3)*$scope.factorial(3));
//console.log($scope.numTriads);
$scope.newOrder = [];
for(i=0; i<$scope.chknNum; i++){
	$scope.newOrder.push(i+1);
	}




$scope.ycoord = [];
$scope.hierarchy = [];
for(i=0;i<$scope.chknNum;i++){
	$scope.hierarchy[i] = [];
	for(j=0;j<$scope.chknNum;j++){
	$scope.hierarchy[i][j] = 0;
}
}

$scope.chickenPeck = function(pecker,peckee){
//$scope.$apply(function(){
//0 = no relation, 1 = recessive, 2 = dominant
//1 means arrow pointing towards it
$scope.hierarchy[pecker-1][peckee-1] = 2;
$scope.hierarchy[peckee-1][pecker-1] = 1;
//console.log(pecker + "||" + peckee + "||" + $scope.hierarchy);
//})
};

//pecker,peckee start with index 1

$scope.hierGen = function(){

var hierCount = [];
var tempCount = [];
var tempOrder = [];
for(var i=0;i<$scope.chknNum;i++){
tempOrder.push(0);
}
for(var i=0;i<$scope.chknNum;i++){
	hierCount[i] = [];
	for(j=0;j<3;j++){
	hierCount[i][j]=0;}
}
for(var i=0;i<$scope.chknNum;i++){
	tempCount = [0,0,0];
	//console.log($scope.hierarchy["1"]);
	for(j=0;j<$scope.chknNum;j++){
	
	//console.log(","+$scope.hierarchy[i][j]);
	switch($scope.hierarchy[i][j]){
	case 0:
		//console.log(0);
		tempCount[0] +=1;
		break;
	case 1:
		//console.log(1);
		tempCount[1] +=1;
		break;
	case 2:
		//console.log(2);
		tempCount[2] +=1;
		break;};};
hierCount[i] = tempCount;
};
for(var i=0;i<$scope.chknNum;i++){
	if(hierCount[i][2] >= 1){
		switch(hierCount[i][1]){
		case 0:
			tempOrder[0] = i+1;
			break;
		case 1:
			tempOrder[1] = i+1;
			break;
		case 2:
			tempOrder[2] = i+1;
			break;};

}
	else{tempOrder[3] = i+1;};
}
return tempOrder;
};

$scope.subGroups = [];
$scope.subGrpStatus = [];

for(i=0;i<$scope.chknNum;i++){
	for(j=i;j<$scope.chknNum;j++){
		for(k=j;k<$scope.chknNum;k++){
			var tempStr="";
			if(i!=j && i!=k && j!=k){
			tempStr=(i+1)+","+(j+1)+","+(k+1);
			$scope.subGroups.push(tempStr);	
				}
			}
		}
	};

//console.log($scope.subGroups);

$scope.findNewOrder = function(idx){
return $scope.newOrder.indexOf(idx);





}


$scope.cirStyle = function(state){
var ret ="";
switch(state){
	case 0:
		ret = {fill: 'black'};
		break;
	case 1:
		ret = {fill: 'red'};
		break;
	case 2:
		ret = {fill: 'green'};
		break;

}
return ret;

}


$scope.checkSGStatus = function(one,two,three){
//0 = no relation, 1 = intransitive, 2 = transitive, 9 = invalidTriad
//return to 0 index
	//var indices = [[one - 1, two - 1], [one - 1, three -1], [two -1 , three - 1]];
	var indices = [one-1, two-1, three-1];
	var zeroCount=0;
	var oneCount =0;
	var twoCount = 0;
	//console.log(one+","+two+","+three);
	indices = indices.sort();
//check if valid triad
	if(one == two || one == three || two == three){
		return 9;}
	else{
//check if there's exists a relation or not
		for(var i=0; i<indices.length; i++){
			var allOnes = true;
			var allTwos = true;
			var hasZeroes = false;
			var newI = indices[i];
			for(var j=0; j<indices.length; j++){
				var newJ = indices[j];
				if(newI != newJ){
					var checkVal = $scope.hierarchy[newI][newJ];
					switch(checkVal){
					case 0:
						hasZeroes = true;
						allOnes = false;
						allTwos = false;
						break;
					case 1:
						allTwos = false;
						break;
					case 2:
						allOnes = false;
						break;

					}

				}				
				}
			if(hasZeroes){
				//missing relation
				zeroCount +=1;
				}
			else if((allOnes || allTwos)){
				//middle
				twoCount +=1;
				}
			else{
			//top or bottom
				oneCount +=1;
				}
			}
			if(zeroCount > 0){
				return 0;
				}		
			else if(oneCount == 3){
				return 1;
				}
			else{
				return 2;
			}

	}

};


$scope.checkAllSG = function(){
	var sgStatuses = [];
	angular.forEach($scope.subGroups, function(value,key){
		var indexString = value;
		var obj = {};
		var indices = indexString.split(",");
		var grpStatus = $scope.checkSGStatus(indices[0], indices[1], indices[2]);
		obj['group'] = value;
		obj['state'] = grpStatus;
		obj['hier'] = false;
		sgStatuses.push(obj);

	});
	return sgStatuses;
}

$scope.reorderSG = function(){
var oldOrder = $scope.subGroups;
var newIndex = [];
$scope.subGroups = [];
for(i=0;i<$scope.chknNum;i++){
	for(j=i;j<$scope.chknNum;j++){
		for(k=j;k<$scope.chknNum;k++){
			var tempGrp = [];
			var tempStr="";
			if(i!=j && i!=k && j!=k){
			tempGrp.push($scope.newOrder[i]);
			tempGrp.push($scope.newOrder[j]);
			tempGrp.push($scope.newOrder[k]);
			tempGrp = tempGrp.sort();
			tempStr = tempGrp.join(',');			
			$scope.subGroups.push(tempStr);	
				}
			}
		}
	};
//compare oldOrder to new Order and set transform array
for(i=0;i<$scope.subGroups.length;i++){
	for(j=0;j<$scope.subGroups.length;j++){
	if(oldOrder[i] == $scope.subGroups[j]){
		newIndex.push(j);
		}	
	}}
return newIndex;
}

$scope.semiHier = function(){
var sum = new Array(parseInt($scope.chknNum));
var semiHier = [];
//console.log($scope.hierarchy);
for(var i=0;i<$scope.chknNum; i++){
	sum[i] = 0;
	
	for(var j=0;j<$scope.chknNum; j++){
	var val = $scope.hierarchy[i][j];
	if(val == 2){
	sum[i] += 1;
	}
}

}
//console.log(sum);
for(var i=(($scope.chknNum-1)*2); i>=0; i--){
var step = "";
var returnIdx = sum.indexOf(i);
while(returnIdx != -1){
step = step+ ","+(returnIdx+1);
sum[returnIdx] = -1;
returnIdx = sum.indexOf(i);

};

if(step != ""){
step = step.slice(1);
semiHier.push(step);

}
}
//console.log(semiHier);
return semiHier;




}







$scope.chknStyle = [];
$scope.chknStyle[0] = {'stroke':'rgb(0,255,0)', 'fill':'rgb(0,255,0)'};
$scope.chknStyle[1] = {'stroke':'rgb(255,128,0)', 'fill':'rgb(255,128,0)'};
$scope.chknStyle[2] = {'stroke':'rgb(128,0,255)', 'fill':'rgb(128,0,255)'};
$scope.chknStyle[3] = {'stroke':'rgb(255,0,255)', 'fill':'rgb(255,0,255)'};
$scope.chknStyle[4] = {'stroke':'rgb(0,0,255)', 'fill':'rgb(0,0,255)'};
$scope.chknStyle[5] = {'stroke':'rgb(0,128,255)', 'fill':'rgb(0,128,255)'};

svgId.pauseAnimations();







$scope.arrows = [];
$scope.graph = {'width': $scope.width, 'height': $scope.height};




$scope.addPeckArrow = function(xCoord, pecker, peckee, timestamp, action, sg, hier, order){
var pA = {};

var newPecker = $scope.findNewOrder(pecker);
var newPeckee = $scope.findNewOrder(peckee);
//console.log(timestamp + ":" + pecker +","+peckee);
//console.log(order);
pA["x1"] = xCoord;
pA["x2"] = xCoord;
pA["y1"] = $scope.ycoord[newPecker];
pA["y2"] = $scope.ycoord[newPeckee];
pA["action"] = action;
pA["timestamp"] = timestamp;
pA["style"] = $scope.chknStyle[newPecker];
pA["sg"] = sg;
pA["hier"] = hier;
//console.log(sg.length);
//console.log(pA["y2"]);
//console.log(pA["timestamp"]);

if(newPecker > newPeckee){
pA["y2"] = pA["y2"] + $scope.arrowSize;
}
else{
pA["y2"] = pA["y2"] - $scope.arrowSize;
}
$scope.arrows.push(pA);
//console.log(','+pA["sg"][0].group+",");
};
$scope.times = [];
$scope.json = [];
	var temp  = data;
	//console.log(data);
	angular.forEach(temp, function(val,key){
	if(!isNaN(val.slice(0,1))){ 
	var temp2 = [];
	//var res = key.split(":");
	//var seconds = (res[0]*60.0*60.0)+(res[1]*60.0)+(res[2] * 1.0) + (res[3]*0.1);
//	seconds = 10.0*Math.round(seconds/10.0);
	//console.log(seconds);
	//console.log(res[0] +"," + res[1] +"," + res[2] +"," + res[3]+" ? " + seconds);
	var res = key.split("^");
	if(res[0].slice(-1) == "~"){
	var resLen = res[0].length;
	res[0] = res[0].slice(0, resLen-1);
	
	};	
	
	temp2["time"] = parseFloat(res[0]);
	temp2["timestamp"] = res[1];
	temp2["pecker"] = parseInt(val.slice(0,1));
	temp2["peckee"] = parseInt(val.slice(-1));
	temp2["action"] = val;
	$scope.json.push(temp2);}
});
$scope.json = $filter('orderBy')($scope.json, "time");

//console.log($scope.json);
//console.log($scope.json[$scope.json.length-1].timestamp);

$scope.minTime = $scope.json[0].time;
$scope.minTime = 5.0*Math.round($scope.minTime/5.0) - $scope.padding;
$scope.maxTime = $scope.json[$scope.json.length-1].time + $scope.padding;
for(i=0; i<$scope.json.length; i++){
var sg;
var twoCount =0;
var iter = $scope.json[i];
var xC = (iter.time-$scope.minTime)*$scope.timeScale;
var adj1 = iter.pecker;
var adj2 = iter.peckee;
$scope.chickenPeck(adj1, adj2);
sg = $scope.checkAllSG();
$scope.json[i]['sg'] = sg;

for(var a=0;a<sg.length;a++){
if(sg[a]["state"] == 2){
twoCount += 1;
};
if(sg[a]["state"] == 1){
twoCount = 0;
}
}
if(twoCount == $scope.numTriads){
$scope.json[i]["hier"] = $scope.hierGen();
//console.log($scope.json[i]["timestamp"]+","+$scope.json[i]['hier']);
}
else if((twoCount >= ($scope.numTriads - 2) && $scope.numTriads != twoCount)){
$scope.json[i]["hier"] = $scope.semiHier();
//console.log($scope.json[i]["timestamp"]);
}
else{$scope.json[i]["hier"] = false;};

};

$scope.newOrder = $scope.hierGen();
if($scope.newOrder.indexOf(0) != -1){
$scope.newOrder = [1,2,3,4];
};

//$scope.maxTime = $scope.json[$scope.json.length-1].xC + $scope.padding;
$scope.totTime = ($scope.maxTime-$scope.minTime)*$scope.timeScale;
reIndex = $scope.reorderSG();
//console.log($scope.subGroups);
$scope.staffLines = new Array($scope.chknNum);
for(var i=0;i<$scope.chknNum;i++){
var newLabel = $scope.newOrder[i];
$scope.ycoord[i] = ( $scope.lineStart + $scope.lineSpacing*i);
$scope.staffLines[i] = {
x1:0, 
x2:$scope.width,
y1:$scope.ycoord[i],
y2:$scope.ycoord[i],
label:newLabel,
style:$scope.chknStyle[i]
};
};

for(i=0; i<$scope.json.length; i++)
{
var iter = $scope.json[i];
var xC = (iter.time- $scope.minTime) * $scope.timeScale;
var adj1 = iter.pecker;
var adj2 = iter.peckee;
var hier = iter.hier;
var sg = [];
//console.log(xC);
for(j=0;j<iter.sg.length;j++){
var newIdx = reIndex[j];
var order = $scope.newOrder;
sg.push(iter.sg[newIdx]);

}

$scope.addPeckArrow(xC, adj1, adj2, iter.timestamp, iter.action, sg, hier, order);
};
$scope.timeRuler = [];
for(i=$scope.minTime; i<$scope.maxTime; i=i+$scope.timeStep){
var temp3 = [];
var hours, minutes, seconds, minuteString, secondString;
temp3["time"]=(i-$scope.minTime)*$scope.timeScale;
hours = parseInt(i/3600) % 24;
minutes = parseInt(i/60) % 60;
seconds = i % 60;
if(minutes<10){minuteString = "0"+minutes;}else{minuteString=minutes;};
if(seconds<10){secondString = "0"+seconds;}else{secondString = seconds;};
temp3["timestamp"] = hours+ ":" + minuteString + ":" + secondString;
$scope.timeRuler.push(temp3);
};







//$scope.parseJson();


$scope.buttonText = "play";
$scope.playButt = false;
$scope.playPause = function(){



$scope.playButt = !$scope.playButt;
//$scope.seekBar = $scope.seekBarTemp;
//console.log($scope.playButt);
if($scope.playButt == false){
$scope.buttonText = "play";
}
else if($scope.playButt == true){

$scope.buttonText = "pause";

$scope.play();
}

}


$scope.mouseDown = function(){

if($scope.buttText =="pause" && $scope.playButt == true){


$scope.playButt = false;}


}
$scope.mouseDown = function(){


if($scope.buttText =="pause" && $scope.playButt == false){


$scope.playButt = true;}



}

$scope.pause = function(){

$scope.seekBarTemp = $scope.seekBar;
$interval.cancel($scope.scrollArrows);
$scope.scrollArrows = undefined;
if($scope.playButt == true){

$scope.playPause();
}

}
$scope.play = function(){

//console.log($scope.seekBar)
//$scope.seekBar = $scope.seekBarTemp;// $scope.seekBarTemp;
$scope.scrollArrows = $interval(function(){

//$scope.left = document.getElementById("timeline").getAttribute("transform");
//$scope.left = $scope.left.split("(");
//$scope.left = $scope.left[1].split(",");
//$scope.left = $scope.left[0];
//console.log($scope.left);
if(($scope.seekBar <$scope.totTime) && $scope.seekBar >= 0 && $scope.playButt == true){

$scope.seekBar = parseFloat($scope.seekBar) + parseFloat($scope.playSpd)*4.1;
$scope.seekNum = $scope.seekBar/$scope.totTime;
//console.log("HIT"); 
}},1); 

};


$scope.drawDist = function(val){
//var botLim = Math.abs($scope.seekBar+$scope.padding)/$scope.scaleWidth;
//var topLim = Math.abs($scope.seekBar+$scope.width-$scope.padding)/$scope.scaleWidth*$scope.timeScale;
var botLim = Math.abs($scope.seekBar)/$scope.scaleWidth;
var topLim = Math.abs($scope.seekBar + $scope.width)/$scope.scaleWidth;
if(val > botLim && val < topLim){
//console.log(val);
return true;

}
else{
return false;
}

}
//$scope.left = document.getElementById("timeline").getAttribute("transform");

/*
$scope.scrollArrows = $interval(function(){
if(($scope.seekBar < ($scope.maxTime - $scope.minTime)) && $scope.seekBar >= 0 && $scope.playButt == true){
$scope.seekBar = parseInt($scope.seekBar) + $scope.playSpd*1.0;


}


$scope.seekBarTemp= $scope.seekBar;
}, 20);

*/

$scope.enterNum = function(){
$scope.seekBar = $scope.seekNum * $scope.totTime;

}

//console.log($scope.hierGen());
}

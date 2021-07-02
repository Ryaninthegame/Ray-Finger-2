// record input
var _interval;
var _keyboard;
var _mouse;
var _binary;

// paramater set up
var _round;
var _hitSuccessCount;
var _clickCount;

// game flag
var _playMode;
var _endMode;

// time
var _count;
var _second;
var _mSecond;

var _typeSet = ["leftTop", "rightTop", "rightBotton", "leftBotton"];
var _keycapeSet = ["Q", "W", "E", "R", "A", "S", "D", "F", "1", "2", "3", "4"];
var _colorOrder = ["gray", "purple", "green", "blue", "orange"];

main();

function main(){
	textAnimation("opening");
	processControl();
	playControl();
}

// disable right-click menu
document.oncontextmenu = function(){
	return false
}; 

// detect mouse click
document.body.onmouseup = function(e){     
	_clickCount += 1;
	if(e.button==2){     
		_binary = "right"; 
	}
	else if(e.button==0){
		_binary = "left";     
	}
	if(_playMode) hit();
};

function timer() {
	_count += 1;
	var timerDiv = document.getElementById("timer");
	_second = Math.floor(Math.floor(_count/100));
	_mSecond = _count%100;
	timerDiv.innerHTML = _second + ":" + _mSecond;	
}

// opening and ending text
function textAnimation(state){
	switch(state){
		case "opening" :
			var container = document.getElementById("container");
			var text = document.createElement("div");
			text.setAttribute("class", "openingText");
			text.setAttribute("id", "openingText");
			text.innerHTML = "Press Space to Start";
			text.classList.add("effect");
			container.appendChild(text);
			break;
		case "ending" :
			var canvas = document.getElementById("canvas");
			var text = document.createElement("div");
			text.setAttribute("class", "endingText");
			text.innerHTML = "Press Space to Restart";
			text.classList.add("effect");
			canvas.appendChild(text);
			break;
	}
}

function initSetUp(){
	_interval = null;
	_keyboard = null;
	_mouse = null;
	_binary = null;
	_round = 5;
	_hitSuccessCount = 0;
	_clickCount = 0;
	_playMode = 0;
	_endMode = 0;
	_count = 0;
	_second = 0;
	_mSecond = 0;

	var container = document.getElementById("container");
	while(container.hasChildNodes()){
		container.removeChild(container.lastChild);
	}
	
	var head = document.createElement("div");
	head.setAttribute("class", "head");
	head.setAttribute("id", "head");
	head.innerHTML = "Ray Finger";

	var timer = document.createElement("div");
	timer.setAttribute("class", "timer");
	timer.setAttribute("id", "timer");
	
	var canvas = document.createElement("div");
	canvas.setAttribute("class", "canvas");
	canvas.setAttribute("id", "canvas");
	
	container.appendChild(head);
	container.appendChild(timer);
	container.appendChild(canvas);
}

function ending(){
	clearInterval(_interval); 
	var container = document.getElementById("container");
	var canvas = document.getElementById("canvas");
	for(var i=1; i<7; i++){
		var div = document.createElement("div");
		div.setAttribute("class", "information");
		div.setAttribute("id", "information-"+i);
		for(var j=1; j<3; j++){
			var text = document.createElement("div");
			text.setAttribute("class", "text-"+j);
			text.setAttribute("id", "text-"+j);
			div.appendChild(text);
		}
		canvas.appendChild(div);
		settlement(i);
	}
	textAnimation("ending");
}

// final settlement detail
function settlement(index){
	var information = document.getElementById("information-"+index);
	var text_left = information.childNodes[0];
	var text_right = information.childNodes[1];
	switch(index){
		case 1 : 
			text_left.innerHTML = "APM : ";
			text_right.innerHTML = estimateAPM();
			break;
		case 2 : 
			text_left.innerHTML = "Hit Success : ";
			text_right.innerHTML = _hitSuccessCount;
			break;
		case 3 : 
			text_left.innerHTML = "Hit Fail : ";
			text_right.innerHTML = (_clickCount-_hitSuccessCount);
			break;
		case 4 : 
			text_left.innerHTML = "Hit Success Rate : ";
			text_right.innerHTML = (_hitSuccessCount/_clickCount).toFixed(3)+"%";
			break;
		case 5 : 
			text_left.innerHTML = "Hit Fail Rate : ";
			text_right.innerHTML = ((_clickCount-_hitSuccessCount)/_clickCount).toFixed(3)+"%";
			break;
	}
}

function estimateAPM(){
	var numRound = 5;
	var numPattern = 5;
	var mSecond = parseFloat(_mSecond/100);
	var minute = parseFloat((_second+mSecond)/60).toFixed(5);
	var APM = parseFloat((numRound*numPattern*2)/minute).toFixed(3);
	return APM;
}

// control start and restart
function processControl(){
	var processHandler = function(e){
		if(!_playMode && e.keyCode==32){
			// press space to start
			initSetUp();
			generatePattern();
			_interval = setInterval("timer()", 10);
			_playMode = 1;
		}
	};
	document.addEventListener("keydown", processHandler);
}

// detect which button clicked when play
function playControl(){
	var playHandler = function(e){
		switch(e.keyCode){
			case 49 : // press 1
				_keyboard = "1";
				break;
			case 50 : // press 2
				_keyboard = "2";
				break;
			case 51 : // press 3
				_keyboard = "3";
				break;
			case 52 : // press 4
				_keyboard = "4";
				break;
			case 81 : // press Q
				_keyboard = "Q";
				break;
			case 87 : // press W
				_keyboard = "W";
				break; 
			case 69 : // press E
				_keyboard = "E";
				break;
			case 82 : // press R
				_keyboard = "R";
				break;
			case 65 : // press A
				_keyboard = "A";
				break;
			case 83 : // press S
				_keyboard = "S";
				break; 
			case 68 : // press D
				_keyboard = "D";
				break;
			case 70 : // press F
				_keyboard = "F";
				break;
		}
	};
	document.addEventListener("keydown", playHandler);
}

function hit(){
	var inspect = 0;
	var canvas = document.getElementById("canvas");
	// check hit success or hit fail
	while(canvas.hasChildNodes() && inspect!=5) {
		var checkedPattern = canvas.lastChild;
		if(_keyboard==_mouse && _binary==checkedPattern.binary && checkedPattern.clicked==0){
			console.log("hit success");
			_hitSuccessCount++;
			_keyboard = null;
			_mouse = null;
			_binary = null;
			canvas.removeChild(checkedPattern);
			console.log("hit success : " + _hitSuccessCount);
			console.log("click count : " + _clickCount);
		}
		else{
			checkedPattern.clicked = 1;
		}
		inspect++;
	}   
	// check whether final round
	if(!canvas.hasChildNodes() && _round>0){
		generatePattern();
	}
	else if(!canvas.hasChildNodes() && _round==0){
		_playMode = 0;
		ending();
	}
}

// pattern object
function newKeycap(type, keycape, x, y, color) {
	var circle = document.createElement("div");
	circle.setAttribute("class", "circle_"+type);
	circle.setAttribute("id", "circle_"+type);
	circle.style.left = x+"px";
	circle.style.top = y+"px";
	circle.style.backgroundColor = color;
	circle.clicked = 1;
	
	var quarter = document.createElement("div");
	quarter.setAttribute("class", "quarter_"+type);
	quarter.setAttribute("id", "quarter_"+type);
	
	quarter.addEventListener('mousedown', function(e){  
		circle.clicked -= 1;
		if(e.button==2){     
			_mouse = keycape;
		}
		else if(e.button==0){
			_mouse = keycape;
		}
	});
	
	var text = document.createElement("span");
	text.setAttribute("class", "text_"+type);
	
	switch(type){
		case "leftTop":
			circle.binary = "left";
			quarter.style.left = 0+"px";
			quarter.style.top = 0+"px";
			text.style.left = 10+"px";
			text.style.top = -25+"px";
			text.innerHTML = keycape;
			break;
		case "rightTop":
			circle.binary = "right";
			quarter.style.left = 25+"px";
			quarter.style.top = 0+"px";
			text.style.left = -10+"px";
			text.style.top = -25+"px";
			text.innerHTML = keycape;
			break;
		case "rightBotton":
			circle.binary = "right";
			quarter.style.left = 25+"px";
			quarter.style.top = 25+"px";
			text.style.left = -10+"px";
			text.style.top = -45+"px";
			text.innerHTML = keycape;
			break;
		case "leftBotton":
			circle.binary = "left";
			quarter.style.left = 0+"px";
			quarter.style.top = 25+"px";
			text.style.left = 10+"px";
			text.style.top = -45+"px";
			text.innerHTML = keycape;
			break;
	}
	circle.appendChild(quarter);
	circle.appendChild(text);
	return circle;	
}

// generate pattern, generate once, _round minus one
function generatePattern(){
	_round -= 1;
	var canvas = document.getElementById("canvas");
	for(var i=0; i<_colorOrder.length; i++){
		// random pick type from _typeSet
		var type = _typeSet[Math.floor(Math.random()*_typeSet.length)];
		// random pick keycape from _keycapeSet
		var keycape = _keycapeSet[Math.floor(Math.random()*_keycapeSet.length)];
		var color = _colorOrder[i];
		var x = Math.floor(Math.random()*(900-50)+50);
		var y = Math.floor(Math.random()*(350-50)+50);
		var pattern = newKeycap(type, keycape, x, y, color);
		canvas.appendChild(pattern);
	}
}


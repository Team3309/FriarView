var inputString="";
var maxVal= 255;
var minVal=0;
var maxDigits = 3;
var windowId;

onload = function(){
	//Onclick needs just a function to, so the addNum(inVal) is wrapped
	document.getElementById('one').onclick = function(){addNum('1');};
	document.getElementById('two').onclick = function(){addNum('2');};
	document.getElementById('three').onclick = function(){addNum('3');};
	document.getElementById('four').onclick = function(){addNum('4');};
	document.getElementById('five').onclick = function(){addNum('5');};
	document.getElementById('six').onclick = function(){addNum('6');};
	document.getElementById('seven').onclick = function(){addNum('7');};
	document.getElementById('eight').onclick = function(){addNum('8');};
	document.getElementById('nine').onclick = function(){addNum('9');};
	document.getElementById('zero').onclick = function(){addNum('0');};
	document.getElementById('backspace').onclick = del;

	document.getElementById('ok').onclick = ok;
	document.getElementById('cancel').onclick = cancel;

	windowId = chrome.app.window.current().id;
	$('#pramName').html('<span>'+ windowId + '</span>');
}

function addNum(inVal){
	//Adds digits
	inputString= inputString + inVal;
	if(inputString.length>maxDigits) inputString= inVal;
	//Updates value window
	$('#textBox').val(inputString);
}

function ok(){
	var inputValue = inputString.valueOf();
	var parentWin = chrome.app.window.get("mainWindow");
	//Limits input value to max/min
	if(inputValue>maxVal){
		inputValue=maxVal;
	}
	if(inputValue<minVal){
		inputValue=minVal;
	}

	//Returns user input to main window
	//This area is specific to the rest of the program
	switch(windowId){
			case "r1":
				//Alters Value in main window
				window.opener.ledState[1]= inputValue;
				window.opener.sendUpdate();
			break;
			case "g1":
				//Alters Value in main window
				window.opener.ledState[5]= inputValue;
				window.opener.sendUpdate();
			break;
			case "b1":
				//Alters Value in main window
				window.opener.ledState[9]= inputValue;
				window.opener.sendUpdate();
			break;
			case "r2":
				//Alters Value in main window
				window.opener.ledState[13]= inputValue;
				window.opener.sendUpdate();
			break;
			case "g2":
				//Alters Value in main window
				window.opener.ledState[17]= inputValue;
				window.opener.sendUpdate();
			break;
			case "b2":
				//Alters Value in main window
				window.opener.ledState[21]= inputValue;
				window.opener.sendUpdate();
			break;
			case "r3":
				//Alters Value in main window
				window.opener.ledState[25]= inputValue;
				window.opener.sendUpdate();
			break;
			case "g3":
				//Alters Value in main window
				window.opener.ledState[29]= inputValue;
				window.opener.sendUpdate();
			break;
			case "b3":
				//Alters Value in main window
				window.opener.ledState[33]= inputValue;
				window.opener.sendUpdate();
			break;
		default:
			break;
		}
	//Closes this window
	close();
}

function cancel(){
	//Closes this window
	close();
}

function del(){
	inputValue= inputValue.slice(0,-1);
	$('#textBox').val(inputValue);
}
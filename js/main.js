var onReceive;
var odometer;
var battery;
var clock;
var dataObject;

//Object for serial connection
var connection = null;


/**
 * Entry point for the application. Sets up the UI elements data and
 * behaviour.
 */
onload = function() {
	'use strict';

	document.getElementById('openPort').onclick = openSerial;
	document.getElementById('closePort').onclick = closeSerial;
	document.getElementById('refreshPort').onclick = refreshPorts;

	document.getElementById('resetClock').onclick = resetClock;
	document.getElementById('pauseClock').onclick = pauseClock;
	document.getElementById('startClock').onclick = startClock;



	//Program Enter Key to Execute Serial Command
	$('#cmdText').keypress(function(event){
	    var keycode = (event.keyCode ? event.keyCode : event.which);
	    if(keycode == '13')execute();
	});

//Creates Clock
var date = new Date('1983-05-13 12:00:00 am');
clock = new FlipClock($('.divClock'), date, 
		{
			countdown: false,
			autoStart: false,
			clockFace: 'TwelveHourClock'
		}
);

//Creates Gages
	odometer = new steelseries.Odometer('canvasOdometer', {
				digits: 2

	});

	battery = new steelseries.Battery('canvasBattery', {
				size: 600,
				value: 0
	});

	//Populate portList Dropdown
	refreshPorts();

}; //End of onLoad Function


//For NumberPad
function changeValue(valueId){
	var numWidth = Math.round(window.innerWidth * .3);
   	var numHeight = Math.round(window.innerHeight * .8);
	var numPadProperties = {
		id: valueId,
		bounds: {
			width: numWidth,
			height: numHeight
		},
		frame: 'none'
	};
	chrome.app.window.create('numPad.html',numPadProperties);

}




/* SERIAL PORT CONTROL FUNCTIONS
 * Set of functions used to control the serial port connection
 *
 * openSerial()- creates a connection the the serial port selected in the dropdown
 * closeSerial()- closes the connection
 * refreshPorts()- fetches available ports and populates the dropdown
 * execute()- sends what's in the command box through the serial port
 * sendSerial(buffer)- sends what's in the buffer down the port
 */
function updateDisplay ()
{
	var secondsRemain = dataObject.timeInt;
	var batteryPercent = (secondsRemain/15)*100;

	battery.setValue(batteryPercent);
	odometer.setValue(secondsRemain);

}


function refreshPorts() {
	serial_lib.getDevices(function(ports) {
			var dd = $('#portDropdown');
			dd.empty();
			dd.append($('<option>Select Port...</option>'));
			for (var i = 0; i < ports.length; i++) {
			dd.append($('<option>' + ports[i].path+ '</option>')
		  	.attr({ val: ports[i].path}).addClass('text'));
			}
	});
}

function closeSerial(){
	if (connection !== null) {
		connection.close();
	}
}

function onSerialClose(){
	connection = null;
	console.log("-----Port Closed-----");
	packet = [];
	console.log('Serial port closed');
	zeroDisplay();

    $('#serialStatus').html('<span style="color:red">Port Closed</span>');
}

function sendSerial(message){
	if (connection == null) {
	 console.log("Serial Port Not Open!");
	  return;
	}
	if (!message) {
	  console.log("Nothing to send!");
	  return;
	}
    connection.send(message);
    console.log(message);
}



function sendRawSerial(message){
	if (connection == null) {
	 console.log("Serial Port Not Open!");
	  return;
	}
	if (!message) {
	  console.log("Nothing to send!");
	  return;
	}
	connection.sendRaw(message);
    //console.log("Raw Message Sent");
}

function openSerial(){
	//console.log("openSerial Called");
	//Fetch selection from dropdown
	var path = $('#portDropdown').val();
	//Opens the port
    serial_lib.openDevice(path, onOpen);

}

function onSerialError(){
	closeSerial();
	console.log("Serial Port Error!");
}

//Function called after opening a serial port
var onOpen = function(newConnection)
{
    if (newConnection == null)
    {
      console.log("Failed to open port!");
      return;
    }
    connection = newConnection;
    connection.onReceive.addListener(bufferLine);
    connection.onError.addListener(onSerialError);
    connection.onClose.addListener(onSerialClose);
    console.log("Port opened.");
    console.log(">>>Port Open<<<");
    $('#serialStatus').html('<span style="color:green">Port Open</span>');
    //chrome.tts.speak('Port Open');
};

// Collect serial data into one line.
// Necessary in case a packet spans across multiple listen calls.
// This implementation is for a simple string packet.
var packet= [];

function bufferLine(newData)
{
	var bufView = new Uint8Array(newData);

	for (var i = 0; i < bufView.length; i++)
	{

		if(bufView[i] == 36)
		{
			packet = [];
			payloadLength = 0;
		}

		packet.push(bufView[i]);

		if(bufView[i] == 35)
		{
			parsePacket(packet);
			//console.log("Recieved:")
			//console.log(packet);
		}
	}
}

function parsePacket(newPacket)
{
	dataObject = [];
	//dataObject["timeRemain"] = newPacket[1].toString()*10 + newPacket[2] + newPacket[3]/10 + newPacket[4]/100 + newPacket[5]/1000;
	dataObject["timeRemain"] = String.fromCharCode(newPacket[1]) + String.fromCharCode(newPacket[2]) + "." + String.fromCharCode(newPacket[3]);
	dataObject["timeInt"] = parseFloat(dataObject.timeRemain);
	updateDisplay();
	console.log(dataObject);
}


function execute()
{
	var buffer;
	var line;
	line =  $('#cmdText').val();
	buffer= $('#cmdText').val() + "\n";
	$('#cmdText').val("");
	sendSerial(buffer);
}

function ab2str(buf)
{
	var bufView = new Uint8Array(buf);
	var encodedString = String.fromCharCode.apply(null, bufView);
	return decodeURIComponent(escape(encodedString));
}

function zeroDisplay()
{
	battery.setValue(0);
	odometer.setValue(0);
}

function resetClock()
{
	clock.stop();
	var date = new Date('1983-05-13 12:00:00 am');
	clock.setTime(date);
}

function startClock()
{
	clock.start();
}

function pauseClock()
{
	clock.stop();
}
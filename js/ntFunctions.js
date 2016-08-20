function onRobotConnection(connected) 
{
	console.log("connected to robot: ");
	console.log(NetworkTables.getRobotAddress());
}

function onNetworkTablesConnection(connected) 
{
	if (connected) {
		console.log("Table Connected");
		
	} else {
		console.log("Table Disconnected");
	}
}

function onValueChanged(key, value, isNew) 
{
	if (isNew) {
		console.log("got new Value");
	} else {
		console.log("got old Value");
	}
}
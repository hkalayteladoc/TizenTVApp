/**
 * Teladoc Helath Inc. Copyright (c) 2023. All rights reserved.
 */


var keyNameColorF0Red = "ColorF0Red";
var keyNameColorF1Green = "ColorF1Green";
var keyNameColorF2Yellow = "ColorF2Yellow";
var keyNameColorF3Blue = "ColorF3Blue";


//var checkTime;
//var stopPostPoll = false;

var workerThread = null;

//var serverAddress = "a11611it.ith.local";
var serverAddress = "10.231.64.3"; // ip for "a11611it.ith.local";
//var serverAddress = "192.168.64.1" ; //"a11562it.teladoc.net";
var serverPort = "8000";

var serverPostIntervalID = 0; // the ID returned by setInterval

var videoSources = null;	// video sources as returned by tizen
var currentVideoSource = null; 
var portMap = new Map();
var ports = [];

var alarmObj = null;

const memStatusID = "memStatus";
const cpuStatusID = "cpuStatus";

var periodicInfoData = {};  // CPU and memory Status 

var systemInfoData = 
	{
	};	 // json object

/*
let systemInfo = {
	    //totalMemoryBytes : 0,
	    //totalMemoryGiBytes: 0,
	    
	    //availableMemoryBytes: 0,
	    //availableMemoryGiBytes: 0,
	    
		//tvModel: "",
		//tvManufacturer: "",
		//tvBuildVersion: "",

		
		//errorMessages: [],
};
*/




//Initialize function
var init = function () 
{
    // TODO:: Do your initialization job
    console.log('init() called');
    
    document.addEventListener('visibilitychange', function()
    {
        if(document.hidden)
        {
            // Something you want to do when hide or exit.
        }
        else
        {
            // Something you want to do when resume.
        }
    });
 
    // add eventListener for keydown
    document.addEventListener('keydown', function(e)
    {
    	console.log(e);
    	switch(e.keyCode)
    	{
    	case 37: //LEFT arrow
    		focusPreviousTabIndex();
    		break;
    	case 38: //UP arrow
    		e.preventDefault();
    		focusUp();
    		break;
    	case 39: //RIGHT arrow
    		focusNextTabIndex();
    		break;
    	case 40: //DOWN arrow
    		e.preventDefault();
    		focusDown();
    		break;
    	case 13: //OK button
    	case 32: //OK button
    		ButtonClick();
    		break;

    		console.log(e);
    		break;
    		
    	case 10009: //RETURN button
		tizen.application.getCurrentApplication().exit();
    		break;
    	default:
    		console.log('Key code : ' + e.keyCode);
    		break;
    	}
    	
    	switch(e.code)
    	{
    	case keyNameColorF0Red:
    	case "F1":
    		//console.Log("here");
			var msg = {};
			msg.id = "changePort";
			msg.data = "APP";
			workerThread.postMessage(JSON.stringify(msg));
    		break;
    		
    	case keyNameColorF1Green:
    	case "F2":
    		SelectThePort(1);
    		theFocusedElem = document.getElementById('changePortButton');
    		theFocusedElem.focus();
    		ButtonClick();
    		break;
    		
    	case keyNameColorF2Yellow:
    	case "F3":
    		SelectThePort(2);
    		theFocusedElem = document.getElementById('changePortButton');
    		theFocusedElem.focus();
    		ButtonClick();
    		break;
    		
    	case keyNameColorF3Blue:
    	case "F4":
    		SelectThePort(3);
    		theFocusedElem = document.getElementById('changePortButton');
    		theFocusedElem.focus();
    		ButtonClick();
    		break;
    		
    	
    	default:
    		console.log('Key code : ' + e.keyCode);
    		break;
    	}
    	
    	
    });

	//tizen.systeminfo.getPropertyValue("VIDEOSOURCE", ReadPortsAndFillSelector);
    allTabIndexElems = document.querySelectorAll('[tabindex]');
    tabIndexCount = allTabIndexElems.length;

    
	workerThread = new Worker("js/ServerCommThread.js");
	workerThread.onmessage = WorkerMessage;

	var serverInfo = {};
	serverInfo.serverAddress = serverAddress; 
	serverInfo.serverPort = serverPort;

	var msg = {};
	msg.id = "ServerInfo";
	msg.data = JSON.stringify(serverInfo);
	workerThread.postMessage(JSON.stringify(msg));
    
    
    RegisterKeys();
    
    
	ReadDeviceInfo();
	setTimeout(function() {FillSelector(); DisplayDeviceInfo(); }, 500);
	
	//setTimeout(StartPostPoll, 5000);
	
	//console.log(tizen);


	setTimeout(function() {
		
					var responseMsg = {};
					responseMsg.id = "portInfo"; 
					responseMsg.data = ports;
					workerThread.postMessage(JSON.stringify(responseMsg));

					responseMsg = {};
					responseMsg.id = "tvInfo"; 
					responseMsg.data = systemInfoData;
					workerThread.postMessage(JSON.stringify(responseMsg));
		
					var msg = {};
					msg.id = "SendInfo";
					msg.data = "";
					workerThread.postMessage(JSON.stringify(msg));
			}, 1000);
	
	/*
	workerThread = new SharedWorker("js/ServerCommThread.js");
	workerThread.port.onmessage = WorkerMessage;
	workerThread.port.start();
	var msg = {};
	msg.id = "tizenObj";
	msg.data = tizen;
	workerThread.postMessage(JSON.stringify(msg));
*/

	//alarmObj = new tizen.AlarmRelative( 1 * tizen.alarm.PERIOD_MINUTE);
	/* Tizen alias ID is deprecated since Tizen 2.3.1 */
	//tizen.alarm.add(alarmObj, 'NUnjKlo9R7.TdocProto');
	//tizen.alarm.add(alarmObj, 'tizen.internet');
	
	//setInterval(disp,5000);
	
	//setTimeout(HideMe, 10000);
	
	
	
	/*
	var reqAppControl = tizen.application.getCurrentApplication().getRequestedAppControl();
	if (reqAppControl)
	{
		  console.log("Requester : " + reqAppControl);
		console.log("Requester AppID: " + reqAppControl.callerAppId);
		  console.log("Requester appcontrol op: " + reqAppControl.appControl.operation);
		  console.log("Requester appcontrol uri: " + reqAppControl.appControl.uri);
		  console.log("Requester appcontrol mime: " + reqAppControl.appControl.mime);
		  console.log("Requester appcontrol cat: " + reqAppControl.appControl.category);
	
		  	/ *

	  var appControl = reqAppControl.appControl;
	  if (appControl.operation == "http://tizen.org/appcontrol/operation/pick")
	  {
	    var data = new tizen.ApplicationControlData(
	        "http://tizen.org/appcontrol/data/selected", ["Image1.jpg"]);
	    reqAppControl.replyResult([data]);
	  }
	  * /
	}
	
	*/
	
	
};


function SelectThePort(num)
{
	var elems = document.getElementsByName('portSelector');
	for(var i = 0; i < elems.length; i++)
	{
		if((i+1) === num)
		{
			elems[i].checked = true;
			return elems[i]; 
		}
	}
	
	// if it's here. none are checked
	elems[0].check = true;
	return elems[0];
}


function RegisterKeys()
{
	tizen.tvinputdevice.registerKey(keyNameColorF0Red);
	tizen.tvinputdevice.registerKey(keyNameColorF1Green);
	tizen.tvinputdevice.registerKey(keyNameColorF2Yellow);
	tizen.tvinputdevice.registerKey(keyNameColorF3Blue);
}



// window.onload can work without <body onload="">
window.onload = init;


function DisplayDeviceInfo()    
{
	var tableObject = document.getElementById("infoTable");

	InsertRowColumn(tableObject, 
			"Available Memory", periodicInfoData.availableMemoryGiBytes.toFixed(2) + "GB (" + periodicInfoData.availableMemoryBytes + ")", 
			"CPU", periodicInfoData.cpuLoad, memStatusID, cpuStatusID);
	
	InsertRowColumn(tableObject, 
			"Total Memory", systemInfoData.totalMemoryGiBytes.toFixed(2) + "GB (" + systemInfoData.totalMemoryBytes + ")",
			"Profile Name", systemInfoData.profileName );			
			
	const versionString = "Core-" + systemInfoData.coreAPIver + ", Native-" + systemInfoData.nativeAPIver + 
					", Platform Web-" + systemInfoData.platformWebAPIver;
	
	InsertRowColumn(tableObject, 
			"Platform Version", systemInfoData.platformVerName + " " + systemInfoData.platformver, 
			"API Versions", versionString);
	
	InsertRowColumn(tableObject, 
			"TV Model", systemInfoData.tvModel,  
			"Manufacturer", systemInfoData.tvManufacturer);
	
	InsertRowColumn(tableObject, 
			"Build Version", systemInfoData.tvBuildVersion,  
			"Locale", systemInfoData.language /*+ " / " + systemInfoData.country*/);

	var resolutionString = systemInfoData.resolutionWidth + " x " + systemInfoData.resolutionHeight;  
	resolutionString += " (" + systemInfoData.dotsPerInchWidth + " x " + systemInfoData.dotsPerInchHeight + " DPI)";  
	resolutionString += " Physical: " + systemInfoData.physicalWidth.toFixed(2) + " x " + systemInfoData.physicalHeight.toFixed(2);  
	
	InsertRowColumn(tableObject, 
			"Resolution", resolutionString,  
			"Brightness", systemInfoData.brightness.toFixed(2));

	
	var networkStatus = "Wifi(" + systemInfoData.WiFiStatus + ") Ethernet (" + systemInfoData.EthernetStatus + ")";
	var ipString = systemInfoData.ssid + " - " + systemInfoData.ipAddress;  

	InsertRowColumn(tableObject, 
			"Network", networkStatus,  
			"IP Address", ipString);
	
}


function  InsertRowColumn(tableObject, label1, value1, label2, value2, cell2Name, cell5Name)
{
    var rowCount = tableObject.rows.length;  
    var row = tableObject.insertRow(rowCount-2);  

    var cell1 = row.insertCell(0);  
    var cell2 = row.insertCell(1);  
    var cell3 = row.insertCell(2);  
    var cell4 = row.insertCell(3);  
    var cell5 = row.insertCell(4);  

    cell1.innerHTML = label1;
    cell2.innerHTML = value1;
    if(cell2Name != undefined)
    {
    	cell2.id = cell2Name;
    }
    
    cell3 = "&nbsp;&nbsp;";
    cell4.innerHTML = label2;
    cell5.innerHTML = value2;
    if(cell5Name != undefined)
    {
    	cell5.id = cell5Name;
    }
	
}


function FillSelector()
{
	var portSelectorElem = document.getElementById('portSelection');
	//var currentVideoSource = tizen.tvwindow.getSource();
	var currentPortName = currentVideoSource.type + currentVideoSource.number;
	console.log(currentPortName);
	
	var portNameApp = "APP";
	var msg = {};
	msg.id = "SetPort";
	msg.data = portNameApp;
	workerThread.postMessage(JSON.stringify(msg));

    let input = document.createElement("input");
    input.type = "checkbox";
    input.id = portNameApp;
    input.name = "portApp";
    input.checked = true;
    input.disabled = true;
    //tabIndexCount++;
    //input.setAttribute("tabindex", tabIndexCount.toString());
    //console.log(input);

    let label = document.createElement("label");
    label.innerText = portNameApp;
    //label.setAttribute("class", "checkLabel");
    //label.setAttribute("for", portNameApp);
    
    //input.appendChild(label);
    
    portSelectorElem.appendChild(input);		
    portSelectorElem.appendChild(label);		
	
	
	//videoSources = systemInfo.videoSources;
	for(var i = 0; i < videoSources.connected.length; i++)
	{
		var portName = videoSources.connected[i].type + videoSources.connected[i].number; 
		
		var isChecked = false;
		if(currentPortName === portName)
		{
			//isChecked = true;
			
			//var msg = {};
			//msg.id = "SetPort";
			//msg.data = portName;
			//workerThread.postMessage(JSON.stringify(msg));
			
		}
		
	    AddPortOption(portSelectorElem, portName, isChecked)
	    
	}
	
	
    allTabIndexElems = document.querySelectorAll('[tabindex]');
    tabIndexCount = allTabIndexElems.length; 
	//console.log("allTabIndexElems-1: " + allTabIndexElems.length);
    
    focusNextTabIndex();	// make sure there is a focus
	
}


function AddPortOption(portSelectorElem, portName, isChecked)
{
	    let input = document.createElement("input");
	    input.type = "radio";
	    input.id = portName;
	    input.name = "portSelector";
	    input.checked = isChecked;
	    tabIndexCount++;
	    input.setAttribute("tabindex", tabIndexCount.toString());
	    //console.log(input);

	    let label = document.createElement("label");
	    label.innerText = portName;
	    label.setAttribute("class", "radioLabel");
	    label.setAttribute("for", portName);
	    
	    //input.appendChild(label);
	    
	    portSelectorElem.appendChild(input);		
	    portSelectorElem.appendChild(label);		
	
}



var allTabIndexElems;
var theFocusedElem = null;
var counter = 0;
var tabIndexCount=0;

function focusTheTabIndex( index )
{
	//console.log("focusTheTabIndex : " + index);
	
	//console.log("allTabIndexElems-2: " + allTabIndexElems.length);
	var elems = allTabIndexElems; //document.querySelectorAll('[tabindex]');
	for(var i = 0; i < elems.length; i++)
	{
		if(index === Number(elems[i].getAttribute("tabindex")))
		{
			theFocusedElem = elems[i];
			break;
		}
	}
	
	if(theFocusedElem === null)
	{
		alert("Oddly element not found with tabindex: " + index);
		return;
	}

	theFocusedElem.focus();
	if(theFocusedElem.type === "radio")
	{
		theFocusedElem.checked = true;
	}
}


function focusNextTabIndex()
{
	//console.log("focusNextTabIndex - all:" + allTabIndexElems.length);
	counter++; 
	if(counter > allTabIndexElems.length) 
	{
		counter = 1;
	}
	focusTheTabIndex(counter);
}


function focusPreviousTabIndex()
{
	//console.log("focusPreviousTabIndex");
	counter--; 
	if(counter <= 0) 
	{
		counter = allTabIndexElems.length;
	}
	focusTheTabIndex(counter);
}


function ButtonClick()
{
	console.log("ButtonClick");
	if(theFocusedElem === null)
	{
		console.log("null???");
		return;
	}

	console.log(theFocusedElem.type);
	
	if(theFocusedElem.type === "button")
	{
		theFocusedElem.click();
	}
	return;
}


function GetSelectedPort()
{
	var elems = document.getElementsByName('portSelector');
	for(var i = 0; i < elems.length; i++)
	{
		if(elems[i].checked)
		{
			return elems[i];
		}
	}
	
	// if it's here. none are checked
	return elems[0];
}

function focusUp()
{
	console.log("up");
	
	if(theFocusedElem.id === "changePortButton")
	{
		theFocusedElem = GetSelectedPort();
	}
	else
	{
		theFocusedElem = document.getElementById('changePortButton');
	}
	
	theFocusedElem.focus();
	
}

function focusDown()
{
	console.log("down");
	
	if(theFocusedElem.id === "changePortButton")
	{
		theFocusedElem = GetSelectedPort();
	}
	else
	{
		theFocusedElem = document.getElementById('changePortButton');
	}
	
	theFocusedElem.focus();
}



/*
function UpdaterServerAddress()
{
	var servreName = document.getElementById('ServerName');
	alert(servreName);
}
*/


/*
function startTime()
{
    var today = new Date();
    var h = today.getHours();
    var m = today.getMinutes();
    var s = today.getSeconds();
    m = checkTime(m);
    s = checkTime(s);
    document.getElementById('divbutton1').innerHTML='Current time: ' + h + ':' + m + ':' + s;
    setTimeout(startTime, 10);
}

function checkTime(i)
{
    if (i < 10) {
        i='0' + i;
    }
    return i;
}
*/

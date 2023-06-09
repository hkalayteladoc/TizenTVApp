/**
 * Teladoc Helath Inc. Copyright (c) 2023. All rights reserved.
 */


//var checkTime;
//var stopPostPoll = false;

var workerThread = null;

//var serverAddress = "a11611it.ith.local";
var serverAddress = "10.231.64.3"; // ip for "a11611it.ith.local";

//var serverAddress = "a11562it.teladoc.net";
var serverPort = "8000";

var serverPostIntervalID = 0; // the ID returned by setInterval

var ports = [];

var alarmObj = null;

var systemInfoData = {};	 // json object

var hasPortChanged = false;

var prevSetPort = "";
var changedPort = "";

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
    	case 10009: //RETURN button
		tizen.application.getCurrentApplication().exit();
    		break;
    	default:
    		console.log('Key code : ' + e.keyCode);
    		break;
    	}
    });

	//tizen.systeminfo.getPropertyValue("VIDEOSOURCE", ReadPortsAndFillSelector);
    allTabIndexElems = document.querySelectorAll('[tabindex]');
    tabIndexCount = allTabIndexElems.length;

    //focusNextTabIndex();	// make sure there is a focus

	//ReadDeviceInfo();
	//setTimeout(function() {FillSelector(); DisplayDeviceInfo(); }, 500);
	
	//setTimeout(StartPostPoll, 5000);
	
	//console.log(tizen);

/*
	workerThread = new Worker("js/ServerCommThread.js");
	workerThread.onmessage = WorkerMessage;

	var serverInfo = {};
	serverInfo.serverAddress = serverAddress; 
	serverInfo.serverPort = serverPort;

	var msg = {};
	msg.id = "ServerInfo";
	msg.data = JSON.stringify(serverInfo);
	workerThread.postMessage(JSON.stringify(msg));
*/	
	
	intervalledPosts = setInterval(httpComm, 3000);

	
	
	
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


// window.onload can work without <body onload="">
window.onload = init;



function WorkerMessage(e)
{
	
	var msg = {"id":"nothing", "data":{}};

	
	console.log(e.data);
	msg = JSON.parse(e.data);
	console.log(msg);
	switch(msg.id)
	{
	case "tvInfo":
		{
			systemInfoData = msg.data;
			DisplayDeviceInfo();
		}

	case "request":
		if(msg.data === "portInfo")
		{
			var responseMsg = {};
			responseMsg.id = "portInfo"; 
			responseMsg.data = ports;
			workerThread.postMessage(JSON.stringify(responseMsg));
		}
		else
		{
			console.log("Error: invalid request " + msg.data);
		}
		break;

	case "changePort":
		console.log(msg.data);
		var vidSource = portMap.get(msg.data);
		if(vidSource == null)
		{
			console.log("Error: invalid change port request " + msg.data);
			break;
		}
		tizen.tvwindow.setSource(vidSource, successCBSrc, errorCBSrc);
		tizen.application.getCurrentApplication().hide();
		break;
	case "stop":
		isStop = true;
		if(msg.data )
		{
			return;
		}
		break;
	default:
		console.log("Error: Invalid message");
		console.log(msg);
		break;
	}
	
	
	return;
	
	/*
	workerData = e.data; // JSON.parse(e.data);
	console.log(workerData);
	
	if(workerData === "s")
	{
		//var vidSource = portMap.get("HDMI1");
		//tizen.tvwindow.setSource(vidSource, successCBSrc, errorCBSrc);

		return;
	}
	
	
	if(count >= 3)
	{
		msg.id = "stop"
		msg.data = true;
		workerThread.postMessage(JSON.stringify(msg)); 
		return;
	}
	count++;
	msg.id = "count"
	msg.data = count;
	workerThread.postMessage(JSON.stringify(msg));
	*/
}



function DisplayDeviceInfo()    
{
	var tableObject = document.getElementById("infoTable");

	InsertRowColumn(tableObject, 
			"Total Memory", systemInfoData.totalMemoryGiBytes.toFixed(2) + "GB (" + systemInfoData.totalMemoryBytes + ")", 
			"Core Api Ver", systemInfoData.coreAPIver);
	
	
	InsertRowColumn(tableObject, 
			"Available Memory", systemInfoData.availableMemoryGiBytes.toFixed(2) + "GB (" + systemInfoData.availableMemoryBytes + ")", 
			"Native Api Ver", systemInfoData.nativeAPIver);
	
	InsertRowColumn(tableObject, 
			"Profile Name", systemInfoData.profileName, 
			"Platform Web API Version", systemInfoData.platformWebAPIver);
	
	
	InsertRowColumn(tableObject, 
			"Platform Version Name", systemInfoData.platformVerName , 
			"Platform Version", systemInfoData.platformver);
	
	console.log("systemInfoData  = " + JSON.stringify(systemInfoData));
	console.log("systemInfoData keys = " + Object.keys(systemInfoData));
	console.log("systemInfo.TVmodel 2 = " + systemInfoData.tvModel);
	
	InsertRowColumn(tableObject, 
			"TV Model", systemInfoData.tvModel,  
			"Manufacturer", systemInfoData.tvManufacturer);
	
	InsertRowColumn(tableObject, 
			"Build Version", systemInfoData.tvBuildVersion,  
			" ", " ");

	
	
}


function  InsertRowColumn(tableObject, label1, value1, label2, value2)
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
    cell3 = "&nbsp;&nbsp;";
    cell4.innerHTML = label2;
    cell5.innerHTML = value2;
	
}


function FillSelector()
{
	var portSelectorElem = document.getElementById('portSelection');
	var currentPortName = "" //currentVideoSource.type + currentVideoSource.number;
	//console.log(currentPortName);
	
	//videoSources = systemInfo.videoSources;
	for(var i = 0; i < ports.length; i++)
	{
		var portName = ports[i]; 
		
		var isSelected = false;
		if(currentPortName === portName)
		{
			isSelected = true;
		}
		
	    let input = document.createElement("input");
	    input.type = "radio";
	    input.id = portName;
	    input.name = "portSelector";
	    input.checked = isSelected;
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
	
	
    allTabIndexElems = document.querySelectorAll('[tabindex]');
    tabIndexCount = allTabIndexElems.length; 
	//console.log("allTabIndexElems-1: " + allTabIndexElems.length);
    
    focusNextTabIndex();	// make sure there is a focus
	
}

function setPortSelection(selectedPort)
{
	if(selectedPort === prevSetPort)
	{
		return;
	}

	var portSelectorElem = document.getElementById('portSelection');
	console.log(portSelectorElem.children);
	for (var i = 0; i < portSelectorElem.children.length; i+=2)
	{
		radioElem = portSelectorElem.children[i];
		console.log(radioElem.id);
		if(radioElem.id === selectedPort)
		{
			radioElem.checked = true;
			prevSetPort = selectedPort;
		}
	}
}


function ChangePort()
{
	console.log("change port");
	
	var portSelectorElem = document.getElementById('portSelection');
	//console.log(portSelectorElem.children);
	for (var i = 0; i < portSelectorElem.children.length; i+=2)
	{
		radioElem = portSelectorElem.children[i];
		console.log(radioElem.id);
		if(radioElem.checked)
		{
			changedPort = radioElem.id;
			prevSetPort = changedPort;
			hasPortChanged = true;
		}
	}
	
	return;
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

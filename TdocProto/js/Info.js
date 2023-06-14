/**
 * Teladoc Helath Inc. Copyright (c) 2023. All rights reserved.
 */


var currPip = "FULL";


function successSysInfoProperty(property)
{
	//systemInfo.tvModel = property.model;
	//systemInfo.tvManufacturer = property.manufacturer;
	//systemInfo.tvBuildVersion = property.buildVersion;  
	//console.log("systemInfo.TVmodel = " + systemInfo.tvModel);

	systemInfoData.tvModel = property.model; 
	systemInfoData.tvManufacturer = property.manufacturer;
	systemInfoData.tvBuildVersion = property.buildVersion;  
	console.log("systemInfo.TVmodel = " + systemInfoData.tvModel);
	
}

function errorSysInfoProperty(error)
{
	var msg = "setSource() is failed, error name: " + error.name + ", error message: " + error.message;
	//systemInfo.errorMessages.push(msg);
	console.log(msg);
}


function ReadPorts(videoSourcesObject)
{
	videoSources = videoSourcesObject;
	for(var i = 0; i < videoSources.connected.length; i++)
	{
		var portName = videoSources.connected[i].type + videoSources.connected[i].number; 
		
		portMap.set(portName, videoSources.connected[i]);
		
		ports.push(portName);
	}
	console.log("len: " + videoSources.connected.length);
}


function CPULoad(cpuLoad)
{
	//console.log(cpuLoad);
	cpuLoadPercent = cpuLoad.load * 100;
	periodicInfoData.cpuLoad = cpuLoadPercent; 
	//console.log(cpuLoadPercent.toFixed(2));
	
	var cpuStatusCell = document.getElementById(cpuStatusID);
	if((cpuStatusCell != undefined) && (cpuStatusCell != null))
	{
		cpuStatusCell.innerHTML = periodicInfoData.cpuLoad.toFixed(2) + "%"; 
	}
}

function ReadMemoryStatus(MemoryStatus)
{
	periodicInfoData.memoryStatus = MemoryStatus.status; 
	//console.log(MemoryStatus.status);
	//const  = "memStatus";
	
	periodicInfoData.availableMemoryBytes = tizen.systeminfo.getAvailableMemory();
	periodicInfoData.availableMemoryGiBytes = periodicInfoData.availableMemoryBytes / (1024 * 1024 * 1024);
	var memStatusCell = document.getElementById(memStatusID);
	if( (memStatusCell != undefined) && (memStatusCell != null))
	{
		var statStr = periodicInfoData.availableMemoryGiBytes.toFixed(2) + "GB (" + periodicInfoData.availableMemoryBytes + ")"; 
		statStr += " - " + periodicInfoData.memoryStatus; 
		memStatusCell.innerHTML = statStr; 
	}
}


function ReadResolution(displayResolution)
{
	systemInfoData.resolutionWidth = displayResolution.resolutionWidth;
	systemInfoData.resolutionHeight = displayResolution.resolutionHeight;
	systemInfoData.dotsPerInchWidth = displayResolution.dotsPerInchWidth;
	systemInfoData.dotsPerInchHeight = displayResolution.dotsPerInchHeight;
	
	systemInfoData.physicalWidth = displayResolution.physicalWidth;
	systemInfoData.physicalHeight = displayResolution.physicalHeight;
	systemInfoData.brightness = displayResolution.brightness;

	//console.log(systemInfoData.dotsPerInchWidth);
	//console.log(systemInfoData.physicalWidth);
	//console.log(systemInfoData.brightness);
	
}


function ReadLocaleInfo(localeInfo)
{
	systemInfoData.language = localeInfo.language;
	systemInfoData.country = localeInfo.country;
}


function ReadNetworkType(netInfo)
{
	systemInfoData.networkType = netInfo.networkType;
	console.log(systemInfoData.networkType);
}

function ReadEtherNetInfo(EtherNetInfo)
{
	systemInfoData.Ethernetcable = EtherNetInfo.cable; 
	systemInfoData.EthernetStatus = EtherNetInfo.status; 
	systemInfoData.ssid = EtherNetInfo.ssid;
	systemInfoData.ipAddress = EtherNetInfo.ipAddress;
	systemInfoData.ipv6Address = EtherNetInfo.ipv6Address;
	systemInfoData.macAddress = EtherNetInfo.macAddress;

	systemInfoData.ipMode = EtherNetInfo.ipMode;
	systemInfoData.subnetMask = EtherNetInfo.subnetMask;
	systemInfoData.gateway = EtherNetInfo.gateway;
	systemInfoData.dns = EtherNetInfo.dns;
    
    
}

function ReadWiFiInfo(WifiInfo)
{
	systemInfoData.WiFiStatus = WifiInfo.status; 
	systemInfoData.ssid = WifiInfo.ssid; 
	systemInfoData.ipAddress = WifiInfo.ipAddress; 
	systemInfoData.ipv6Address = WifiInfo.ipv6Address; 
	systemInfoData.macAddress = WifiInfo.macAddress; 
	systemInfoData.WiFisignalStrength = WifiInfo.WiFisignalStrength; 
	systemInfoData.WifiSecurityMode = WifiInfo.WifiSecurityMode; 
	systemInfoData.WiFiEncryptionType = WifiInfo.WiFiEncryptionType; 
	systemInfoData.ipMode = WifiInfo.ipMode; 
	systemInfoData.subnetMask = WifiInfo.subnetMask; 
	systemInfoData.gateway = WifiInfo.gateway; 
	systemInfoData.dns = WifiInfo.dns; 
}

function ReadStorageInfo(StorageInfo)
{
	console.log("StorageUnits: " + StorageInfo.units.length);
	for(var i = 0; i < StorageInfo.units.length; i++)
	{
		console.log(StorageInfo.units[i].type);
		console.log(StorageInfo.units[i].capacity);
		console.log(StorageInfo.units[i].availableCapacity);
		console.log(StorageInfo.units[i].isRemovable);		
	}
}


function ReadDeviceInfo()
{
	console.log("ReadDeviceInfo()");
	
	tizen.systeminfo.getPropertyValue("VIDEOSOURCE", ReadPorts);
	tizen.systeminfo.getPropertyValue("BUILD", successSysInfoProperty, errorSysInfoProperty);
	tizen.systeminfo.getPropertyValue("DISPLAY", ReadResolution);
	tizen.systeminfo.getPropertyValue("LOCALE", ReadLocaleInfo);
	
	tizen.systeminfo.getPropertyValue("NETWORK", ReadNetworkType);
	tizen.systeminfo.getPropertyValue("ETHERNET_NETWORK", ReadEtherNetInfo);
	tizen.systeminfo.getPropertyValue("WIFI_NETWORK", ReadWiFiInfo);
	tizen.systeminfo.getPropertyValue("STORAGE", ReadStorageInfo);
	ReadPeriodic();
	
	
	currentVideoSource = tizen.tvwindow.getSource();
	
	systemInfoData.totalMemoryBytes = tizen.systeminfo.getTotalMemory();
	systemInfoData.totalMemoryGiBytes = systemInfoData.totalMemoryBytes / (1024 * 1024 * 1024);
    
	//systemInfoData.availableMemoryBytes = tizen.systeminfo.getAvailableMemory();
	//systemInfoData.availableMemoryGiBytes = systemInfoData.availableMemoryBytes / (1024 * 1024 * 1024);
	periodicInfoData.availableMemoryBytes = tizen.systeminfo.getAvailableMemory();
	periodicInfoData.availableMemoryGiBytes = periodicInfoData.availableMemoryBytes / (1024 * 1024 * 1024);

	systemInfoData.coreAPIver = tizen.systeminfo.getCapability("http://tizen.org/feature/platform.core.api.version");

	systemInfoData.nativeAPIver = tizen.systeminfo.getCapability("http://tizen.org/feature/platform.native.api.version");
    
	systemInfoData.platformver = tizen.systeminfo.getCapability("http://tizen.org/feature/platform.version");
    
	systemInfoData.platformWebAPIver = tizen.systeminfo.getCapability("http://tizen.org/feature/platform.web.api.version");
    
	systemInfoData.platformVerName = tizen.systeminfo.getCapability("http://tizen.org/feature/platform.version.name");
    
	systemInfoData.profileName = tizen.systeminfo.getCapability("http://tizen.org/feature/profile");
	
	//console.log("systemInfo.TVmodel 3 = " + systemInfo.tvModel);
	
	
	OutputSupportedKeys();
	
	setInterval(ReadPeriodic, 1000);
}


function ReadPeriodic()
{
	tizen.systeminfo.getPropertyValue("CPU", CPULoad);
	tizen.systeminfo.getPropertyValue("MEMORY", ReadMemoryStatus);
	
	var msg = {};
	msg.id = "cpuInfo"; 
	msg.data = periodicInfoData;
	workerThread.postMessage(JSON.stringify(msg));
}


function OutputSupportedKeys()
{
	var i;
	var keyCode = {};
	var supportedKeys;
	supportedKeys = tizen.tvinputdevice.getSupportedKeys();
	for (i = 0; i < supportedKeys.length; i++)
	{
	   console.log(supportedKeys[i].name + " = " + supportedKeys[i].code);
	}
}


function WorkerMessage(e)
{
	
	var msg = {"id":"nothing", "data":{}};

	//console.log(e);
	console.log(e.data);
	msg = JSON.parse(e.data);
	console.log(msg);
	switch(msg.id)
	{
	case "request":
		if(msg.data === "portInfo")
		{
			var responseMsg = {};
			responseMsg.id = "portInfo"; 
			responseMsg.data = ports;
			workerThread.postMessage(JSON.stringify(responseMsg));
		}
		else if(msg.data === "tvInfo")
		{
			var responseMsg = {};
			responseMsg.id = "tvInfo"; 
			responseMsg.data = systemInfoData;
			workerThread.postMessage(JSON.stringify(responseMsg));
			
		}
		else
		{
			console.log("Error: invalid request " + msg.data);
		}
		break;

	case "changePort":
		rect = ["0", "0px", "100%", "100%"];
		console.log(msg.data);
		if(msg.data === "APP")
		{
			try
			{
				tizen.tvwindow.show(successCBShow, null, rect, "MAIN", "BEHIND");
			}
			catch (error)
			{
			  console.log("Error name: " + error.name + ", error message: " + error.message);
			}
		}
		else
		{
			var vidSource = portMap.get(msg.data);
			if(vidSource == null)
			{
				console.log("Error: invalid change port request " + msg.data);
				break;
			}
			tizen.tvwindow.setSource(vidSource, successCBSrc, errorCBSrc);
			tizen.tvwindow.show(successCBShow, null, rect, "MAIN", "FRONT");
			//tizen.tvwindow.hide(successCBHide);
			//tizen.application.getCurrentApplication().hide();
		}
		break;
		
		
	case "changePip":
		console.log(msg.data);
		/*
		if(currPip != msg.data)
		{
			tempPip = msg.data;
			
			if(tempPip === "FULL")
			{
				try
				{
					tizen.tvwindow.show(successCBShow, null, ["0", "0px", "100%", "100%"], "MAIN", "FRONT");
				}
				catch (error)
				{
				  console.log("Error name: " + error.name + ", error message: " + error.message);
				}
			}
			else if (tempPip == "PEEK")
			{
				try
				{
					tizen.tvwindow.show(successCBShow, null, ["0", "0px", "25%", "25%"], "MAIN", "FRONT");
				}
				catch (error)
				{
				  console.log("Error name: " + error.name + ", error message: " + error.message);
				}
			}
			else
			{
				console.log("Error invalid data: ", tempPip);
			}
			
			currPip = tempPip;
			console.log(currPip);
		}
		*/
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


function successCBSHide(windowRect)
{
	console.log("Hidden");
  /* You will get exactly what you put as rectangle argument of show() through windowRect. */
  /* Expected result: ["0", "0px", "50%", "540px"] */
  console.log("Rectangle: [" + windowRect[0] + ", " + windowRect[1] + ", " + windowRect[2] + ", " +
              windowRect[3] + "]");
}


function successCBShow(windowRect, type)
{
  /* You will get exactly what you put as rectangle argument of show() through windowRect. */
  /* Expected result: ["0", "0px", "50%", "540px"] */
  console.log("Rectangle: [" + windowRect[0] + ", " + windowRect[1] + ", " + windowRect[2] + ", " +
              windowRect[3] + "]");
  console.log("Type: " + type);
}



function ChangePort()
{
	console.log("change port");
	
	var selectedPortElem = GetSelectedPort();
	var vidSource = portMap.get(selectedPortElem.id);
	
	tizen.tvwindow.setSource(vidSource, successCBSrc, errorCBSrc);
	//		tizen.application.getCurrentApplication().exit();
	tizen.tvwindow.show(successCBShow, null, ["0", "0px", "100%", "100%"], "MAIN", "FRONT");
	//tizen.application.getCurrentApplication().hide();
	
	/*
	var msg = {};
	msg.id = "SetPort";
	msg.data = selectedPortElem.id;
	workerThread.postMessage(JSON.stringify(msg));
	*/
	
	return;
}

function successCBSrc(source, type)
{
	var msg = "setSource() is successfully done, source type: " + source.type +
    ", source port number: " + source.number + ", signal provided: " + source.signal;
  console.log(msg);
}

function errorCBSrc(error)
{
	var msg = "setSource() is failed, error name: " + error.name + ", error message: " + error.message; 
  console.log(msg);
}



var count = 0;



function successCBHide()
{
  /* Expected result: ["10.5%", "10%", "900", "500px"] */
  console.log("window hidden");
}


function HideMe()
{
	  console.log("hideme");
	try
	{
	  tizen.tvwindow.hide(successCBHide );
	}
	catch (error)
	{
	  console.log("Error name: " + error.name + ", error message: " + error.message);
	}

}


function disp()
{
	console.log(Date());
}

/*
function successCBShow(windowRect, type)
{
  / * Expected result: ["0", "0", "50%", "50%"] * /
  console.log("Rectangle: [" + windowRect[0] + ", " + windowRect[1] + ", " + windowRect[2] + ", " +
              windowRect[3] + "]");
}
*/





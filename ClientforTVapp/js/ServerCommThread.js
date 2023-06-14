/**
 * Teladoc Helath Inc. Copyright (c) 2023. All rights reserved.
 */

/*
class httpComm()
{
	var message;
};

*/

//onconnect = ConnectHandler;
/*
var intervalledPosts = 0;
var serverAddress= ""; 
var serverPort = "";

var portInfo = "";
var tvInfo = "";



var isStop = false;

StartPostPoll();


var counter = 0;
var tizen = null;
var port = null; 
	
function StartPostPoll()
{
	console.log("Server comm thread()");
	//console.log(serverPostIntervalID);
	//serverPostIntervalID = setInterval(httpComm, 10000);
	intervalledPosts = setInterval(httpComm, 3000);

	onmessage = MessageHandler;
}


function ConnectHandler(event)
{
	console.log("ConnectHandler");
	  port = event.ports[0];
	  port.onmessage = MessageHandler;
	  StartPostPoll();
}

function MessageHandler(e)
{
	console.log(e.data);
	msg = JSON.parse(e.data);
	console.log(msg);
	switch(msg.id)
	{
	case "ServerInfo":
		serverInfo = JSON.parse(msg.data);
		console.log("serverInfo: " + serverInfo);
		serverAddress = serverInfo.serverAddress; 
		serverPort = serverInfo.serverPort;
		break;

	case "portInfo":
		portInfo = msg.data;
		break;

	case "tvInfo":
		tvInfo = msg.data;
		break;

	case "count":
		console.log(data.data);
		break;
	case "stop":
		isStop = true;
		if(data.data )
		{
			return;
		}
		break;
	default:
		console.log("Error: Invalid message : " + msg);
		break;
	}
}

*/

function reqListener(e)
{
	
	console.log("type: " + e.type + "   Loaded: " + e.loaded);
	console.log("status: " + this.status);
	console.log("response: " + this.response);
	console.log("responseurl: " + this.responseURL);
	console.log("Text: " + this.responseText);
	console.log("all headers: " + this.getAllResponseHeaders());
}


function successCB(windowRect, type)
{
  /* Expected result: ["0", "0", "50%", "50%"] */
  console.log("Win type: " + type );
  console.log("Rectangle: [" + windowRect[0] + ", " + windowRect[1] + ", " + windowRect[2] + ", " +
              windowRect[3] + "]");
}


async function httpComm()
{
	var pipSelection = GetPipSelection();
	//console.log(pipSelection);
	
	
	try
	{
		var serverBaseURL = "http://" + serverAddress + ":" + serverPort;
		console.log(serverBaseURL);
		console.log(systemInfoData);
		
		//tvInfo = JSON.parse(systemInfoData);

		/*
		const response = fetch(serverBaseURL + "/change", 
				{
					method:"get",
					headers:{ "Content-Type": "application/json"},
				});
		const responseDataObj = await response;
		responseData = responseDataObj.text();
		console.log(responseData);
		console.log(responseData.body);
		changeData = JSON.parse(responseData.body);
		console.log(changeData);
		*/
		//console.log(systemInfoData);
		//console.log(JSON.stringify(systemInfoData));
		//tvInfoString = JSON.stringify(systemInfoData);
		//const compareThing = JSON.stringify(systemInfoData) === "{}";
		//console.log(compareThing);
		//console.log(typeof systemInfoData);

		if( JSON.stringify(systemInfoData) === "{}")
		{
		console.log("here" + serverBaseURL);
			 const response = await fetch(serverBaseURL + "/data", 
					{
						method:"get",
						headers:{ "content-type": "application/json"},
					});
			
			 //const response = await fetch(serverBaseURL + "/data");
		console.log("here2" + serverBaseURL);
			const responseData = await response.json();
			console.log(responseData);
			console.log(typeof responseData);
			if(typeof responseData === "string")
			{
				systemInfoData = JSON.parse(responseData);
			}
			else
			{
				systemInfoData = responseData;
			}
			
			//var msg = {};
			//msg.id = "tvInfo";
			//msg.data = tvInfo;
			//postMessage(JSON.stringify(msg));

			if((JSON.stringify(systemInfoData) != "") && (JSON.stringify(systemInfoData) != "{}"))
			{
				setTimeout(function() {DisplayDeviceInfo(); }, 500);
			}
		}

		if( JSON.stringify(ports) === "[]")
		{
		console.log("here ports " + serverBaseURL);
			 const response = await fetch(serverBaseURL + "/ports", 
					{
						method:"get",
						headers:{ "content-type": "application/json"},
					});
			
			 //const response = await fetch(serverBaseURL + "/data");
		console.log("here2 ports " + serverBaseURL);
			const responseData = await response.json();
			console.log(responseData);
			if(typeof responseData === "string")
			{
				ports = JSON.parse(responseData);
			}
			else
			{
				ports = responseData;
			}
			
			//var msg = {};
			//msg.id = "tvInfo";
			//msg.data = tvInfo;
			//postMessage(JSON.stringify(msg));

			if((JSON.stringify(ports) != "") && (JSON.stringify(ports) != "[]"))
			{
				setTimeout(function() { FillSelector(); }, 500);
			}
			
		}
		console.log("here3 not in if");


		const response = await fetch(serverBaseURL + "/setPort", 
				{
					method:"get",
					headers:{ "Content-Type": "application/json"},
				});
		
		const responseData = await response.json();
		//responseData = responseDataObj.text();
		console.log(responseData);
		//console.log(responseData.body);
		//changeData = JSON.parse(responseData.body);
		//console.log(changeData);

		setPort = responseData.setPortChange;
		if(setPort != "")
		{
			console.log("setPort: " + setPort);
			setPortSelection(setPort);
		}

		if(hasPortChanged)
		{
			var msg = {};
			
			const response = await fetch(serverBaseURL + "/change", 
					{
						method:"post",
						headers:{ "Content-Type": "application/json"},
						body: JSON.stringify({changePort:changedPort}),
					});
			
			const responseData = await response;
			//responseData = responseDataObj.text();
			console.log(responseData);
			//console.log(responseData.body);
			//changeData = JSON.parse(responseData.body);
			//console.log(changeData);
			
			hasPortChanged = false;
		}


		if( prevPipSelection != pipSelection )
		{
			var msg = {};
			
			const response = await fetch(serverBaseURL + "/changePip",
					{
						method:"post",
						headers:{ "Content-Type": "application/json"},
						body: JSON.stringify({changePip:pipSelection}),
					});
			
			const responseData = await response;
			console.log(responseData);
			
			prevPipSelection = pipSelection;
		}


		{
			const response = await fetch(serverBaseURL + "/cpuInfo", 
					{
						method:"get",
						headers:{ "Content-Type": "application/json"},
					});
			
			const responseData = await response.json();
			console.log(responseData);
			if(JSON.stringify(responseData) != "" )
			{
				cpuInfoData = JSON.parse(responseData.cpuInfo);
			}
			
		}



		return;
		
		if(responseData.status === 404)
		{
			console.log("it's ok to ignore and keep polling");
		}
	}
	catch(e)
	{
		console.log(e);	
	}

}





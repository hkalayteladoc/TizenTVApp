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

var intervalledPosts = 0;
var serverAddress= ""; 
var serverPort = "";
var serverBaseURL = "";


var portInfo = "";
var tvInfo = "";

var setPort = "APP";
var prevSetPort = "APP";

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


//function ConnectHandler(event)
//{
//	console.log("ConnectHandler");
//	  port = event.ports[0];
//	  port.onmessage = MessageHandler;
//	  StartPostPoll();
//}

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

		serverBaseURL = "http://" + serverAddress + ":" + serverPort;
		SendData();
		
		break;

	case "portInfo":
		portInfo = msg.data;
		break;

	case "tvInfo":
		tvInfo = msg.data;
		break;

		
	case "SetPort":
		setPort = msg.data;
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
		
	case "changePort": // from main thread .... from remote
		if(msg.data === "APP")
		{
			var msg = {};
			msg.id = "changePort";
			msg.data = "APP";
			postMessage(JSON.stringify(msg));
		}
		
	default:
		console.log("Error: Invalid message : " + msg);
		break;
	}
}

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
	if(serverBaseURL === "")
	{
		return;
	}
	
	try
	{
		console.log(serverBaseURL);

		var response = await fetch(serverBaseURL + "/change", 
				{
					method:"get",
					headers:{ "Content-Type": "application/json"},
				});
		
		var responseData = await response.json();
		//responseData = responseDataObj.text();
		console.log(responseData);
		//console.log(responseData.body);
		//changeData = JSON.parse(responseData.body);
		//console.log(changeData);

		if(responseData.changePort === "empty")
		{
			console.log(portInfo);
			console.log(tvInfo);
			
			if((portInfo === "") || (tvInfo === "") )
			{
				var msg = {};
				msg.id = "request";
				msg.data = "portInfo";
				postMessage(JSON.stringify(msg));

				msg.data = "tvInfo";
				postMessage(JSON.stringify(msg));
			}
			else
			{
				SendData();
			}
		}
		else if(responseData.changePort != "")
		{
			var msg = {};
			msg.id = "changePort";
			msg.data = responseData.changePort;
			postMessage(JSON.stringify(msg));

			setPort = responseData.changePort;
			prevSetPort = responseData.changePort;
			
		}

		if( setPort != prevSetPort)
		{
			var msg = {};
			msg.setPortChange = setPort;
			
			// port was changed
			var response1 = await fetch(serverBaseURL + "/setPort", 
					{
						method:"post",
						headers:{ "Content-Type": "application/json"},
						body: JSON.stringify(msg),
					});
			var jsonData1 = await response1;
			console.log(jsonData1);
			
			prevSetPort = setPort;
		}

		
		
		response = await fetch(serverBaseURL + "/changePip", 
				{
					method:"get",
					headers:{ "Content-Type": "application/json"},
				});
		
		responseData = await response.json();
		//responseData = responseDataObj.text();
		console.log(responseData);
		
		if(responseData.changePip != "")
		{
			var msg = {};
			msg.id = "changePip";
			msg.data = responseData.changePip;
			postMessage(JSON.stringify(msg));
		}
		
		
		
		
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


async function SendData()
{
	var response1 = await fetch(serverBaseURL + "/ports", 
			{
				method:"post",
				headers:{ "Content-Type": "application/json"},
				body: JSON.stringify(portInfo),
			});
	var jsonData1 = await response1;
	console.log(jsonData1);
	
	if(response1.status === 200)
	{
		response1 = await fetch(serverBaseURL + "/data", 
				{
					method:"post",
					headers:{ "Content-Type": "application/json"},
					body: JSON.stringify(tvInfo),
				});
		jsonData1 = await response1;
		console.log(jsonData1);
	}
	
	if(response1.status === 200)
	{
		var msg = {};
		msg.setPortChange = prevSetPort;
		
		// port was changed
		var response1 = await fetch(serverBaseURL + "/setPort", 
				{
					method:"post",
					headers:{ "Content-Type": "application/json"},
					body: JSON.stringify(msg),
				});
		var jsonData1 = await response1;
		console.log(jsonData1);
	}
}


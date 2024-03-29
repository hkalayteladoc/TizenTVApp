/**
 * Teladoc Helath Inc. Copyright (c) 2023. All rights reserved.
 */

/*
class httpComm()
{
	var message;
};

*/


StartPostPoll();


function StartPostPoll()
{
	console.log("StartPostPoll()");
	console.log(serverPostIntervalID);
	serverPostIntervalID = setInterval(httpComm, 10000);
	
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


async function httpComm()
{
	console.log(serverPostIntervalID);
	/*
	const req = new XMLHttpRequest();
	
	req.addEventListener("load", reqListener);
	req.addEventListener("progress", reqListener);
	req.addEventListener("error", reqListener);
	req.addEventListener("abort", reqListener);	
	
	req.addEventListener("loadstart", reqListener);
	req.addEventListener("loadend", reqListener);
	
	req.open("GET", "http://www.somethinexample.crap");
	req.setRequestHeader('Content-Type', 'application/json');
	req.send();
	
	
	
		var serverBaseURL = "http://" + serverAddress + ":" + serverPort;
		const response = await fetch(serverBaseURL + "/change", 
				{
					method:"post",
					headers:{ "Content-Type": "application/json"},
					body: JSON.stringify(""),
				});
		const jsonData = await response;
		console.log(jsonData);
		
		if(jsonData.status === 404)
		{
			console.log("it's ok to ignore and keep polling");
		}
	
	
	*/
	
	try
	{
		var serverBaseURL = "http://" + serverAddress + ":" + serverPort;
		console.log(serverBaseURL);
		
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

		const response = await fetch(serverBaseURL + "/change", 
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
		
		if(responseData.changePort === "empty")
		{
			
			console.log(JSON.stringify(ports));
			console.log(JSON.stringify(systemInfoData));

			var response1 = await fetch(serverBaseURL + "/ports", 
					{
						method:"post",
						headers:{ "Content-Type": "application/json"},
						body: JSON.stringify(ports),
					});
			var jsonData1 = await response1;
			console.log(jsonData1);
			
			if(response1.status === 200)
			{
				response1 = await fetch(serverBaseURL + "/data", 
						{
							method:"post",
							headers:{ "Content-Type": "application/json"},
							body: JSON.stringify(systemInfoData),
						});
				jsonData1 = await response1;
				console.log(jsonData1);
			}
			
			
		}
		
		if(responseData.changePort === "")
		{
			var response1 = await fetch(serverBaseURL + "/ports", 
					{
						method:"get",
						headers:{ "Content-Type": "application/json"},
					});
			var jsonData1 = await response1.json();
			console.log(jsonData1);
			
			if(response1.status === 200)
			{
				response1 = await fetch(serverBaseURL + "/data", 
						{
							method:"get",
							headers:{ "Content-Type": "application/json"},
						});
				jsonData1 = await response1.json();
				console.log(jsonData1);
			}
			
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



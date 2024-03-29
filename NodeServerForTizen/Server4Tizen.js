

const http = require("http");

//const host = 'localhost';
//const host = 'a11611it.ith.local';
const host = '10.231.64.3';
const port = 8000;

var tvData = {};
var tvPorts = [];
var changePortData = '';
var setPort = "TV1";
var changePipData = "FULL";
var cpuInfoData = {};

const requestListener = async function (req, res) 
{
	//console.log(req);
	
	if (req.method === 'POST') 
	{
		console.log("post");
		let jsonDataString = '';
		req.on('data', chunk => 
			{
				jsonDataString += chunk.toString(); // convert Buffer to string
			});
		req.on('end', async () => 
			{
				console.log(jsonDataString);
				[retCode, retJson] = await StoreData(jsonDataString, req.url);
				
				res.setHeader("Content-Type", "application/json");
				//res.end('ok');
				res.writeHead(retCode);
				res.end(retJson);
			});
	}	

	if (req.method === 'GET') 
	{
		console.log("get");
		
		[retCode, retJson, retData] = await GetData(req.url);
		
		res.setHeader("Content-Type", "application/json");
		res.writeHead(retCode);
		//res.write(retData);
		res.end(retData);
	}	
	
	/*
	
 switch (req.url) 
	{
        case "/books":
            res.writeHead(200);
            res.end(books);
            break
        case "/authors":
            res.writeHead(200);
            res.end(authors);
            break
        default:
            res.writeHead(404);
            res.end(JSON.stringify({error:"Resource not found"}));
    }	
	*/
	
};


const server = http.createServer(requestListener);
server.listen(port, host, () => 
{
    console.log(`Server is running on http://${host}:${port}`);
});


async function StoreData(jsonDataString, reqURL)
{
	//console.log(jsonDataString);
	console.log(reqURL);
	retCode = 200;
	retJson = `{"message": "ok"}`;
	switch (reqURL) 
	{
        case "/data":
			tvData = JSON.parse(jsonDataString);
			//allKeys = Object.keys(tvData);
			//console.log(allKeys);
            break
        case "/ports":
			tvPorts = JSON.parse(jsonDataString);
            break
        case "/change":     /// set in browser, in form TV
	console.log(jsonDataString);
			changes = JSON.parse(jsonDataString);
			changePortData = changes.changePort;
            break
        case "/setPort":		// set in TV inform browser
			setPortChanges = JSON.parse(jsonDataString);
			setPort = setPortChanges.setPortChange;
            break			
        case "/changePip":     /// set in browser, in form TV
			console.log(jsonDataString);
			pipChanges = JSON.parse(jsonDataString);
			if(pipChanges.changePip != "")
			{
				changePipData = pipChanges.changePip;
			}
            break
        case "/cpuInfo":     /// set in browser, in form TV
			console.log(jsonDataString);
			cpuChanges = JSON.parse(jsonDataString);
			console.log(cpuChanges);
			cpuInfoData = cpuChanges;
            break
        default:
			retCode = 404;
            retJson = JSON.stringify({error:"invalid url"});
    }	

	return [ retCode, retJson ];
}

async function GetData(reqURL)
{
	console.log(reqURL + " - " + Date());
	retCode = 200;
	retMessage = "";
	retData = "";
	switch (reqURL) 
	{
        case "/data":
			retData = JSON.stringify(tvData);
	console.log(typeof retData);
            break
        case "/ports":
			retData = JSON.stringify(tvPorts);
            break
        case "/change":
			if((JSON.stringify(tvPorts) === '[]') ||
				(JSON.stringify(tvPorts) === '') ||
				(JSON.stringify(tvData) === '{}') ||
				(JSON.stringify(tvData) === '')
			  )
			{
		console.log('here');
				
				//retCode = 204;
				retData = JSON.stringify({changePort:'empty'});
			}
			else
			{
				retData = JSON.stringify({changePort:changePortData});
			}
			changePortData = ''; // reset the change port once sent
            break
        case "/changePip":     /// set in browser, in form TV
				retData = JSON.stringify({changePip:changePipData});
            break
        case "/setPort":		// set in TV inform browser
			retData = JSON.stringify({setPortChange:setPort});
			setPort = "";
            break			
        case "/cpuInfo":     /// set in browser, in form TV
			var cpuInfoDataStr = JSON.stringify(cpuInfoData);
			retData = JSON.stringify({cpuInfo:cpuInfoDataStr});
            break
        default:
			retCode = 404;
            retData = JSON.stringify({error:"invalid url"});
    }	
	console.log(retData);

	return [ retCode, retMessage, retData ];
	
}


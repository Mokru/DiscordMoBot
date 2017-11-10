const express = require('express');
const app = express();
const Discord = require('discord.js');
const client = new Discord.Client({convertEmoticons:true});
var fs = require('fs');
var keys = JSON.parse(fs.readFileSync('secret.JSON', 'utf8'));
var Dtoken = keys.Dcord;
var SSE = require('express-sse');
var sse = new SSE([]);
var path = require('path');
var reddit = require('redwrap');
var sourceSub = "all";
var pref = "!";
var homeChannel = "spiderman_thread";
var senderChannel = "";
console.log(Dtoken);
app.use(express.static(path.join(__dirname, 'public')));

app.get('/bot', sse.init);

app.get('/bot', function (req, res){
	res.send('Im live you butt');	
})
app.get('/', function (req, res){
	res.setHeader("sourceSub", sourceSub);
	res.setHeader("homeChannel", homeChannel);
	res.sendFile('../public/index.html');	
})

app.post('/bot', function (req, res) {
	
	switch(req.headers.rtype){
		case "sendM":
			var Pmessage = req.headers.payload;
			var channel = client.channels.find("name", homeChannel);
			channel.send(Pmessage);
			res.send('Got a POST request for MESSAGE')
			break;
		case "refV":
			var uVars = {"sourceSub":sourceSub, "homeChannel":homeChannel};
			res.send(uVars)
			console.log("Got request to update vars");
			break;
		case "upV":
			sourceSub = req.headers.sourcesub;
			homeChannel = req.headers.homechannel;
			console.log("updated variables: " + req.headers.sourcesub + " , " + req.headers.homechannel);
			res.send("updated variables: " + sourceSub + " , " + homeChannel);
			break;
		default:
	}
})

app.listen(3000, function(){
	console.log("Listening to port 3000");
});



function handleSearch(err, search, res){
	if(err){
		console.log("there was an error: " + err);
	}else if(res){
		console.log(res);
	}else{
		console.log(search);
	}
}


client.on('ready', () => {
	console.log('I am ready!');
});

client.on('message', message => {
	var prefCheck = message.content.split("");
	var messageContent = message.content.substr(1);
	var arguments = messageContent.split(" ");
	var command = arguments[0];
	var senderChannel = message.channel.name;
	
	if(prefCheck[0] === pref){
		switch(command){
			case "reddit":	//REDDIT
			
		reddit.r(sourceSub, function(err, data, res){
		if(!data.data){
			console.log("error");
			message.guild.channels.find("name", senderChannel).send(sourceSub + " is not a valid subreddit. Please find a valid one at www.reddit.com");
		}else{
		var ranNum = Math.floor(Math.random() * data.data.children.length);  
		var topCock = data.data.children[ranNum].data.url
			 message.guild.channels.find("name", senderChannel).send(topCock);
			 console.log(data.data.ch);
			}
		});
		
			break;
			case "restart":	//RESTART
			
		if(message.author.username === "Mokru"){
		var retimer = setInterval(function(){ restartBot(); },5000);
			console.log("Restarting bot");
			client.destroy()
		function restartBot(){
			client.login(Dtoken);
			console.log("restarted");
			clearInterval(retimer);
		}
			}
			
			break;
			case "setsub":  // SETSUB
				
		previousSub = sourceSub;
		sourceSub = arguments[1];
		reddit.r(sourceSub, function(err, data, res){
		if(!data.data){
			console.log("error");
			message.guild.channels.find("name", senderChannel).send(sourceSub + " is not a valid subreddit. Please find a valid one at www.reddit.com");
			sourceSub = previousSub;
		}else{
			message.guild.channels.find("name", senderChannel).send("Set !reddit source to " + sourceSub);
		};
		})
				
			break;
			case "sub":	// SUB
			
			message.guild.channels.find("name", senderChannel).send("taking quality content from http://www.reddit.com/r/" + sourceSub);
			
			break;
			case "coinflip": //COINFLIP
				result = Math.floor((Math.random() * 2) + 1);
				if(result ==1){
					message.guild.channels.find("name", senderChannel).send("Heads");
				}else{
					message.guild.channels.find("name", senderChannel).send("Tails");
				}
			break;
			case "dice": // DICE ROLL
			var rollname = "";
			var rolls = [];// we will store each of our rolls in an array and reset it whenever this case is called again.
			var rollsStr = ""; //we will format our rolls into a string so that we can show them to our dice roller
			var sum = 0; //this will be the sum total for our rolls
			//Make sure we get the correct amount of arguments. This lets us have two variable arguments where the first one is the dice roll and second is the name of the roll
			if(arguments.length > 1 && arguments.length < 4){
				//See if the first argument for the dice roll has a valid format
				if((arguments[1].split("d").length - 1) == 1){
				var dset = arguments[1];
				var vals = dset.split("d");
				//redefine our roll name variable if one is given. This will not change further in this function
				if(arguments.length > 2){
					rollname = arguments[2];
				}
					//make sure the type of dice is correct
				if(!isNaN(vals[0]) && !isNaN(vals[1]) && vals[0] <= 50 && vals[1] <= 2000){
						//we now have the final correct format for the dice roll and can now do the random math.
						var count = vals[0]; // the amount of dice. this will determine how many random rolls we will do
						var type = vals[1]; // the type of dice. this will determine the ceiling for our random rolls
						//do our rolls with an for loop and store them in our rolls array
						for(i = 0; i < count; i++){
							rolls[i] = Math.floor((Math.random() * type) + 1);
						}
						
						// add all our rolls together and at the same time format rollsStr that we defined earlier
						for(i = 0; i < rolls.length; i++){
							sum += rolls[i];
							rollsStr += " " + rolls[i];
						}
						console.log(senderChannel);
						console.log(rollname + " rolled " + rollsStr + " for a total of " + sum);
						message.guild.channels.find("name", senderChannel).send(rollname + " rolled " + rollsStr + " for a total of " + sum);
					}else{
						console.log("Invalid command structure. some or all of the given dice were not numbers or they were too large");
					}
				}else{
					console.log("Invalid command structure. no `d`");
				}
			}else{
				console.log("Invalid command structure. arg len; " + (arguments.length - 1));
			}
			break;
			default:
		}
	};
	});

client.on('message', message=>{
	var sendContent = "#" + message.channel.name + " - " + message.author.username + ": " + message.content
	sse.send(sendContent);
	console.log(sendContent);
	
});


client.login(Dtoken);


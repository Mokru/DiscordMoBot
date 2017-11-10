var http = require("http");

var sendMessage = function(content){

	$.post("http://localhost:3000",
	{
		payload: content,
	},
	function(data, status){
		console.log("Data: " + data + "\nStatus: " + status);
	});
}

$("#sendButton").click(function(){
	var message = $("#textBar").val();
	sendMessage(message);
});
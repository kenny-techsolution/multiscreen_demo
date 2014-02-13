console.log("multiscreen.js is loaded.");

var socket = io.connect('http://localhost:5000');

socket.on('news', function(data) {
    console.log(data);
    socket.emit('my other event', {
        my : 'data'
    });
});


$(function() {
    $( ".draggable" ).draggable({
    	scroll: false,
    	create: function (event, ui ) {
    		//console.log(event);
    	},
    	drag: function (event, ui) {
    		var screenWidth = $("#container").width();
    		if (ui.position.left > screenWidth - 140) {
    			ui.helper.hide();
    		}
    	}
    });
});
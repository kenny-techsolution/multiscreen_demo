$(function() {
	var office = $(".container").attr("id");
	var socket = io.connect('http://localhost:5000');
	
	var dragOptions = {
    	scroll: false,
    	create: function (event, ui ) {
    		//console.log(event);
    	},
    	drag: function (event, ui) {
    		var screenWidth = $(".container").width();
    		var $task = ui.helper;
    		if ($task.is(":visible") && ui.position.left >  screenWidth - 140) {
    			socket.emit(office, {
    				"task": $task.attr("id"),
    				"description": $task.text().trim()
    			});
    			$task.hide();
    		}
    	}
	}
	
	var createTask = function (task) {
		$newTask = $("<div id='" + task.id + "' class='task draggable ui-widget-content'>" + task.description + "</div>");
		$(".container").append($newTask);
		$newTask.draggable(dragOptions);
	}
	
    $( ".draggable" ).draggable(dragOptions);
	
	socket.on('connect', function () {
		socket.emit('room', 'screens')
	})
	
	socket.on('paloAlto', function(data) { 
	    console.log(data); 
	    createTask(data);
	});
	
	socket.on('bush', function(data) { 
	    console.log(data); 
	});
});
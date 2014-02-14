$(function() {
	var office = $(".container").attr("id");
	var socket = io.connect('/');
   
	var dragOptions = {
    	scroll: false,
    	create: function (event, ui ) {
    		//console.log(event);
    	},
    	drag: function (event, ui) {
    		var screenWidth = $(".container").width();
    		var $task = ui.helper;
    		var shouldSwitch = function () {
    			return  ui.position.left >  screenWidth - 140 || ui.position.left < -140;
    		}

    		if (shouldSwitch()) {
    			socket.emit(office, {
    				"id": $task.attr("id"),
    				"description": $task.text().trim()
    			});
    			$task.remove();
    		}
    	}
	}

	var createTask = function (task) {
		if($("#" + task.id).length == 0) {
			$newTask = $("<div id='" + task.id + "' class='task draggable ui-widget-content'>" + task.description + "</div>");
			$(".container").append($newTask);
			$newTask.draggable(dragOptions);
		}
	}

    $( ".draggable" ).draggable(dragOptions);

	socket.on('connect', function () {
		socket.emit('room', 'screens')
	})

	socket.on(office, function(data) {
	    console.log(data);
	    createTask(data);
	});
});
$(function() {
	var offices = {
		"paloAlto" : {
			channel: "paloAlto",
			emits: "paloAlto",
			leftOffset: function () {
				return 10;
			},
			shouldSwitch: function (left) {
				return  left < -140;
			}
		},
		"bush" : {
			channel: "bush",
			emits: "bush",
			leftOffset: function () {
				return $(".container").width() - 250;
			},
			shouldSwitch: function (left) {
				return  left >  $(".container").width() - 140;
			}
		}
	}
	
	var office = offices[$(".container").attr("id")];
	var socket = io.connect('/');
   
	var dragOptions = {
    	scroll: false,
    	create: function (event, ui ) {
    		//console.log(event);
    	},
    	drag: function (event, ui) {
    		var $task = ui.helper;

    		if (office.shouldSwitch(ui.position.left)) {
    			socket.emit(office.emits, {
    				"id": $task.attr("id"),
    				"description": $task.text().trim(), 
    				"top":   ui.position.top/$(".container").height()
    			});
    			$task.remove();
    		}
    	}
	}

	var createTask = function (task) {
		if($("#" + task.id).length == 0) {
			var $container = $(".container");
			$newTask = $("<div id='" + task.id + "' class='task draggable ui-widget-content'>" + task.description + "</div>");
			$newTask.css("top", $container.height() * task.top + "px");
			$newTask.css("left", office.leftOffset() + "px");
			$newTask.draggable(dragOptions);
			$container.append($newTask);
		}
	}

    $(".draggable").draggable(dragOptions);

	socket.on('connect', function () {
		socket.emit('room', 'screens')
	});

	socket.on(office.channel, function(data) {
	    console.log(data);
	    createTask(data);
	});
});
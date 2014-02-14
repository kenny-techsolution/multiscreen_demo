$(function() {
	var offices = {
		"paloAlto" : {
			channel: "paloAlto",
			emits: "fromPaloAlto",
			leftOffset: function () {
				return 10;
			},
			shouldSwitch: function (left) {
				return  left < -50;
			}
		},
		"bush" : {
			channel: "bush",
			emits: "fromBush",
			leftOffset: function () {
				return $(".container").width() - 210;
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
	    createTask(data);
	});

	$('#create-button').on('click', function() {
        var description = $('.modal-footer input.form-control').val();
        var uuid = guid();
        var task = {};
        task.id = uuid;
        task.description = description;
        createTask(task);
         $('.modal-footer input.form-control').val('');
        $('.modal').modal('hide');
    });

    function s4() {
        return Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
    };

    function guid() {
        return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();
    }
});
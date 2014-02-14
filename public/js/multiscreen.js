$(function() {
	var officeName = $(".container").attr("id");
    var offices = {
        "paloAlto" : {
            channel : "paloAlto",
            emits : "fromPaloAlto",
            leftOffset : function() {
                return 10;
            },
            shouldSwitch : function(left) {
                return left < -50;
            } 
        },
        "bush" : {
            channel : "bush",
            emits : "fromBush",
            leftOffset : function() {
                return $(".container").width() - 210;
            },
            shouldSwitch : function(left) {
                return left > $(".container").width() - 140;
            } 
        }
    };

    var office = offices[officeName];
    var socket = io.connect('/');

    var dragOptions = {
        scroll : false,
        create : function(event, ui) {
            //console.log(event);
        },
        snap : ".panel-body",
        snapMode : "inner",
        drag : function(event, ui) {
            var $task = ui.helper;
            
            if (office.shouldSwitch(ui.position.left)) {
                socket.emit(office.emits, {
                    "id" : $task.attr("id"),
                    "description" : $task.text().trim(),
                    "top" : ui.position.top / $(".container").height()
                });
                $task.remove();
            }
        },
        appendTo : "#" + officeName
    };

    var createTask = function(task, left) {
        if ($("#" + task.id).length == 0) {
            var $container = $(".container");
            var leftOffset = left ? left : office.leftOffset();
            $newTask = $("<div id='" + task.id + "' class='unassigned round-corner draggable-item task draggable ui-widget-content'>" + task.description + "</div>");
            $newTask.css("top", $container.height() * Math.abs(task.top) + "px");
            $newTask.css("left", leftOffset + "px");
            $newTask.draggable(dragOptions);
            $container.append($newTask);
        }
    };

    $(".draggable").draggable(dragOptions);

    socket.on('connect', function() {
        socket.emit('room', 'screens');
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
        createTask(task, 40);
        $('.modal-footer input.form-control').val('');
        $('.modal').modal('hide');
    });

    function s4() {
        return Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
    };

    function guid() {
        return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();
    }


    $(".sortable").sortable().disableSelection();
    $(".sortable").droppable({
        activeClass : "ui-state-default",
        hoverClass : "ui-state-hover",
        accept : ".unassigned",
        drop : function(event, ui) {
        	console.log("drop to sortable");
            $(this).find(".placeholder").remove();
            $("<div class='draggable-item round-corner assigned boxed'></div>")
            	.text(ui.draggable.text())
            	.appendTo(this)
            	.draggable(dragOptions2);
            $(ui.draggable).remove();
            //$( "#sortable2 li").draggable(dragOptions);
            //$( "#sortable2").sortable();
        }
    });

    $("#" + officeName).droppable({
    	
        activeClass : "ui-state-default",
        hoverClass : "ui-state-hover",
        accept : ".assigned",
        drop : function(event, ui) {
        	console.log("drop to office");
            $("<div class='draggable-item round-corner unassigned'></div>")
            	.text(ui.draggable.text())
            	.appendTo(this)
            	.draggable(dragOptions2);
            $(ui.draggable).remove();
            //$( "<div class='draggable draggable-item round-corner'></div>" ).text( ui.draggable.text() ).appendTo( this ).draggable({ snap: false });
            //$(ui.draggable).remove();
            //$( "#sortable2 li").draggable(dragOptions);
            //$( "#sortable2").sortable();
        }
    });

    var dragOptions2 = {
        scroll : false,
        create : function(event, ui) {

        },

        snap : false,
        drag : function(event, ui) {
            var $task = ui.helper;
            ui.helper.removeClass("assigned").addClass("unassigned");
 
            if (office.shouldSwitch(ui.helper.offset().left)) {
                socket.emit(office.emits, {
                    "id" : $task.attr("id"),
                    "description" : $task.text().trim(),
                    "top" : ui.position.top / $(".container").height()
                });
                $task.remove();
            }
        }
        //helper: "clone"
    };
});
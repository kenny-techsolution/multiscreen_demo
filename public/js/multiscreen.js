$(function() {
    var office = $(".container").attr("id");
    var address1 = 'http://murmuring-caverns-8060.herokuapp.com';
    var address2 = 'http://localhost:5000';
    var socket = io.connect(address2);
    //console.log(process.env);
    var dragOptions = {
        scroll : false,
        create : function(event, ui) {
            //console.log(event);
        },
        drag : function(event, ui) {
            var screenWidth = $(".container").width();
            var $task = ui.helper;
            var shouldSwitch = function() {
                return ui.position.left > screenWidth - 140 || ui.position.left < -140;
            }
            if (shouldSwitch()) {
                socket.emit(office, {
                    "id" : $task.attr("id"),
                    "description" : $task.text().trim()
                });
                $task.remove();
            }
        }
    }

    var createTask = function(task) {
        $newTask = $("<div id='" + task.id + "' class='task draggable ui-widget-content'>" + task.description + "</div>");
        $(".container").append($newTask);
        $newTask.draggable(dragOptions);
    }

    $(".draggable").draggable(dragOptions);

    socket.on('connect', function() {
        socket.emit('room', 'screens')
    })

    socket.on('paloAlto', function(data) {
        console.log(data);
        createTask(data);
    });

    socket.on('bush', function(data) {
        console.log(data);
        createTask(data);
    });

    $('#create-button').on('click', function() {
        var description = $('.modal-footer input.form-control').val();
        console.log(description);
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
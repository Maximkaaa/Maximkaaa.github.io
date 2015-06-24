(function() {

    var controller = {
        init: function() {
            $$('gearButton').attachEvent('onItemClick', function() {
                $$('dropDown').show(this.getNode(), {x: -8, y: 8});
            });
        }
    };

    app.controllers.push(controller);

})();
(function() {

    var controller = {
        init: function() {
            $$('leftMenu').attachEvent('onItemClick', function(id) {
                $$('main').setValue(id);
            });

            $$('main').attachEvent('onViewChange', function(oldId, newId) {
                $$('leftMenu').select(newId);
            });
        }
    };

    window.app.controllers.push(controller);

})();
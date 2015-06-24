(function() {

    var controller = {
        init: function() {
            webix.ui(app.views.dropDown);

            $$('dropDownMenu').attachEvent('onItemClick', function(id) {
                $$('main').setValue(id);
                $$('dropDown').hide();
            })
        }
    };

    app.controllers.push(controller);

})();
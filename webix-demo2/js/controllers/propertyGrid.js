(function() {

    var controller = {
        init: function() {
            $$('submitButton').attachEvent('onItemClick', function() {
                var data = $$('propertyGrid').getValues();
                $$('output').setHTML(JSON.stringify(data));

                webix.ajax().post('./data/dataSaveUrl', data);
            });
        }
    };

    window.app.controllers.push(controller);

})();
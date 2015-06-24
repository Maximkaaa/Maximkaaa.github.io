(function() {

    window.app = {
        data: [],
        views: {},
        controllers: []
    };

    webix.ready(function() {
        webix.ui(app.layout);

        for (var i = 0; i < app.controllers.length; i++) {
            app.controllers[i].init();
        }
    });

})();
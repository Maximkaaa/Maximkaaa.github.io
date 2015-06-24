(function() {

    var data = window.app.data.map(function(obj) {
        return obj.view;
    });

    var main = {
        id: 'main',
        view: 'multiview',
        cells: data
    };

    window.app.views.main = main;

})();
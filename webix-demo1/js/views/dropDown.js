(function() {

    var dataPages = window.app.data.map(function(obj) {
        return {
            value: obj.label,
            id: obj.view.id
        }
    });

    var dropDown = {
        id: 'dropDown',
        view: 'context',
        width: 160,
        body: {
            id: 'dropDownMenu',
            view: 'menu',
            layout: 'y',
            data: dataPages
        }
    };

    window.app.views.dropDown = dropDown;

})();
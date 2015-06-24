(function() {

    var dataPages = window.app.data.map(function(obj) {
        return {
            label: obj.label,
            id: obj.view.id
        }
    });

    var leftMenu = {
        id: 'leftMenu',
        view: 'list',
        template: '#label#',
        width: 200,
        scroll: false,
        select: true,
        data: dataPages,
        on: {
            onAfterRender: function() {
                this.select(dataPages[0].id);
            }
        }
    };

    window.app.views.leftMenu = leftMenu;

})();
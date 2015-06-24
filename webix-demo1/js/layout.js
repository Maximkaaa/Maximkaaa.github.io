(function() {

    var layout = {
        rows: [
            app.views.topMenu,
            {
                cols: [
                    app.views.leftMenu,
                    {view: 'resizer'},
                    app.views.main
                ]
            }
        ]
    };

    window.app.layout = layout;

})();
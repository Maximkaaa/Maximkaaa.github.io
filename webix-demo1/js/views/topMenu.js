(function() {

    var topMenu = {
        view: 'toolbar',
        cols: [
            { view: 'label', label: '', css: 'logo', width: 32},
            { view: 'label', label: 'Test Interface', width: 120},
            {},
            { id: 'gearButton', view: 'button', type: 'image', image: 'https://upload.wikimedia.org/wikipedia/commons/6/66/Farm-Fresh_cog.png', width: 32, css: 'gearButton'}
        ]
    };

    window.app.views.topMenu = topMenu;

})();
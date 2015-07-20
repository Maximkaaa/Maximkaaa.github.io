(function() {

    var layout = {
        rows: [
            {
                cols: [
                    window.app.views.propertyGrid,
                    { template: 'Output area', id: 'output' }
                ]
            },
            {
                cols: [
                    {},
                    {view: 'button', id: 'submitButton', width: 200, align: 'center', label: 'Submit'},
                    {}
                ]
            }
        ]
    };

    window.app.layout = layout;

})();
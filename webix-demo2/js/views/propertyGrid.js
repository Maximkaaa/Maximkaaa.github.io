(function() {

    var view = {
        id: 'propertyGrid',
        view: 'property',
        nameWidth: 200,
        elements: [
            { label: 'Personal info', type: 'label' },
            { label: 'First Name', id: 'firstName', type: 'text' },
            { label: 'Last Name', id: 'lastName', type: 'text'},
            { label: 'Favourite color', id: 'color', type: 'color' },
            { label: 'Public info', type: 'label' },
            { label: 'Number of balloons popped', id: 'balloonNo', type: 'text'},
            { label: 'Wants to pop more', id: 'balloonDes', type: 'checkbox'}
        ],

        url: './data/data.json'
    };

    window.app.views.propertyGrid = view;

})();
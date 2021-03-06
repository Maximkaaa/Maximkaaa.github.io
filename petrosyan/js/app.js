jQuery(function ($) {

    var selectable = $('#wrapper').nuSelectable({
        items: 'rect',
        selectionClass: 'selection',
        selectedClass: 'active',
        autoRefresh: true,
        selectionButton: 'left',
        enabled: false,
        onSelectionEnd: function(items) {
            console.log(items.length);
        },
        preserveSelection: true
    });

    $(document).on('keydown', function(event) {
        // Esc key press
        if (event.which === 27) {
            selectable.nuSelectable('clear');
        } else if (event.which === 8) { // backspace
            selectable.nuSelectable('disable');
            event.preventDefault();
        } else if (event.which === 13) { // enter
            selectable.nuSelectable('enable');
        } else if (event.which === 46) { //delete
            selectable.nuSelectable('destroy');
        }
    });

    svgPanZoom($('#wrapper svg').get(0), {
        dragEnabled: false,
        zoomEnabled: true,
        controlIconsEnabled: true,
        dblClickZoomEnabled: true,
        fit: true,
        panButton: 'right'
    });

});
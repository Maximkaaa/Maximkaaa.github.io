jQuery(function ($) {

    var selectable = $('#wrapper').nuSelectable({
        items: 'rect',
        selectionClass: 'selection',
        selectedClass: 'active',
        autoRefresh: true,
        selectionButton: 'left',
        onSelectionEnd: function(items) {
            console.log(items.length);
        },
        preserveSelection: true
    });

    $(document).on('keydown', function(event) {
        // Esc key press
        if (event.which === 27) {
            selectable.nuSelectable('clear');
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
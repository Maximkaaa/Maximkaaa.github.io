jQuery(function ($) {

    $('#wrapper').nuSelectable({
        items: 'rect',
        selectionClass: 'selection',
        selectedClass: 'active',
        autoRefresh: true,
        selectionButton: 'left',
        onSelectionEnd: function(items) {
            console.log(items.length);
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
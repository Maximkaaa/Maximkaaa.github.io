require.config({

});

require(['Visualizer', 'Pixel', 'WarProcessor'], function(Visualizer, Pixel, WarProcessor) {
    var visualizer = new Visualizer(document.body);

    var pixel = new Pixel({x: 0, y: 0, color: 'blue', main: 'js/pixels/dummy2.js'});
    var pixel2 = new Pixel({x: 50, y: 25, color: 'red', main: 'js/pixels/dummy2.js'});
    var pixel3 = new Pixel({x: 50, y: 55, color: 'green', main: 'js/pixels/dummy1.js'});
    var pixel4 = new Pixel({x: 50, y: 75, color: 'purple', main: 'js/pixels/dummy1.js'});
    var pixel5 = new Pixel({x: 80, y: 75, color: 'white', main: 'js/pixels/dummy1.js'});

    var warProcessor = new WarProcessor(visualizer, [pixel, pixel2, pixel3, pixel4, pixel5]);
});
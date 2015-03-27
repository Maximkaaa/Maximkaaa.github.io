define(function() {

    var Visualizer = function(container) {
        this._container = container;
    };

    Visualizer.prototype = {
        _pixelSize: 5,
        xn: 100,
        yn: 100,
        _background: '#aaa',
        _inactiveColor: '#555',

        setField: function() {
            this._canvas = document.createElement('canvas');
            this._ctx = this._canvas.getContext('2d');

            this._canvas.width = this._pixelSize * this.xn;
            this._canvas.height = this._pixelSize * this.yn;

            this._clear();

            this._container.appendChild(this._canvas);
        },

        _clear: function() {
            this._ctx.fillStyle = this._background;
            this._ctx.fillRect(0,0, this._canvas.width, this._canvas.height);
        },

        draw: function(pixels) {
            this._clear();
            for (var i = 0; i < pixels.length; i++) {
                var pixel = pixels[i];
                this._ctx.fillStyle = pixel.active ? pixel.color : this._inactiveColor;
                this._ctx.fillRect(pixel.x * this._pixelSize, pixel.y * this._pixelSize, this._pixelSize, this._pixelSize);
            }
        }
    };

    return Visualizer;

});
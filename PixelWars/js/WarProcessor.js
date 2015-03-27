define(['Pixel'], function(Pixel) {

    var WarProcessor = function(visualizer, pixels) {
        this._visualizer = visualizer;

        this._pixels = [];
        this._activePixels = [];
        this._pixelIndex = [];

        this._setActivePixels(pixels);
        //this._pixels = pixels.slice();
        //this._activePixels = pixels.slice();

        this._setInactivePixels();

        this._visualizer.xn = this.xn;
        this._visualizer.yn = this.yn;
        this._visualizer.setField();

        this._processTact();
    };

    WarProcessor.prototype = {
        tact: 500,
        xn: 100,
        yn: 100,
        inactiveN: 100,

        _processTact: function() {
            this._visualizer.draw(this._pixels);

            this._killPixels();
            this._processPixelCommands();

            var self = this;
            this._timer = setTimeout(function() {
                self._processTact();
            }, this.tact);
        },

        _killPixels: function() {
            for (var i = this._activePixels.length - 1; i >= 0; i--) {
                var pixel = this._activePixels[i];
                if (pixel.worker && !pixel.worker.responded) {
                    this._killPixel(pixel, i);
                }
            }
        },

        _killPixel: function(pixel, i) {
            pixel.worker.terminate();
            delete pixel.worker;
            this._activePixels.splice(i, 1);

            pixel.active = false;
        },

        _setActivePixels: function(pixels) {
            for (var i = 0; i < pixels.length; i++) {
                this._pixels.push(pixels[i]);
                this._activePixels.push(pixels[i]);

                this._addToIndex(pixels[i]);
            }
        },

        _setInactivePixels: function() {
            for (var i = 0; i < this.inactiveN; i++) {
                var x = Math.round(Math.random() * this.xn);
                var y = Math.round(Math.random() * this.yn);

                if (!this._getPixelAt(x, y)) {
                    var pixel = new Pixel({x: x, y: y});
                    pixel.active = false;
                    this._pixels.push(pixel);

                    this._addToIndex(pixel);
                }
            }
        },

        _addToIndex: function(pixel) {
            this._removeFromIndex(pixel);
            this._pixelIndex[this.xn * pixel.x + pixel.y] = pixel;
        },

        _removeFromIndex: function(pixel) {
            var index = this._pixelIndex.indexOf(pixel);
            if (index !== -1) delete this._pixelIndex[index];
        },

        _getPixelAt: function(x, y) {
            x = adjust(x, this.xn);
            y = adjust(y, this.yn);
            return this._pixelIndex[this.xn * x + y];
        },

        _getPixelIdAt: function(x, y) {
            var pixel = this._getPixelAt(x, y);
            if (pixel) {
                return pixel.active ? pixel.id : 0;
            } else {
                return null;
            }
        },

        _processPixelCommands: function() {
            var self = this;
            for (var i = 0; i < this._activePixels.length; i++) {
                var pixel = this._activePixels[i];
                if (!pixel.worker) {
                    pixel.worker = new Worker(pixel.main);

                    pixel.worker.onmessage = function(pixel, e) {
                        this.responded = true;
                        var command = e.data;
                        self._processCommand(pixel, command);
                    }.bind(pixel.worker, pixel);
                }

                var worker = pixel.worker;

                if (worker) {
                    worker.responded = false;
                    worker.postMessage({x: pixel.x, y: pixel.y, s1: this._getS1(pixel), s2: pixel.s2});
                    pixel.s2 = null;
                }
            }
        },

        _processCommand: function(pixel, command) {
            var operation = command.charAt(0);
            if (commands[operation]) {
                var direction = getDirection(command.slice(1));
                if (direction) commands[operation](this, pixel, direction);
            }
        },

        _getS1: function(pixel) {
            var x = pixel.x;
            var y = pixel.y;
            return [this._getPixelIdAt(x, y-1), this._getPixelIdAt(x+1,y), this._getPixelIdAt(x,y+1), this._getPixelIdAt(x-1,y)];
        },

        _removePixel: function(pixel) {
            var index = this._pixels.indexOf(pixel);
            if (index !== -1) this._pixels.splice(index, 1);

            index = this._activePixels.indexOf(pixel);
            if (index !== -1) {
                this._killPixel(pixel);
                this._activePixels.splice(index, 1);
            }

            this._removeFromIndex(pixel);
        }
    };

    var commands = {
        m: function(wp, p, d) {
            var pixel = wp._getPixelAt(p.x + d.x, p.y + d.y);
            if (!pixel) {
                p.x = adjust(p.x + d.x, wp.xn);
                p.y = adjust(p.y + d.y, wp.yn);
                wp._addToIndex(p);
            }
        },
        d: function(wp, p, d) {
            var pixel = wp._getPixelAt(p.x + d.x, p.y + d.y);
            if (pixel) {
                wp._removePixel(pixel);
            }
        },
        s: function(wp, p, d) {
            var axis = d.x ? 'xn' : 'yn';
            var value = d.x ? d.x : d.y;
            for (var i = 1; i <= wp[axis]; i++) {
                var id = wp._getPixelIdAt(p.x + d.x * i, p.y + d.y * i);
                if (id !== null) {
                    p.s2 = {id: id, distance: i};
                    break;
                }
            }
        },
        w: function(wp, p, d) {
            var pixel = wp._getPixelAt(p.x + d.x, p.y + d.y);
            if (pixel) {
                pixel.color = p.color;
                pixel.main = p.main;
                if (!pixel.active) {
                    pixel.active = true;
                    wp._activePixels.push(pixel);
                }
            }
        }
    };

    function adjust(n, max) {
        var result;
        if (n < 0) {
            result = n + Math.floor(-n / max) * max + max;
        } else if (n >= max) {
            result = n % max;
        } else {
            result = n;
        }
        return result;
    }

    function getDirection(s) {
        if (s === 'x' || s === 'x+') {
            return {x: 1, y: 0};
        } else if (s === 'x-') {
            return {x: -1, y: 0};
        } else if (s === 'y' || s === 'y+') {
            return {x: 0, y: 1};
        } else if (s === 'y-') {
            return {x: 0, y: -1};
        }
    }

    return WarProcessor;

});
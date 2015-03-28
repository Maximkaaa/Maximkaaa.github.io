define(['Pixel', 'OnlineWorker'], function(Pixel, OnlineWorker) {

    var WarProcessor = function(visualizer, pixels) {
        this._visualizer = visualizer;

        this._users = [];
        this._pixels = [];
        this._pixelIndex = [];

        this._setActivePixels(pixels);

        this._setInactivePixels();

        this._visualizer.xn = this.xn;
        this._visualizer.yn = this.yn;
        this._visualizer.setField();

        this._processTact();
    };

    WarProcessor.prototype = {
        tact: 300,
        xn: 100,
        yn: 100,
        inactiveN: 500,

        _processTact: function() {
            this._visualizer.draw(this._pixels);

            this._killInactiveUsers();
            this._processPixelCommands();

            var self = this;
            this._timer = setTimeout(function() {
                self._processTact();
            }, this.tact);
        },

        _killInactiveUsers: function() {
            for (var i = this._users.length - 1; i >= 0; i--) {
                var user = this._users[i];
                if (user.worker && !user.worker.responded || user.length === 0) {
                    user.worker.terminate();

                    for (var j = 0; j < user.length; j++) {
                        this._killPixel(user[j]);
                    }
                }
            }
        },

        _killPixel: function(pixel) {
            for (var i = 0; i < this._users.length; i ++) {
                var index = this._users[i].indexOf(pixel);
                if (index !== -1) {
                    this._users[i].splice(index, 1);
                    pixel.active = false;
                }

            }
        },

        _setActivePixels: function(pixels) {
            for (var i = 0; i < pixels.length; i++) {
                this._users.push([pixels[i]]);
                if (pixels[i].url) {
                    this._users[i].url = pixels[i].url;
                } else {
                    this._users[i].main = pixels[i].main;
                }
                this._pixels.push(pixels[i]);

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
            for (var i = 0; i < this._users.length; i++) {
                var user = this._users[i];
                if (!user.worker) {
                    if (user.url) {
                        user.worker = new OnlineWorker(user.url);
                    } else {
                        user.worker = new Worker(user.main);
                    }

                    user.worker.onmessage = function(user, e) {
                        this.responded = true;
                        var commands = e.data;
                        self._processUserCommands(user, commands);
                    }.bind(user.worker, user);
                }

                var worker = user.worker;

                if (worker) {
                    worker.responded = false;

                    var message = [];
                    for (var j = 0; j < user.length; j++) {
                        var pixel = user[j];
                        message.push({id: pixel.id, x: pixel.x, y: pixel.y, s1: this._getS1(pixel), s2: pixel.s2});
                        pixel.s2 = null;
                    }

                    worker.postMessage(message);
                }
            }
        },

        _processUserCommands: function(user, commands) {
            var pixels = user.slice();
            for (var i = 0; i < pixels.length; i++) {
                if (!commands || commands[i] instanceof Error) {
                    this._killPixel(pixels[i]);
                } else {
                    this._processCommand(pixels[i], commands[i], user);
                }
            }
        },

        _processCommand: function(pixel, command, user) {
            var operation = command.charAt(0);
            if (commands[operation]) {
                var direction = getDirection(command.slice(1));
                if (direction) {
                    commands[operation](this, pixel, direction, user);
                    pixel.direction = direction;
                }
            }
        },

        _getS1: function(pixel) {
            var x = pixel.x;
            var y = pixel.y;
            var d = pixel.direction || {x: 0, y: -1};
            for (var i = 1; i < 3; i++) {
                var id = this._getPixelIdAt(x + d.x * i, y + d.y * i);
                if (id !== null) return id;
            }
            return null;
        },

        _removePixel: function(pixel) {
            var index = this._pixels.indexOf(pixel);
            if (index !== -1) this._pixels.splice(index, 1);
            this._killPixel(pixel);
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
            for (var i = 1; i < 3; i++) {
                var pixel = wp._getPixelAt(p.x + d.x * i, p.y + d.y * i);
                if (pixel) {
                    wp._removePixel(pixel);
                    return;
                }
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
        w: function(wp, p, d, user) {
            var pixel = wp._getPixelAt(p.x + d.x, p.y + d.y);
            if (pixel) {
                wp._killPixel(pixel);

                pixel.color = p.color;
                pixel.main = p.main;
                pixel.active = true;

                user.push(pixel);
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
/**
 * nuSelectable - jQuery Plugin
 * Copyright (c) 2015, Alex Suyun
 * Copyrights licensed under The MIT License (MIT)
 */
;
(function($, window, document, undefined) {

    'use strict';

    var plugin = 'nuSelectable';

    var defaults = {
        enabled: true,
        onSelect: function() {},
        onUnSelect: function() {},
        onClear: function() {},
        onSelectionEnd: function() {},
        selectionButton: 'left',
        preserveSelection: false
    };

    var nuSelectable = function(container, options) {
        this.container = $(container);
        this.options = $.extend({}, defaults, options);
        this.selection = $('<div>')
            .addClass(this.options.selectionClass);
        this.items = $(this.options.items);
        this.init();
    };

    nuSelectable.prototype.init = function() {
        if (!this.options.autoRefresh) {
            this.itemData = this._cacheItemData();
        }
        this.selecting = false;
        this._normalizeContainer();
        
        if (this.options.enabled) {
            this._bindEvents();
        }
        
        return true;
    };

    nuSelectable.prototype._normalizeContainer = function() {
        this.container.css({
            '-webkit-touch-callout': 'none',
            '-webkit-user-select': 'none',
            '-khtml-user-select': 'none',
            '-moz-user-select': 'none',
            '-ms-user-select': 'none',
            'user-select': 'none'
        });
    };

    nuSelectable.prototype._cacheItemData = function() {
        var itemData = [],
            itemsLength = this.items.length;

        for (var i = 0, item; item = $(this.items[i]), i <
        itemsLength; i++) {
            if (!$.contains(document.documentElement, item[0])) continue;

            itemData.push({
                element: item,
                selected: item.hasClass(this.options.selectedClass),
                selecting: false,
                position: item[0].getBoundingClientRect()
            });
        }
        return itemData;
    };

    nuSelectable.prototype._collisionDetector = function() {
        if (!$.contains(document.documentElement, this.selection[0])) return;
        var selector = this.selection[0].getBoundingClientRect(),
            dataLength = this.itemData.length;

        // Using native for loop vs $.each for performance (no overhead)
        for (var i = dataLength - 1, item; item = this.itemData[i], i >=
        0; i--) {
            var collided = !(selector.right < item.position.left ||
            selector.left > item.position.right ||
            selector.bottom < item.position.top ||
            selector.top > item.position.bottom);

            if (collided) {
                // if (item.selected) {
                //     item.element.removeClass(this.options.selectedClass);
                //     item.selected = false;
                // }
                if (!item.selected && !item.selecting) {
                    item.element.addClass(this.options.selectedClass);
                    if (this.selecting) {
                        item.selected = true;
                    } else {
                        item.selecting = true;
                    }
                    this.options.onSelect(item.element);
                }
            }
            else {
                if (this.selecting || item.selecting) {
                    item.element.removeClass(this.options.selectedClass);
                    item.selected = false;
                    item.selecting = false;
                    this.options.onUnSelect(item.element);
                }
            }

        }
    };

    nuSelectable.prototype._createSelection = function(x, y) {
        this.selection.css({
            'position': 'absolute',
            'top': y + 'px',
            'left': x + 'px',
            'width': '0',
            'height': '0',
            'z-index': '999',
            'overflow': 'hidden'
        })
            .appendTo(this.container);
    };

    nuSelectable.prototype._drawSelection = function(width, height, x,
                                                     y) {
        this.selection.css({
            'width': width,
            'height': height,
            'top': y,
            'left': x
        });
    };

    nuSelectable.prototype.clear = function() {
        this.items.removeClass(this.options.selectedClass);
        this.options.onClear();
    };

    var buttons = ['left', 'middle', 'right'];

    nuSelectable.prototype._mouseDown = function(event) {
        if (buttons[event.button] !== this.options.selectionButton) return;

        event.preventDefault();
        event.stopPropagation();
        if (this.options.disable) {
            return false;
        }
        if (this.options.autoRefresh) {
            this.itemData = this._cacheItemData();
        }
        if (event.metaKey || event.ctrlKey || this.options.preserveSelection) {
            this.selecting = false;
        }
        else {
            this.selecting = true;
        }

        this.startDrawing = true;

        this.pos = getOffset(this.container.offsetParent(), event);

    };

    function getOffset(container, event) {
        var offset = container.offset();
        return [event.pageX - offset.left, event.pageY - offset.top];
    }

    nuSelectable.prototype._mouseMove = function(event) {
        if (buttons[event.button] !== this.options.selectionButton) return;


        event.preventDefault();
        event.stopPropagation();
        // Save some bytes
        var pos = this.pos;
        if (!pos) {
            return false;
        }
        var newpos = getOffset(this.container.offsetParent(), event),
            width = Math.abs(newpos[0] - pos[0]),
            height = Math.abs(newpos[1] - pos[1]),
            top, left;

        if (this.startDrawing && width > 2 && height > 2 && (!this.selection || this.selection.parent().length === 0)) {
            this._createSelection(this.pos[0], this.pos[1]);
            this.startDrawing = false;
        }

        top = (newpos[0] < pos[0]) ? (pos[0] - width) : pos[0];
        left = (newpos[1] < pos[1]) ? (pos[1] - height) : pos[1];
        this._drawSelection(width, height, top, left);
        this._collisionDetector();

    };

    nuSelectable.prototype._mouseUp = function(event) {
        if (buttons[event.button] !== this.options.selectionButton) return;

        this.startDrawing = false;

        event.preventDefault();
        event.stopPropagation();
        if (!this.pos) {
            return false;
        }
        this.selecting = false;
        this.selection.remove();
        var offset = getOffset(this.container.offsetParent(), event);
        if (!this.options.preserveSelection && offset[0] === this.pos[0] && offset[1] === this.pos[1]) {
            this.clear();
        }

        this._handleSelectionEnd();
    };
    
    nuSelectable.prototype._handleSelectionEnd = function() {
        this.itemData.forEach(function(item) {
            if (item.selecting) {
                item.selected = true;
                item.selecting = false;
            }
        });

        var selected = this.itemData.filter(function(item) { return item.selected; }).map(function(item) { return item.element; });
        if (typeof this.options.onSelectionEnd === 'function') this.options.onSelectionEnd(selected); 
    };

    nuSelectable.prototype._bindEvents = function() {
        if (this._isBound) return;
        
        this.container.on('mousedown.nuSelectable', $.proxy(this._mouseDown, this));
        this.container.on('mousemove.nuSelectable', $.proxy(this._mouseMove, this));
        // Binding to document is 'safer' than the container for mouse up
        $(document)
            .on('mouseup.nuSelectable', $.proxy(this._mouseUp, this));

        if (this.options.selectionButton === 'right') this.container.on('contextmenu.nuSelectable', function(event) {
            event.preventDefault();
        });
        
        this._isBound = true;
    };
    
    nuSelectable.prototype._unbindEvents = function() {
        this.container.off('.nuSelectable');
        $(document).off('.nuSelectable');
        this._isBound = false;
    };

    nuSelectable.prototype.enable = function() {
        this._bindEvents();
    };

    nuSelectable.prototype.disable = function() {
        this._unbindEvents();
    };

    nuSelectable.prototype.destroy = function() {
        this.disable();
        this.clear();
        this.container.removeData(plugin);
    };

    $.fn[plugin] = function(options) {
        var args = Array.prototype.slice.call(arguments, 1);

        return this.each(function() {
            var item = $(this),
                instance = item.data(plugin);
            if (!instance && options && options.items) {
                item.data(plugin, new nuSelectable(this, options));
            }
            else {
                if (typeof options === 'string' && options[0] !== '_' &&
                    options !== 'init') {
                    instance[options].apply(instance, args);
                }
            }

        });
    };

})(jQuery, window, document);
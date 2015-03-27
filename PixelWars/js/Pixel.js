define(function() {

    var id = 1;
    function getId() {
        return id++;
    }

    var Pixel = function(parameters) {
        this.x = parameters.x;
        this.y = parameters.y;
        this.color = parameters.color;
        this.id = getId();

        if (parameters.main) this.main = parameters.main;
    };

    Pixel.prototype = {
        main: null,
        active: true
    };

    return Pixel;
});
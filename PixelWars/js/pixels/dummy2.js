onmessage = function(e){

    var thisObject= e.data;
    postMessage(main.call(thisObject));
};

var counter = -1;
var directions = ['y-', 'x', 'y', 'x-'];

var targetAt = {};

function main() {
    if (this.s2 && this.s2.distance < 20) {
        console.dir(this.s2);
        targetAt = {
            direction: directions[counter],
            distance: this.s2.distance
        };
    }

    if (targetAt.direction) {
        if (targetAt.distance > 1) {
            targetAt.distance--;
            return 'm' + targetAt.direction;
        } else {
            var direction = targetAt.direction;
            targetAt = {};
            return 'w' + direction;
        }
    } else {
        if (counter < 3) {
            counter++;
            return 's' + directions[counter];
        } else {
            counter = -1;
            return 'mx';
        }
    }
}

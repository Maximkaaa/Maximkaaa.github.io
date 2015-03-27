onmessage = function(e){

    var thisObject= e.data;
    postMessage(main.call(thisObject));
};

var counter = 0;
var operations = ['y-', 'x', 'y', 'x-'];
function main() {
    for (var i = 0; i < 4; i++) {
        if (this.s1[i] !== null) {
            console.log('lets kill');
            return 'd' + operations[i];
        }
    }

    return 'm' + operations[Math.floor(Math.random() * 4)];
}

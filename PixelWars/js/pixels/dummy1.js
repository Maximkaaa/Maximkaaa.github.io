onmessage = function(e){

    var messages = e.data;
    var responses = [];
    for (var i = 0; i < messages.length; i++) {
        var response;
        try {
            response = main.call(messages[i]);
        } catch (e) {
            response = e;
        }

        responses.push(response);
    }

    postMessage(responses);
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

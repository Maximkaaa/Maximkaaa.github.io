(function() {
    var contexts = [];

    onmessage = function (e) {

        var messages = e.data;

        var responses = [];
        for (var i = 0; i < messages.length; i++) {
            for (var j = 0; j < contexts.length; j++) {
                if (contexts[j].id === messages[i].id) {
                    for (var key in contexts[j]) {
                        if (contexts[j].hasOwnProperty(key) && messages[i][key] === undefined) {
                            messages[i][key] = contexts[j][key];
                        }
                    }
                }
            }

            var response;
            try {
                response = main.call(messages[i]);
            } catch (e) {
                response = e;
            }

            responses.push(response);
        }

        contexts = messages;

        postMessage(responses);
    };
})();


var operations = ['y-', 'x', 'y', 'x-'];
function main() {
    if (this.s1 !== null) {
            return 'd' + this.d;
    }

    this.d = operations[Math.floor(Math.random() * 4)];
    return 'm' + this.d;
}

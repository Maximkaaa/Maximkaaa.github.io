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

var directions = ['y-', 'x', 'y', 'x-'];
function main() {
    if (this.counter === undefined) this.counter = -1;
    if (this.targetAt === undefined) this.targetAt = {};

    if (this.s2 && this.s2.distance < 20) {
        this.targetAt = {
            direction: directions[this.counter],
            distance: this.s2.distance
        };
    }

    if (this.targetAt.direction) {
        if (this.targetAt.distance > 1) {
            this.targetAt.distance--;
            return 'm' + this.targetAt.direction;
        } else {
            var direction = this.targetAt.direction;
            this.targetAt = {};
            return 'w' + direction;
        }
    } else {
        if (this.counter < 3) {
            this.counter++;
            return 's' + directions[this.counter];
        } else {
            this.counter = -1;
            return 'mx';
        }
    }
}

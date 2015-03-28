var operations = ['y-', 'x', 'y', 'x-'];
function main() {
    if (this.s1 !== null) {
        return 'd' + this.d;
    }

    this.d = operations[Math.floor(Math.random() * 4)];
    return 'm' + this.d;
}

module.exports = main;
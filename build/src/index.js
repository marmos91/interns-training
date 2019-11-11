"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Challenge = /** @class */ (function () {
    function Challenge() {
    }
    Challenge.prototype.buzz = function (value) {
        return new Promise(function (resolve, reject) {
            if ((value % 3 === 0) && (value % 5 === 0)) {
                return resolve('fizzbuzz');
            }
            else if (value % 3 == 0) {
                return resolve('fizz');
            }
            else if (value % 5 == 0) {
                return resolve('buzz');
            }
            else
                return resolve(value);
        });
    };
    return Challenge;
}());
exports.Challenge = Challenge;

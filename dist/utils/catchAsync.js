"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = (fn) => {
    return (req, res, next) => {
        fn(req, res, next).catch(next); // Propagate errors to global error handler
    };
};
//error ends up in global error handler
//* .catch(err => next(err)); is equivalant to .catch(next);
//# sourceMappingURL=catchAsync.js.map
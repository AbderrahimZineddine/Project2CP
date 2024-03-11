"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getMe = void 0;
const getMe = (req, res, next) => {
    req.params.id = req.user.id;
    next();
};
exports.getMe = getMe;
//# sourceMappingURL=getMe.js.map
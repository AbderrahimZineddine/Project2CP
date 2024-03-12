"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const body_parser_1 = __importDefault(require("body-parser"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const compression_1 = __importDefault(require("compression"));
const cors_1 = __importDefault(require("cors"));
const path_1 = __importDefault(require("path"));
const appError_1 = __importDefault(require("./utils/appError"));
const userRouter_1 = __importDefault(require("./routes/userRouter"));
const workerRouter_1 = __importDefault(require("./routes/workerRouter"));
const authRouter_1 = __importDefault(require("./routes/authRouter"));
const morgan_1 = __importDefault(require("morgan"));
const errorController_1 = __importDefault(require("./controller/errorController"));
const app = (0, express_1.default)();
app.use((0, compression_1.default)());
app.use((0, cookie_parser_1.default)());
app.use(body_parser_1.default.urlencoded({
    extended: false,
}));
app.use(body_parser_1.default.json());
// app.use(express.urlencoded({extended:true})); //TODO i donno
app.use((0, cors_1.default)());
app.options('*', (0, cors_1.default)());
app.use((0, morgan_1.default)('dev'));
// app.use(express.static(path.join(__dirname, '/public')));
app.use(express_1.default.static(path_1.default.join(__dirname, '/src/public')));
app.use('/api/v1/users', userRouter_1.default);
app.use('/api/v1/workers', workerRouter_1.default);
app.use('/api/v1/auth', authRouter_1.default);
app.all('*', (req, res, next) => {
    // express knows that it's an error ( anything is assumed to be an error )
    // const err = new Error(`Can't find ${req.originalUrl} on this server`);
    // err.status = 'fail';
    // err.statusCode = 404;
    next(new appError_1.default(`Can't find ${req.originalUrl} on this server`, 404));
});
app.use(errorController_1.default);
// app.use(function (err: any, req: any, res: any, next: any) {
//   console.log('This is the invalid field ->', err.field)
//   next(err)
// })
exports.default = app;
//# sourceMappingURL=app.js.map
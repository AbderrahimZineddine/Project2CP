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
const portfolioRouter_1 = __importDefault(require("./routes/portfolioRouter"));
const certificateRouter_1 = __importDefault(require("./routes/certificateRouter"));
const authRouter_1 = __importDefault(require("./routes/authRouter"));
const postRouter_1 = __importDefault(require("./routes/postRouter"));
const applicationRouter_1 = __importDefault(require("./routes/applicationRouter"));
const dealRouter_1 = __importDefault(require("./routes/dealRouter"));
const reviewRouter_1 = __importDefault(require("./routes/reviewRouter"));
const validationRequestRouter_1 = __importDefault(require("./routes/validationRequestRouter"));
const dashboardRouter_1 = __importDefault(require("./routes/dashboardRouter"));
const modRouter_1 = __importDefault(require("./routes/modRouter"));
const morgan_1 = __importDefault(require("morgan"));
const errorController_1 = __importDefault(require("./controller/errorController"));
const app = (0, express_1.default)();
app.use((0, compression_1.default)());
app.use((0, cookie_parser_1.default)());
app.use(body_parser_1.default.urlencoded({
    extended: true,
}));
app.use(body_parser_1.default.json());
// app.use(ExpressFormidable());
// app.use(multer().any());
// app.use(express.urlencoded({extended:true})); //TODO i donno
const allowedOrigins = [
    'http://localhost:5174',
    'http://127.0.0.1:5173',
    'https://easyhome-lcvx.onrender.com',
    '*',
];
app.use((0, cors_1.default)({
    origin: function (origin, callback) {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        }
        else {
            callback(new appError_1.default('Not allowed by CORS', 405));
        }
    },
    credentials: true, // Allow credentials
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
}));
// app.use(cors());
// // app.use(cors({ origin: 'https://easyhome-lcvx.onrender.com' })); // Set allowed origin here
// app.options('*', cors());
app.use((0, morgan_1.default)('dev'));
// app.use(express.static(path.join(__dirname, '/public')));
app.use(express_1.default.static(path_1.default.join(__dirname, '/src/public')));
app.use('/api/v1/auth', authRouter_1.default);
app.use('/api/v1/validationRequests', validationRequestRouter_1.default);
app.use('/api/v1/reviews', reviewRouter_1.default);
app.use('/api/v1/deals', dealRouter_1.default);
app.use('/api/v1/applications', applicationRouter_1.default);
app.use('/api/v1/users/posts', postRouter_1.default);
app.use('/api/v1/users', userRouter_1.default);
app.use('/api/v1/workers/certificates', certificateRouter_1.default);
app.use('/api/v1/workers/portfolioPosts', portfolioRouter_1.default);
app.use('/api/v1/workers', workerRouter_1.default);
app.use('/api/v1/dashboard', dashboardRouter_1.default);
app.use('/api/v1/mod', modRouter_1.default);
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
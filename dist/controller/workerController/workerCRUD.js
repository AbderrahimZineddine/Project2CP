"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteWorker = exports.updateWorker = exports.createWorker = exports.getWorker = exports.getAllWorkers = void 0;
const Worker_1 = require("../../models/Worker");
const handlerFactory_1 = require("../handlerFactory");
exports.getAllWorkers = (0, handlerFactory_1.getAll)(Worker_1.Worker);
exports.getWorker = (0, handlerFactory_1.getOne)(Worker_1.Worker);
exports.createWorker = (0, handlerFactory_1.createOne)(Worker_1.Worker);
exports.updateWorker = (0, handlerFactory_1.updateOne)(Worker_1.Worker);
exports.deleteWorker = (0, handlerFactory_1.deleteOne)(Worker_1.Worker);
//# sourceMappingURL=workerCRUD.js.map
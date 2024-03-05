import { Worker } from '../../models/Worker';
import {
  createOne,
  deleteOne,
  getAll,
  getOne,
  updateOne,
} from '../handlerFactory';

export const getAllWorkers = getAll(Worker);

export const getWorker = getOne(Worker);

export const createWorker = createOne(Worker);

export const updateWorker = updateOne(Worker);

export const deleteWorker = deleteOne(Worker);

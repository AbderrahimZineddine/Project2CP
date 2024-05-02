import { Deal } from '../models/Deal';
import { getDealById, getDealsFromUserById, getDealsFromWorkerById, getMyDeals } from './dealController/getMyDeals';
import { deleteOne, getAll, getOne } from './handlerFactory';
import { updateDeal } from './dealController/updateDeal';
import {
  finishDealAccept,
  finishDealDecline,
  finishDealRequest,
} from './dealController/finishDeal';
import {
  checkOwnerDeal,
  showDeletedMiddleware,
  sortMiddleware,
} from './dealController/checkOwnerDeal';
import { ValidateDealInputs, createDeal } from './dealController/createDeal';

const dealController = {
  createDeal: createDeal,
  ValidateDealInputs: ValidateDealInputs,
  getMyDeals: getMyDeals,
  getDealById: getDealById,
  updateDeal: updateDeal,
  finishDealDecline: finishDealDecline,
  finishDealAccept: finishDealAccept,
  finishDealRequest: finishDealRequest,
  deleteDealById: deleteOne(Deal),
  getDealsFromUserById : getDealsFromUserById,
  getDealsFromWorkerById : getDealsFromWorkerById,
  getAllDeals: getAll(Deal),
  showDeletedMiddleware : showDeletedMiddleware,
  checkOwnerDeal: checkOwnerDeal,
  sortMiddleware: sortMiddleware,
};
export default dealController;

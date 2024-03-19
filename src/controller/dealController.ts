import { Deal } from '../models/Deal';
import { getDealById, getMyDeals } from './dealController/getMyDeals';
import { deleteOne, getOne } from './handlerFactory';
import { updateDeal } from './dealController/updateDeal';
import {
  finishDealDecline,
  finishDealRequest,
} from './dealController/finishDeal';
import { checkOwnerDeal } from './dealController/checkOwnerDeal';
import { ValidateDealInputs, createDeal } from './dealController/createDeal';

const dealController = {
  createDeal: createDeal,
  ValidateDealInputs: ValidateDealInputs,
  getMyDeals: getMyDeals,
  getDealById: getDealById,
  updateDeal: updateDeal,
  finishDealDecline: finishDealDecline,
  finishDealRequest: finishDealRequest,
  deleteDealById: deleteOne(Deal),
  checkOwnerDeal: checkOwnerDeal,
};
export default dealController;

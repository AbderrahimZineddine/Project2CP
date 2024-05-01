import { getAll } from '../handlerFactory';
import { checkOwnerPortfolioPost } from './portfolioPostController.ts/checkOwnerPortfolioPost';
import { createPortfolioPost } from './portfolioPostController.ts/createPortfolioPost';
import { deletePortfolioPostById } from './portfolioPostController.ts/deletePortfolioPost';
import { getMyPortfolioPosts, getPortfolioPostById, getPortfolioPostsFromWorkerById } from './portfolioPostController.ts/getPortfolioPostById';
import { ToggleLikePortfolioPost } from './portfolioPostController.ts/likePortfolioPost';
import { updatePortfolioPost } from './portfolioPostController.ts/updatePortfolioPost';
import { PortfolioPost } from '../../models/PortfolioPost';

const portfolioPostsController = {
  getAllPortfolioPosts : getAll(PortfolioPost),
  getPortfolioPostsFromWorkerById : getPortfolioPostsFromWorkerById,
  getMyPortfolioPosts : getMyPortfolioPosts,
  createPortfolioPost: createPortfolioPost,
  updatePortfolioPost: updatePortfolioPost,
  getPortfolioPostById: getPortfolioPostById,
  checkOwnerPortfolioPost: checkOwnerPortfolioPost,
  deletePortfolioPostById: deletePortfolioPostById,
  toggleLikePortfolioPost: ToggleLikePortfolioPost,
};

export default portfolioPostsController;

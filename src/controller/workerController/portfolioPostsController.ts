import { checkOwnerPortfolioPost } from './portfolioPostController.ts/checkOwnerPortfolioPost';
import { createPortfolioPost } from './portfolioPostController.ts/createPortfolioPost';
import { deletePortfolioPostById } from './portfolioPostController.ts/deletePortfolioPost';
import { getPortfolioPostById } from './portfolioPostController.ts/getPortfolioPostById';
import { ToggleLikePortfolioPost } from './portfolioPostController.ts/likePortfolioPost';
import { updatePortfolioPost } from './portfolioPostController.ts/updatePortfolioPost';

const portfolioPostsController = {
  createPortfolioPost: createPortfolioPost,
  updatePortfolioPost: updatePortfolioPost,
  getPortfolioPostById: getPortfolioPostById,
  checkOwnerPortfolioPost: checkOwnerPortfolioPost,
  deletePortfolioPostById: deletePortfolioPostById,
  toggleLikePortfolioPost: ToggleLikePortfolioPost,
};

export default portfolioPostsController;

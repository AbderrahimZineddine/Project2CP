import {
  createPortfolioPost,
  getPortfolioPostById,
  updatePortfolioPost,
} from './portfolioPostController.ts/createPortfolioPost';

const portfolioPostsController = {
  createPortfolioPost: createPortfolioPost,
  updatePortfolioPost: updatePortfolioPost,
  getPortfolioPostById: getPortfolioPostById,
};

export default portfolioPostsController;

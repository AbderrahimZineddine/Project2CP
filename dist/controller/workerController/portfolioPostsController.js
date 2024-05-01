"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const handlerFactory_1 = require("../handlerFactory");
const checkOwnerPortfolioPost_1 = require("./portfolioPostController.ts/checkOwnerPortfolioPost");
const createPortfolioPost_1 = require("./portfolioPostController.ts/createPortfolioPost");
const deletePortfolioPost_1 = require("./portfolioPostController.ts/deletePortfolioPost");
const getPortfolioPostById_1 = require("./portfolioPostController.ts/getPortfolioPostById");
const likePortfolioPost_1 = require("./portfolioPostController.ts/likePortfolioPost");
const updatePortfolioPost_1 = require("./portfolioPostController.ts/updatePortfolioPost");
const PortfolioPost_1 = require("../../models/PortfolioPost");
const portfolioPostsController = {
    getAllPortfolioPosts: (0, handlerFactory_1.getAll)(PortfolioPost_1.PortfolioPost),
    getPortfolioPostsFromWorkerById: getPortfolioPostById_1.getPortfolioPostsFromWorkerById,
    getMyPortfolioPosts: getPortfolioPostById_1.getMyPortfolioPosts,
    createPortfolioPost: createPortfolioPost_1.createPortfolioPost,
    updatePortfolioPost: updatePortfolioPost_1.updatePortfolioPost,
    getPortfolioPostById: getPortfolioPostById_1.getPortfolioPostById,
    checkOwnerPortfolioPost: checkOwnerPortfolioPost_1.checkOwnerPortfolioPost,
    deletePortfolioPostById: deletePortfolioPost_1.deletePortfolioPostById,
    toggleLikePortfolioPost: likePortfolioPost_1.ToggleLikePortfolioPost,
};
exports.default = portfolioPostsController;
//# sourceMappingURL=portfolioPostsController.js.map
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const createPost_1 = require("./postController/createPost");
const deletePost_1 = require("./postController/deletePost");
const getPost_1 = require("./postController/getPost");
const savePost_1 = require("./postController/savePost");
const updatePost_1 = require("./postController/updatePost");
const checkOwnerPost_1 = require("./postController/checkOwnerPost");
const getMapPosts_1 = require("./postController/getMapPosts");
const postController = {
    createPost: createPost_1.createPost,
    ValidatePostInputs: createPost_1.ValidatePostInputs,
    getPostById: getPost_1.getPostById,
    getMyPosts: getPost_1.getMyPosts,
    getPostsFromUserById: getPost_1.getPostsFromUserById,
    getAllPosts: getPost_1.getAllPosts,
    checkOwnerPost: checkOwnerPost_1.checkOwnerPost,
    updatePost: updatePost_1.updatePost,
    deletePostById: deletePost_1.deletePostById,
    savePost: savePost_1.savePost,
    getMap: getMapPosts_1.getMap,
};
exports.default = postController;
//# sourceMappingURL=postController.js.map
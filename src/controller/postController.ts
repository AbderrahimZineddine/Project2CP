import { ValidatePostInputs, createPost } from './postController/createPost';
import { deletePostById } from './postController/deletePost';
import { getAllPosts, getMyPosts, getPostById } from './postController/getPost';
import { savePost } from './postController/savePost';
import { updatePost } from './postController/updatePost';
import { checkOwnerPost } from './postController/checkOwnerPost';

const postController = {
  createPost: createPost,
  ValidatePostInputs: ValidatePostInputs,
  getPostById: getPostById,
  getMyPosts: getMyPosts,
  getAllPosts: getAllPosts,
  checkOwnerPost: checkOwnerPost,
  updatePost: updatePost,
  deletePostById: deletePostById,
  savePost: savePost,
};

export default postController;

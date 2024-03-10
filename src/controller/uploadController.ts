import upload from './uploadController/upload';
import uploadCertificate from './uploadController/uploadCert';
import uploadCertificates from './uploadController/uploadCertificate';
import uploadId from './uploadController/uploadId';
import uploadProfilePicture from './uploadController/uploadPfp';
import deleteFromCloudinary from './uploadController/deleteCloudinary';
const uploadController = {
  upload: upload,
  uploadId: uploadId,
  uploadProfilePicture: uploadProfilePicture,
  uploadCertificates: uploadCertificates,
  uploadCertificate: uploadCertificate,
  deleteFromCloudinary: deleteFromCloudinary,
};

export default uploadController;

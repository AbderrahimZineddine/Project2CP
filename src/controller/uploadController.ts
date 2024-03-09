import upload from './uploadController/upload';
import uploadCertificate from './uploadController/uploadCert';
import uploadCertificates from './uploadController/uploadCertificate';
import uploadId from './uploadController/uploadId';
import uploadProfilePicture from './uploadController/uploadPfp';

const uploadController = {
  upload: upload,
  uploadId: uploadId,
  uploadProfilePicture: uploadProfilePicture,
  uploadCertificates: uploadCertificates,
  uploadCertificate: uploadCertificate,
};

export default uploadController;

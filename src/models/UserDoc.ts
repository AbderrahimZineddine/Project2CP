import mongoose from 'mongoose';

export enum Role {
  User = 'User',
  Worker = 'Worker',
  Admin = 'Admin',
}

export interface UserDoc extends mongoose.Document {
  // id: mongoose.Types.ObjectId,
  name: string;
  email: string;
  newEmail: string;
  profilePicture: string;
  wilaya: string;
  bio: string;
  phoneNumber: string;
  facebook: string;
  reported: number;
  workerAccountVerified: boolean;
  // role: 'User' | 'Worker'; //TODO : role check
  role: Role;
  currentRole: Role;
  // contacts: {
  //   instagram: string;
  //   facebook: string;
  //   whatsapp: string;
  //   linkedin: string;
  // };

  // posts: mongoose.Schema.Types.ObjectId[];
  favoriteWorkers: mongoose.Schema.Types.ObjectId[];
  authentication: {
    password: string;
    passwordChangedAt: Date;
    passwordConfirm: string;
    otp: string;
    otpExpires: Date;
    isVerified: boolean;
  };
  _deletedAt: Date;
  createdAt: Date;
  fcmTokens: string[];
  correctPassword: (
    candidatePassword: string,
    userPassword: string
  ) => Promise<boolean>;
  changedPasswordAfter: (JWTTimestamp: number) => boolean;
  createOTP: () => string;
}

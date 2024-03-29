import mongoose from 'mongoose';
import crypto from 'crypto';
import validator from 'validator';
import bcrypt from 'bcryptjs';
import { NextFunction } from 'express';
import { UserDoc, Role } from './UserDoc';

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: [true, 'A user must have a first name'],
    },
    lastName: {
      type: String,
      required: [true, 'A user must have a last name'],
    },
    email: {
      type: String,
      required: [true, 'A user must have an email address'],
      unique: true,
      lowercase: true,
      validate: [validator.isEmail, 'Please enter a valid email address'],
    },
    newEmail: {
      type: String,
      lowercase: true,
      validate: [validator.isEmail, 'Please enter a valid email address'],
    },

    profilePicture: {
      type: String,
      default: 'default.jpg',
    },
    wilaya: {
      //TODO check again
      type: String,
      required: [true, 'A user must enter his Wilaya'],
    },
    phoneNumber: {
      type: String,
      required: [true, 'A user must enter his phone number'],
    },
    contacts: {
      //TODO check again
      instagram: String,
      whatsapp: String,
      facebook: String,
      linkedin: String,
    },
    reported: {
      type: Number,
      min: [0, 'cannot be below 0'],
      max: [3, 'must be below 3'],
      default: 0,
    },
    posts: [
      {
        type: mongoose.Schema.ObjectId,
        ref: 'Post',
      },
    ],
    favoriteWorkers: [
      {
        type: mongoose.Schema.ObjectId,
        ref: 'Worker',
      },
    ],
    authentication: {
      password: {
        type: String,
        required: [true, 'A user must have a password'],
        minlength: [
          4,
          'A user password must have more or equal then 8 characters',
        ],
        select: false, //* automatically doesn't show up in output
      },
      passwordConfirm: {
        type: String,
        required: [true, 'Please confirm your password'],
        validate: {
          //* This only works on Create and SAVE!
          validator: function (el: UserDoc) {
            return el === this.authentication.password;
          },
          message: 'Passwords do not match',
        },
      },
      passwordChangedAt: Date,
      otp: String,
      otpExpires: Date,
      isVerified: { type: Boolean, default: false },
    },
    role: {
      type: String,
      enum: ['User', 'Worker'],
      default: 'User',
    },
    currentRole: {
      type: String,
      enum: ['User', 'Worker'],
      default: 'User',
      validate: {
        //TODO recheck
        validator: function (el: UserDoc) {
          return !(el.role === Role.User && el.currentRole === Role.Worker);
        },
      },
    },
  },
  { timestamps: true, discriminatorKey: 'role' }
);

userSchema.pre('save', passwordBcryptMiddleware);

userSchema.pre('save', passwordChangedAtMiddleware);

userSchema.methods.correctPassword = correctPasswordMethod();

userSchema.methods.changedPasswordAfter = changedPasswordAfterMethod();

userSchema.methods.createOTP = createOTP();

export const User = mongoose.model<UserDoc>('User', userSchema);

async function passwordBcryptMiddleware(next: NextFunction) {
  // only if password is modified
  if (!this.isModified('authentication.password')) return next();

  //* hashing / encryption :
  // we need to salt the password before hashing it
  this.authentication.password = await bcrypt.hash(
    this.authentication.password,
    12
  );
  this.authentication.passwordConfirm = undefined; // to delete ...

  next();
}

function passwordChangedAtMiddleware(next: NextFunction) {
  //* important stuff
  if (!this.isModified('authentication.password') || this.isNew) return next();

  //!  hack to avoid problems with token
  this.authentication.passwordChangedAt = new Date(Date.now() - 1000);
  next();
}

function correctPasswordMethod(): any {
  //* this.authentication.password isn't available bcz select is false so we pass the password  in args
  return async function (candidatePassword: string, userPassword: string) {
    return await bcrypt.compare(candidatePassword, userPassword);
  };
}

function changedPasswordAfterMethod(): any {
  return function (JWTTimestamp: number) {
    // this points to the current document
    if (this.authentication.passwordChangedAt instanceof Date) {
      const changedTimestamp = Math.floor(
        this.authentication.passwordChangedAt.getTime() / 1000
      );
      return JWTTimestamp < changedTimestamp; //100 < 200
    }

    return false;
  };
}

function createOTP(): any {
  return function () {
    const otp = `${Math.floor(1000 + Math.random() * 9000)}`;

    this.authentication.otp = crypto
      .createHash('sha256')
      .update(otp)
      .digest('hex');
    this.authentication.otpExpires = new Date(Date.now() + 10 * 60 * 1000);

    return otp;
  };
}

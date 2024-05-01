"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const crypto_1 = __importDefault(require("crypto"));
const validator_1 = __importDefault(require("validator"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const UserDoc_1 = require("./UserDoc");
const userSchema = new mongoose_1.default.Schema({
    name: {
        type: String,
        required: [true, 'A user must have a name'],
    },
    email: {
        type: String,
        required: [true, 'A user must have an email address'],
        unique: true,
        lowercase: true,
        validate: [validator_1.default.isEmail, 'Please enter a valid email address'],
    },
    newEmail: {
        type: String,
        lowercase: true,
        validate: [validator_1.default.isEmail, 'Please enter a valid email address'],
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
    // contacts: {
    //   //TODO check again
    //   instagram: String,
    //   whatsapp: String,
    //   facebook: String,
    //   linkedin: String,
    // },
    facebookAccount: String,
    bio: {
        type: String,
        min: [0, 'cannot be below 0'],
        max: [70, 'must be below 3'],
    },
    reported: {
        type: Number,
        min: [0, 'cannot be below 0'],
        max: [3, 'must be below 3'],
        default: 0,
    },
    // posts: [
    //   {
    //     type: mongoose.Schema.ObjectId,
    //     ref: 'Post',
    //   },
    // ],
    favoriteWorkers: [
        {
            type: mongoose_1.default.Schema.ObjectId,
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
                validator: function (el) {
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
            validator: function (el) {
                return !(el.role === UserDoc_1.Role.User && el.currentRole === UserDoc_1.Role.Worker);
            },
        },
    },
    _deletedAt: {
        type: Date,
        default: null, //TODO : check default and add validator
    },
}, { timestamps: true, discriminatorKey: 'role' });
userSchema.pre('save', passwordBcryptMiddleware);
userSchema.pre('save', passwordChangedAtMiddleware);
userSchema.methods.correctPassword = correctPasswordMethod();
userSchema.methods.changedPasswordAfter = changedPasswordAfterMethod();
userSchema.methods.createOTP = createOTP();
exports.User = mongoose_1.default.model('User', userSchema);
async function passwordBcryptMiddleware(next) {
    // only if password is modified
    if (!this.isModified('authentication.password'))
        return next();
    //* hashing / encryption :
    // we need to salt the password before hashing it
    this.authentication.password = await bcryptjs_1.default.hash(this.authentication.password, 12);
    this.authentication.passwordConfirm = undefined; // to delete ...
    next();
}
function passwordChangedAtMiddleware(next) {
    //* important stuff
    if (!this.isModified('authentication.password') || this.isNew)
        return next();
    //!  hack to avoid problems with token
    this.authentication.passwordChangedAt = new Date(Date.now() - 1000);
    next();
}
function correctPasswordMethod() {
    //* this.authentication.password isn't available bcz select is false so we pass the password  in args
    return async function (candidatePassword, userPassword) {
        return await bcryptjs_1.default.compare(candidatePassword, userPassword);
    };
}
function changedPasswordAfterMethod() {
    return function (JWTTimestamp) {
        // this points to the current document
        if (this.authentication.passwordChangedAt instanceof Date) {
            const changedTimestamp = Math.floor(this.authentication.passwordChangedAt.getTime() / 1000);
            return JWTTimestamp < changedTimestamp; //100 < 200
        }
        return false;
    };
}
function createOTP() {
    return function () {
        const otp = `${Math.floor(1000 + Math.random() * 9000)}`;
        this.authentication.otp = crypto_1.default
            .createHash('sha256')
            .update(otp)
            .digest('hex');
        this.authentication.otpExpires = new Date(Date.now() + 10 * 60 * 1000);
        return otp;
    };
}
userSchema.pre(/^find/, function (next) {
    // Filter out documents with _deletedAt set (including non-null values)
    this.where({ _deletedAt: null });
    next();
});
//# sourceMappingURL=User.js.map
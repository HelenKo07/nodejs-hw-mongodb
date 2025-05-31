import { model, Schema } from 'mongoose';

const userSrema = new Schema(
  {
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        unique: true,
        required: true
    },
    password: {
        type: String,
        required: true
    },
  },
  {
    timestamps: true,
    versionKey: false
  },
);

userSrema.methods.toJSON = function () {
    const obj = this.toObject();
    delete obj.password;
    return obj;
};

export const User = model('User', userSrema);



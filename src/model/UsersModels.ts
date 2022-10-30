import { Schema, model, Document } from "mongoose";
import bcrypt from "bcryptjs";

export interface IExample extends Document {
  name: string;
  fullName: string;
  email: string;
  password: string;
  countryCode: number;
  telNumber: number;
}

const userSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    fullName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    countryCode: {
      type: Number,
    },
    telNumber: {
      type: Number,
      unique: true,
    },
  },
  {
    timestamps: true,
  }
);

// Login
userSchema.methods.matchPassword = async function (enterPassword: string) {
  return await bcrypt.compare(enterPassword, this.password);
};

// Rgister

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

export default model<IExample>("User", userSchema);

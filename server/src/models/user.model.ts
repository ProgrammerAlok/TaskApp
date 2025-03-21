import { model, Schema } from "mongoose";
import { EmailRegx } from "../utils/constants";
import bcryptjs from "bcryptjs";

interface IUser {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  tasks: string[];
  encryptPassword: () => void;
  isPasswordMatched: (password: string) => boolean;
  addTask: (taskId: string) => void;
  deleteTask: (taskId: string) => void;
}

const userSchema = new Schema<IUser>(
  {
    firstName: {
      type: String,
      required: [true, "First name is required"],
    },
    lastName: {
      type: String,
      required: [true, "First name is required"],
    },
    email: {
      type: String,
      validate: {
        validator: function (v: string) {
          return EmailRegx.test(v);
        },
        message: (props: any) => `${props.value} is not a valid email!`,
      },
      required: [true, "Email is required"],
      unique: true,
    },
    password: {
      type: String,
      required: [true, "Password is required"],
    },
    tasks: [
      {
        type: Schema.Types.ObjectId,
        ref: "Task",
      },
    ],
  },
  {
    timestamps: true,
  }
);

userSchema.methods = {
  encryptPassword: function () {
    this.password = bcryptjs.hashSync(this.password, 10);
  },
  isPasswordMatched: function (password: string) {
    return bcryptjs.compareSync(password, this.password);
  },
  addTask: function (taskId: string) {
    this.tasks.push(taskId);
  },
  deleteTask: function (taskId: string) {
    this.tasks = this.tasks.filter(
      (task: string) => task.toString() !== taskId
    );
  },
};

const User = model("User", userSchema);

export default User;

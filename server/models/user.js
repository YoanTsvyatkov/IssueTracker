import mongoose from "mongoose";

const { Schema, model } = mongoose;

const userSchema = new Schema({
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    firstName: String,
    lastName: String,
});

userSchema.virtual('fullName').get(function() {
    return this.name.first + ' ' + this.name.last;
  });

const User = model('User', userSchema);

export default User;
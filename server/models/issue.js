import mongoose from "mongoose";
import Project from "./project.js";
import User from "./user.js";

const { Schema, model } = mongoose;

const issueSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    priority: {
        type: String,
        required: true
    },
    projectId: {
        type: Schema.Types.ObjectId,
        ref: Project
    },
    status : {
        type: String,
        required: true
    },
    assignee: {
        assigneeId:{
            type: Schema.Types.ObjectId,
            ref: User
        },
        firstName: {
            type: String
        },
        lastName: {
            type: String
        }
    }
});

const Issue = model('Issue', issueSchema);

export default Issue;
import mongoose from "mongoose";

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
        type: String,
        required: true
    },
    status : {
        type: String,
        required: true
    },
    assignee: {
        assigneeId:{
            type: String
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
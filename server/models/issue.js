import mongoose from "mongoose";

const { Schema, model } = mongoose;

const issueSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    description: String,
    priority: {
        type: String,
        required: true
    },
    projectId: {
        type: String,
        required: true
    },
    assignee: {
        firstName: {
            type: String
        },
        lastName: {
            type: String
        }
    }
});

issueSchema.methods.getUserFullName = function(){
    if(!assignee){
        return "Unassigned";
    }

    return assignee.firstName + " " + assignee.lastName;
}

const Issue = model('Issue', issueSchema);

export default Issue;
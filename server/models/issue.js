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
    assignee: {
        firstName: String,
        lastName: String,
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
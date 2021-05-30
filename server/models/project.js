import mongoose from "mongoose";

const { Schema, model } = mongoose;

const projectSchema = new Schema({
    projectName: {
        type: String,
        required: true
    },
    statuses: [String],
    image: {
        data: Buffer,
        contentType: String
    },

});

const Project = model('Project', projectSchema);

export default Project;
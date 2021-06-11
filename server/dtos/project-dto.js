class ProjectDto{
    constructor(project, contentType){
        this.id = project.id;
        this.projectName = project.projectName;
        let imageJson = null;
        if(project.image.data){
            imageJson = {
                "contentType": contentType,
                "img": project.image.data.toString('base64')
            }
        }
        this.image = imageJson
        this.statuses = project.statuses || null;
    }
}

export default ProjectDto;
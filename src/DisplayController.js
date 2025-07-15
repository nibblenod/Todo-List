import {Controller} from "./Controller";
import {Project} from "./Models/Project";

export class DisplayController
{
    #_controller;
    constructor(controller) {
        this.#_controller = controller;
    }
    init()
    {
        this.refreshProjects();

        const addProjectButton = document.querySelector(".projects-container > button")
        const dialog = document.querySelector('dialog');
        const projectDialogForm = document.querySelector('dialog form')
        const projectInput = document.querySelector('dialog input');
        const closeDialogButton = document.querySelector('dialog > button');

        closeDialogButton.addEventListener("click",  function()
        {
           dialog.close();
        });
        addProjectButton.addEventListener("click", function()
        {
            dialog.showModal();
        });
        projectDialogForm.addEventListener("submit", (event) => {
            event.preventDefault();
            this.addProject(projectInput.value)
            projectInput.value = "";
        });

    }

    addProject(title)
    {
        this.#_controller.createProject(title);
        this.refreshProjects();
    }

    refreshProjects()
    {
        const projects = document.querySelector('.projects-container');
        while (projects.children.length !== 1)
        {
            projects.children[0].remove();
            console.log(this.#_controller.projects);
            console.log(this.#_controller.currentProject);
        }
        this.#_controller.projects.forEach((project) =>
        {
            const div = document.createElement('div');
            div.textContent = project.title;
            div.classList.add('project');
            div.dataset.id = project.id;
            div.addEventListener("click", (event) => this.changeActiveProject(event.target.dataset.id))
            projects.prepend(div);
        });

        const currentProject = document.querySelector(`.projects-container .project[data-id ="${this.#_controller.currentProject}"]`);
        currentProject.classList.add("selected");
    }

    changeActiveProject(projectId)
    {
        const previousActiveProject = document.querySelector('.project.selected')
        previousActiveProject.classList.remove("selected");
        this.#_controller.changeCurrentProject(projectId);
        const newActiveProject = document.querySelector(`.project[data-id = "${projectId}"]`);
        newActiveProject.classList.add("selected");
    }


}
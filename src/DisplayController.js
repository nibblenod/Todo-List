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
        const submitButton = document.querySelector('dialog button.submit')
        const projectInput = document.querySelector('dialog input');
        addProjectButton.addEventListener("click", function()
        {
            dialog.showModal();
        });
        submitButton.addEventListener("click", () => this.addProject(projectInput.value));

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
        }
        this.#_controller.projects.forEach(function(project)
        {
            const div = document.createElement('div');
            div.textContent = project.title;
            div.classList.add('project');
            div.dataset.id = project.id;
            projects.prepend(div);
        });
    }

    // addProject

}
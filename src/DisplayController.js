import {Controller} from "./Controller";

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
        addProjectButton.addEventListener("click", function()
        {
            dialog.showModal();
        });

    }

    refreshProjects()
    {
        const projects = document.querySelector('.projects-container');
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
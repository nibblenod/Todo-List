import {Controller} from "./Controller";
import {Project} from "./Models/Project";
import {Todo} from "./Models/Todo";

export class DisplayController
{
    #_controller;
    constructor(controller) {
        this.#_controller = controller;
    }
    init()
    {
        this.refreshProjects();
        this.refreshTodos();
        this.#_projectInit();
        this.#_todoInit();
    }


    #_todoInit()
    {
        const addNewTodoButton = document.querySelector(".add-todo-button");
        const todoDialog = document.querySelector("dialog.todo-dialog")
        const todoDialogForm = document.querySelector('dialog.todo-dialog form');


        addNewTodoButton.addEventListener("click", () => {
            todoDialog.showModal();
        })
        todoDialogForm.addEventListener("submit", (event) => {
            event.preventDefault()
            this.#_todoValuesRetrieverDialog();

        })

        this.#_checklistInit();

    }

    #_todoValuesRetrieverDialog()
    {
        const title = document.querySelector(".todo-dialog form input#title")
        const description = document.querySelector(".todo-dialog form textarea#description")
        const dueDate = document.querySelector(".todo-dialog form input#date")
        const priority = document.querySelector('.todo-dialog form input[type="radio"]:checked')
        const notes = document.querySelector('.todo-dialog form textarea#notes');
        const checkListElement = document.querySelector(".todo-dialog form .checklists")

        const checklist = new Array();

        for (const item of checkListElement.children)
        {
            checklist.push(item.querySelector('input').value);
        }
        const date = new Date(dueDate.value);

        let priorityValue = null;
        if (priority) priorityValue = priority.value;
        this.addTodo(title.value, description.value, date, priorityValue, notes.value, checklist);
    }

    #_checklistInit()
    {
        const addNewTaskButton = document.querySelector(".add-task-btn")
        const checklists = document.querySelector(".checklist-container .checklists");

        addNewTaskButton.addEventListener("click", (event) => {
            event.preventDefault();
            const div = document.createElement("div");
            const deleteButton = document.createElement("button");

            deleteButton.addEventListener("click", (event) => {
                event.target.parentElement.remove();
            });

            deleteButton.textContent = "❌";
            deleteButton.classList.add("delete-btn");
            const input = document.createElement("input");
            input.required = true;
            input.classList.add("task");
            div.appendChild(deleteButton);
            div.appendChild(input);
            checklists.appendChild(div);
        })
    }

    #_projectInit()
    {
        const addProjectButton = document.querySelector(".projects-container > button")
        const dialog = document.querySelector('dialog.add-project-dialog');
        const projectDialogForm = document.querySelector('dialog.add-project-dialog form')
        const projectInput = document.querySelector('dialog.add-project-dialog input');
        const closeDialogButton = document.querySelector('dialog.add-project-dialog > button');

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

    addTodo(title, description, dueDate, priority, notes, checklist)
    {
        this.#_controller.createTodo(...arguments);
        this.refreshTodos();
    }
    addProject(title)
    {
        this.#_controller.createProject(title);
        this.refreshProjects();
    }

    refreshTodos() {
        const todoList = document.querySelector(".todos .todolist ul")
        const currentTodos = this.#_controller.projects.get(this.#_controller.currentProject).todos;

        while (todoList.children.length != 0)
        {
            todoList.children[0].remove();
        }

        for (const todo of currentTodos)
        {
            const listItem = document.createElement("li");

            const checkmarkDiv = document.createElement("div");

            checkmarkDiv.addEventListener("click", () => {

                todo[1].done = !todo[1].done;
                this.refreshTodos();
            });
            listItem.dataset.id = todo[1].id;

            if (todo[1].done === true)
            {
                checkmarkDiv.textContent = "✅";
            }
            else checkmarkDiv.textContent = " ";
            checkmarkDiv.classList.add("checkmark");
            listItem.appendChild(checkmarkDiv);

            const todoDiv = document.createElement("div");
            todoDiv.textContent = todo[1].title;
            todoDiv.classList.add("todo");

            if (todo[1].done)
            {
                todoDiv.classList.add("done");
            }
            else todoDiv.classList.remove("done");
            listItem.appendChild(todoDiv);

            todoList.appendChild(listItem);
        }




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
        this.refreshTodos();
    }


}
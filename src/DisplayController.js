import {Controller} from "./Controller";
import {Project} from "./Models/Project";
import {Todo} from "./Models/Todo";
import {formatDistanceStrict} from "date-fns";

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
        const todoDialog = document.querySelector("dialog.todo-dialog:not(.edit)")
        const todoDialogForm = todoDialog.querySelector('form');

        const todoEditDialog = document.querySelector(".todo-dialog.edit");
        const todoEditDialogForm = todoEditDialog.querySelector(".todo-form.edit");

        const deleteTodo = todoEditDialogForm.querySelector("button.delete-btn");


        const todayDate = new Date();
        let day = todayDate.getDate();
        let month = todayDate.getMonth() + 1;
        if (month.toString().length === 1) month = "0" + month;
        let year = todayDate.getFullYear();

        todoDialogForm.querySelector('input[type="date"]').min = `${year}-${month}-${day}`;
        todoEditDialogForm.querySelector('input[type="date"]').min = `${year}-${month}-${day}`;



        deleteTodo.addEventListener("click", (event) => {
            event.preventDefault();
            this.deleteTodo(todoEditDialogForm.dataset.id);
            todoEditDialog.close();
        })

        const editDialogAddTask = todoEditDialogForm.querySelector("button.add-task-btn");

        const editChecklists = todoEditDialogForm.querySelector(".checklists");

        editDialogAddTask.addEventListener("click", (event) => {
            event.preventDefault();
            this.#_checklistAddTask(editChecklists);
        });


        todoEditDialogForm.addEventListener("submit", (event) => {
            event.preventDefault();
            this.#_todoValuesRetrieverDialog(todoEditDialogForm, "edit");
        });
        todoDialog.addEventListener("close", () => {
            this.#_dialogResetForm(todoDialogForm);
        })

        addNewTodoButton.addEventListener("click", () => {
            if (this.#_controller.currentProject !== null)
            todoDialog.showModal();
        })
        todoDialogForm.addEventListener("submit", (event) => {
            event.preventDefault()
            this.#_todoValuesRetrieverDialog(todoDialogForm, "add");

        })

        this.#_checklistInit();

    }

    #_todoValuesRetrieverDialog(form, type)
    {
        const todoAddDialogForm = form;
        const title = todoAddDialogForm.querySelector('input[name="title"]')
        const description = todoAddDialogForm.querySelector(`textarea[name="description"]`)
        const dueDate = todoAddDialogForm.querySelector('input[name="dueDate"]');
        const priority = todoAddDialogForm.querySelector('input[type="radio"]:checked')
        const notes = todoAddDialogForm.querySelector('textarea[name="notes"]');
        const checkListElement = todoAddDialogForm.querySelector(".checklists")

        const checklist = new Array();

        for (const item of checkListElement.children)
        {
            checklist.push(item.querySelector('input').value);
        }

        let priorityValue = null;
        if (priority) priorityValue = priority.value;

        if (type === "add")
            this.addTodo(title.value, description.value, dueDate.value, priorityValue, notes.value, checklist);
        else this.editTodo(form.dataset.id, title.value, description.value, dueDate.value, priorityValue, notes.value, checklist);

        this.#_dialogResetForm(todoAddDialogForm);


    }

    #_dialogResetForm(todoAddDialogForm)
    {
        const title = todoAddDialogForm.querySelector('input[name="title"]')
        const description = todoAddDialogForm.querySelector(`textarea[name="description"]`)
        const dueDate = todoAddDialogForm.querySelector('input[name="dueDate"]');
        const priority = todoAddDialogForm.querySelector('input[type="radio"]:checked')
        const notes = todoAddDialogForm.querySelector('textarea[name="notes"]');
        const checkListElement = todoAddDialogForm.querySelector(".checklists")

        title.value = "";
        description.value = "";
        dueDate.value = "";
        if (priority) priority.checked = false;
        notes.value = "";
        checkListElement.textContent = "";
    }

    #_checklistAddTask(checklists, item = "")
    {
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
        input.value = item;
        div.appendChild(deleteButton);
        div.appendChild(input);
        checklists.appendChild(div);
    }

    #_checklistInit()
    {
        const addNewTaskButton = document.querySelector(".add-task-btn")
        const checklists = document.querySelector(".checklist-container .checklists");

        addNewTaskButton.addEventListener("click", (event) => {
           event.preventDefault();
           this.#_checklistAddTask(checklists);
        })
    }

    #_projectInit()
    {
        const addProjectButton = document.querySelector(".projects-container > button")
        const deleteProjectButton = addProjectButton.nextElementSibling;
        const dialog = document.querySelector('dialog.add-project-dialog');
        const projectDialogForm = document.querySelector('dialog.add-project-dialog form')
        const projectInput = document.querySelector('dialog.add-project-dialog input');
        const closeDialogButton = document.querySelector('dialog.add-project-dialog > button');


        deleteProjectButton.addEventListener("click", () => {
            this.deleteProject();
        });
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

    deleteProject()
    {
        this.#_controller.deleteProject();
        const currentProjects = this.#_controller.projects;
        if (currentProjects.size > 0)
        {
            this.changeActiveProject(currentProjects.keys().next().value);
        }
        else this.changeActiveProject(null);
        this.refreshProjects();
    }

    deleteTodo(todoId)
    {
        this.#_controller.deleteTodo(todoId);
        this.refreshTodos();
    }
    addTodo(title, description, dueDate, priority, notes, checklist)
    {
        this.#_controller.createTodo(...arguments);
        this.refreshTodos();
    }

    editTodo(todoId, title, description, dueDate, priority, notes, checklist)
    {
        this.#_controller.editTodo(todoId, title, description, dueDate, priority, notes, checklist);
        this.refreshTodos();
    }

    addProject(title)
    {
        this.#_controller.createProject(title);
        this.refreshProjects();
    }

    toggleCurrentStateTodo(todoId)
    {
        this.#_controller.toggleCurrentStateTodo(todoId);
        this.refreshTodos();
    }
    refreshTodos() {
        const todoList = document.querySelector(".todos .todolist ul")

        while (todoList.children.length != 0)
        {
            todoList.children[0].remove();
        }

        const currentProjectId = this.#_controller.currentProject;

        const currentProject = this.#_controller.projects.get(currentProjectId);
        if (!currentProject) return;
        const currentTodos = currentProject.todos;



        for (const todo of currentTodos)
        {
            const listItem = document.createElement("li");

            const checkmarkDiv = document.createElement("div");

            checkmarkDiv.addEventListener("click", () => {

                this.toggleCurrentStateTodo(todo[1].id);
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

            if (todo[1].priority)
            {
                todoDiv.classList.add(`${todo[1].priority}-todo`);
            }

            todoDiv.addEventListener("click", () => this.#_editHandler(todo[1]));

            if (todo[1].done)
            {
                todoDiv.classList.add("done");
            }
            else todoDiv.classList.remove("done");

            if (todo[1].dueDate && !todo[1].done)
            {
                const dueDateDiv = document.createElement("div");
                dueDateDiv.classList.add("duedate-container");

                let dateDifference = formatDistanceStrict(todo[1].dueDate, new Date("2025-07-19"), {unit: "day"});
                if (dateDifference === "0 days") dateDifference = "Today";
                dueDateDiv.textContent = "Due Date: " + dateDifference + " remaining";
                todoDiv.appendChild(dueDateDiv);
            }

            listItem.appendChild(todoDiv);

            todoList.appendChild(listItem);
        }

    }

    #_editHandler(todo)
    {
        const editDialog = document.querySelector(".todolist .todo-dialog.edit");
        editDialog.showModal();

        const editForm = editDialog.querySelector(".todo-form.edit");

        const checklists = editDialog.querySelector(".checklists");

        editForm.title.value = todo.title;
        editForm.description.value = todo.description;
        if (todo.priority) editForm.priority.value = todo.priority;
        else {
            editForm.priority.forEach((element) => {
                if (element.checked) element.checked = false;
            });
        }

        editForm.dueDate.value = todo.dueDate;

        editForm.notes.value = todo.notes;

        editForm.dataset.id = todo.id;


        checklists.textContent = "";
        for (const item of todo.checklist)
        {
            this.#_checklistAddTask(checklists, item);
        }

    }

    refreshProjects()
    {
        const projects = document.querySelector('.projects-container');
        while (projects.children.length !== 2)
        {
            projects.children[0].remove();
        }
        const currentProjects = this.#_controller.projects;
        if (currentProjects.size === 0) return;

        currentProjects.forEach((project) =>
        {
            const div = document.createElement('div');
            div.textContent = project.title;
            div.classList.add('project');
            div.dataset.id = project.id;
            div.addEventListener("click", (event) => this.changeActiveProject(event.target.dataset.id))
            projects.prepend(div);
        });
        const currentProjectId = this.#_controller.currentProject;
        if (currentProjectId === null) return;
        const currentProject = document.querySelector(`.projects-container .project[data-id ="${this.#_controller.currentProject}"]`);

        currentProject.classList.add("selected");
    }

    changeActiveProject(projectId)
    {
        this.#_controller.changeCurrentProject(projectId);

        if (projectId !== null){
            const previousActiveProject = document.querySelector('.project.selected')
            previousActiveProject.classList.remove("selected");
            const newActiveProject = document.querySelector(`.project[data-id = "${projectId}"]`);
            newActiveProject.classList.add("selected");
        }

        this.refreshTodos();
    }


}
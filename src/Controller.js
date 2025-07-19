import {Project} from "./Models/Project";
import {v4 as uuidv4} from 'uuid';
import {Todo} from "./Models/Todo";
export class Controller {

    #_currentProjects = new Map();
    #_currentProjectId = null;
    constructor() {
        if (localStorage.getItem("projects") && JSON.parse(localStorage.getItem("projects")).length !== 0)
        {
            this.#_currentProjects = this.deserializeProjects(JSON.parse(localStorage.getItem("projects")));
            this.#_currentProjectId = localStorage.getItem("currentProject");
        }
        else {
            this.#_currentProjectId = this.createProject("Default");
            localStorage.setItem("currentProject", this.#_currentProjectId);
        }
    }

    serializeProjects(projects)
    {
        return Array.from(projects.entries()).map(([id, project]) => {
            return [
                id,
                {
                    ...project,
                    todos: Array.from(project.todos.entries())
                }
            ]
        });
    }
    deserializeProjects(projects)
    {
        const map = new Map();

        projects.forEach((item) => {

            const todoMap = new Map();
            item[1].todos.forEach((todo) => {
               todoMap.set(todo[0], todo[1]);
            });
            map.set(item[0], {
                ...item[1],
                todos: todoMap,
            })
        });

        return map;

    }
    changeCurrentProject(projectId)
    {
        this.#_currentProjectId = projectId;
        localStorage.setItem("currentProject", projectId);
    }
    createProject(title)
    {
        const newProject = new Project(title, new Map());
        this.#_currentProjects.set(newProject.id, newProject);
        if (this.currentProject === null) {
            this.currentProject = newProject.id;
            localStorage.setItem("currentProject", newProject.id);
        }
        localStorage.setItem("projects", JSON.stringify(this.serializeProjects(this.#_currentProjects)));
        return newProject.id;
    }
    deleteProject()
    {
        this.#_currentProjects.delete(this.#_currentProjectId);
        localStorage.setItem("projects", JSON.stringify(this.serializeProjects(this.#_currentProjects)));

    }
    get projects()
    {
        return this.#_currentProjects;
    }
    get currentProject()
    {
        return this.#_currentProjectId;
    }
    set currentProject(projectId)
    {
        this.#_currentProjectId = projectId;
    }

    createTodo(title, description, dueDate, priority, notes, checklist)
    {
        const newTodo = new Todo(title, description, dueDate, priority, notes, checklist);
        this.#_currentProjects.get(this.#_currentProjectId).todos.set(newTodo.id, newTodo);
        localStorage.setItem("projects", JSON.stringify(this.serializeProjects(this.#_currentProjects)));


    }
    editTodo(todoId, title, description, dueDate, priority, notes, checklist)
    {
        const todoToEdit = this.projects.get(this.currentProject).todos.get(todoId);

        Object.assign(todoToEdit, {title, description, dueDate, priority, notes, checklist});
        localStorage.setItem("projects", JSON.stringify(this.serializeProjects(this.#_currentProjects)));


    }
    deleteTodo(todoId)
    {
        this.projects.get(this.currentProject).todos.delete(todoId);
        localStorage.setItem("projects", JSON.stringify(this.serializeProjects(this.#_currentProjects)));

    }

    toggleCurrentStateTodo(todoId)
    {
        const currentTodo = this.projects.get(this.currentProject).todos.get(todoId);

        if (currentTodo.done === false) currentTodo.done = true;
        else currentTodo.done = false;
        localStorage.setItem("projects", JSON.stringify(this.serializeProjects(this.#_currentProjects)));
    }




}
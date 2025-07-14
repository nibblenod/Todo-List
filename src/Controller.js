import {Project} from "./Models/Project";
export class Controller {

    #_currentProjects = new Map();
    constructor() {
        this.#_currentProjects.set("Default", new Project("Default", new Map()))

    }
    createProject(title)
    {
        this.#_currentProjects.set(title, new Project(title, new Map()));
    }
    deleteProject(title)
    {
        return this.#_currentProjects.delete(title);
    }
    get projects()
    {
        return this.#_currentProjects;
    }
    addTodo(todo, projectTitle)
    {
        if (this.#_currentProjects.has(projectTitle))
        {
            this.#_currentProjects.get(projectTitle).todos.set(todo.title, todo);
            return true;
        }
        else return false;
    }
    deleteTodo(todoTitle, projectTitle)
    {
        if (this.#_currentProjects.has(projectTitle))
        {
            return this.#_currentProjects.get(projectTitle).todos.delete(todoTitle);
        }
    }



}
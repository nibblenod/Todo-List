import {Project} from "./Models/Project";
import {v4 as uuidv4} from 'uuid';
export class Controller {

    #_currentProjects = new Map();
    #_currentProjectId;
    constructor() {
        this.#_currentProjectId = this.createProject("Default");
    }
    changeCurrentProject(projectId)
    {
        this.#_currentProjectId = projectId;
    }
    createProject(title)
    {
        const newProject = new Project(title, new Map());
        this.#_currentProjects.set(newProject.id, newProject);
        return newProject.id;
    }
    deleteProject(projectId)
    {
        return this.#_currentProjects.delete(projectId);
    }
    get projects()
    {
        return this.#_currentProjects;
    }
    get currentProject()
    {
        return this.#_currentProjectId;
    }

    // addTodo(todo, projectId)
    // {
    //     if (this.#_currentProjects.has(projectId))
    //     {
    //         const newTodo = new Todo()
    //         this.#_currentProjects.get(projectId).todos.set(todoId, todo);
    //         return true;
    //     }
    //     else return false;
    // }
    // deleteTodo(todoId, projectId)
    // {
    //     if (this.#_currentProjects.has(projectId))
    //     {
    //         return this.#_currentProjects.get(projectId).todos.delete(todoId);
    //     }
    // }



}
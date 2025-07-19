import {Project} from "./Models/Project";
import {v4 as uuidv4} from 'uuid';
import {Todo} from "./Models/Todo";
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
        if (this.currentProject === null) this.currentProject = newProject.id;
        return newProject.id;
    }
    deleteProject()
    {
        return this.#_currentProjects.delete(this.#_currentProjectId);
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
    }
    editTodo(todoId, title, description, dueDate, priority, notes, checklist)
    {
        const todoToEdit = this.projects.get(this.currentProject).todos.get(todoId);

        Object.assign(todoToEdit, {title, description, dueDate, priority, notes, checklist});

    }
    // deleteTodo(todoId, projectId)
    // {
    //     if (this.#_currentProjects.has(projectId))
    //     {
    //         return this.#_currentProjects.get(projectId).todos.delete(todoId);
    //     }
    // }weqa




}
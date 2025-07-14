import {Todo, priority} from "./Models/Todo.js"
import {Project} from "./Models/Project.js"
import "./styles.css";
import {Controller} from "./Controller.js";

const projectController = new Controller();

let currentProject = 'Default';

function changeActiveProject(projectTitle)
{
    currentProject = projectTitle;
}





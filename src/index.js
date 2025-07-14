import {Todo, priority} from "./Models/Todo.js"
import {Project} from "./Models/Project.js"
import {DisplayController} from "./DisplayController"
import "./styles.css";
import {Controller} from "./Controller.js";

const disController = new DisplayController(new Controller());

disController.init();



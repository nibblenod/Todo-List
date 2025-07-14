import {v4 as uuidv4} from 'uuid';

export class Project {
    constructor(title, todos)
    {
        this.title = title;
        this.todos = todos;
        this.id = uuidv4();
    }
}


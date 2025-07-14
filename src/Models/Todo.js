import {v4 as uuidv4} from 'uuid';
export class Todo {
    constructor(title, description, dueDate, priority, notes, checklist)
    {
        this.title = title;
        this.description = description;
        this.dueDate = dueDate;
        this.priority = priority;
        this.notes = notes;
        this.checklist = checklist;
        this.id = uuidv4();
    }
}

export const priority = {
    high: "high",
    medium: "medium",
    low: "low"
}
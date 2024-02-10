import { IUserRecord } from "../db";

export interface IWorkspaceRecord extends IUserRecord {
    workspace_name: string;
    boards?: IBoardRecord[]
}

export interface IBoardRecord extends IUserRecord {
    board_name: string;
    todos?: ITodoRecord[]
}

export interface ITodoRecord extends IUserRecord {
    todo_name: string;
    content?: string;
}

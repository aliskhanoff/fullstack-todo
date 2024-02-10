import { IRecord, IUserRecord } from "../db"


export interface IUserData extends IRecord {
    email: string
    workspaces: IWorkspaceData[]
}

export interface IWorkspaceData extends IUserRecord {
    name: string
    boards: IBoardData[]
}

export interface IBoardData extends IRecord {
    name: string
}

export interface ITodoData extends IRecord {
    boardId:        number
    createdBy:      number
    name:           string         
    content:        string        
    config:         string
    state:          string
}



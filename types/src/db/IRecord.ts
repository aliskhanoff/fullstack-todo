export interface IRecord {
    uid: string
    created_at: Date;
    updated_at?: Date;
}


export interface IUserRecord extends IRecord {
    userId: number;
}
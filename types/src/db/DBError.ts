
export interface IDBError {
    name: string,
    code: string,
    clientVersion: string,
    meta: IDBErrorMeta
}

type IDBErrorMeta = {
    modelName: string,
    target: [string]
}
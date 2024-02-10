import { IDBError } from "./DBError";

export function DBErrorHandler(err: IDBError) {
    
    if (err.code === 'P2025') {
        return Response.json({
            error: "NOT_FOUND",
        }, { status: 404 })
    }

    else if (err?.code === "P2002") {
        return Response.json({
            error: "EXISTS"
        }, {
            status: 403
        })
    }

    return Response.json({
        error: "Error. Try connect later",
    }, { status: 500 })   


}
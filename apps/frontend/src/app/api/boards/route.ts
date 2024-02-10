import { isUID, isUserAuthenticated } from '@fullstack-todo/functions';
import { IDBError, DBErrorHandler, GenericRequest } from '@fullstack-todo/types';
import { PrismaClient } from '@prisma/client'

const client = new PrismaClient();

export async function GET(req: GenericRequest) {

    const user = isUserAuthenticated(req);
    if (!user) return Response.json({ error: "Unauthorized" }, { status: 401 });
    const workspaceUID = req.nextUrl.searchParams.get('workspace');
    
    if (!workspaceUID || !isUID(workspaceUID)) return Response.json({ error: "Workspace not found" }, { status: 404 });
    
    try {
        await client.$connect()
        const workspace = await client.workspaces.findFirst({ where: { uid: workspaceUID, AND: { userId: user.id }  } });
        
        const boards = await client.boards.findMany({
            where: {
                AND: [{
                    workspaceId: workspace?.id
                }]
            },
            include: { todos: true }
        })

        return Response.json(boards || [], { status: 200 })
    }

    catch (err: IDBError | any) {
        DBErrorHandler(err);
    }

    finally {
        await client.$disconnect();
    }

}


export async function POST(req: GenericRequest) {
    
    const user = isUserAuthenticated(req);
    if (!user) return Response.json({ error: "Unauthorized" }, { status: 401 });

    const { workspaceId, name } = await req.json();
    if (!workspaceId || !isUID(workspaceId)) Response.json({ error: "Workspace Id should be provided" }, { status: 401 });
    

    try {
        await client.$connect()
        const foundedWorkspaceId = await client.workspaces.findFirst({
            where: {
                uid: workspaceId,
            },
            select: { id: true }
        })
        
        if (!foundedWorkspaceId?.id) {
            console.log('here');
            
            client.$disconnect();
            return Response.json({ status: 'WORKSPACE_NOT_FOUND' }, { status: 404, statusText: "Workspace not found" })
        }
        
        const createdBoard = await client.boards.create({
            data: {
                name: String(name),
                workspaceId: foundedWorkspaceId?.id
            }
        })

        return Response.json({ board: createdBoard }, { status: 200 })
    }

    catch (err: IDBError | any) {
        DBErrorHandler(err);
    }

    finally {
        await client.$disconnect();
    }

}


export async function DELETE(req: GenericRequest) {
    const user = isUserAuthenticated(req);
    if (!user) return Response.json({ error: "Unauthorized" }, { status: 401 });
    const board = await req.json ();

    if(!board.uid || !isUID(board.uid)) return Response.json({ error: "NOT FOUND" }, { status: 404 }); 

    try {
        await client.$connect()

        await client.boards.delete({
            where: {
                uid: board.uid,
            }
        })

        return Response.json({ message: "DELETED" }, { status: 200 })
    }

    catch (err: IDBError | any) { 
        return DBErrorHandler(err);
    }

    finally {
        await client.$disconnect();
    }

}

export async function PUT(req: GenericRequest) {
    const user = isUserAuthenticated(req);
    if (!user) return Response.json({ error: "Unauthorized" }, { status: 401 });
    
    const board = await req.json();
    
    try {
        await client.$connect()
        
        await client.boards.update({
            where: { uid: String(board.uid)  },
            data:  { name: String(board.name) }
        })

        return Response.json({ message: "UPDATED" }, { status: 200 })
    }

    catch (err: IDBError | any) {    
        return DBErrorHandler(err);
    }

    finally {
        await client.$disconnect();
    }

}


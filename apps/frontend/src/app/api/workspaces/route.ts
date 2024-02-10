import { isUID, isUserAuthenticated } from '@fullstack-todo/functions';
import { IDBError, DBErrorHandler, GenericRequest } from '@fullstack-todo/types';
import { PrismaClient } from '@prisma/client'

const client = new PrismaClient();
export async function GET(req: GenericRequest) {
    const user = isUserAuthenticated(req);
    if (!user) return Response.json({ error: "Unauthorized" }, { status: 401 });

    const workspaceUID = req.nextUrl.searchParams.get('workspace');

    try {
        await client.$connect()

        if (workspaceUID) {
            const isWorkspace = isUID(workspaceUID);

            if (!isWorkspace) {
                await client.$disconnect()
                return Response.json({ status: 400, statusText: "WORKSPACE_NOT_FOUND" })     
            }

            else {                
                const workspace = await client.workspaces.findFirst({
                    where: {
                        userId: user.id,
                        AND: {
                            uid: workspaceUID
                        },
                    },
                    include: {
                        boards: {
                            include: {
                                todos: true
                            }
                        }
                    }  
                })
                return Response.json(workspace || [], { status: 200 })
            }
        }
        else {
            const workspaces = await client.workspaces.findMany({
                where: {
                    userId: user.id
                }
            })
            return Response.json(workspaces || [], { status: 200 })
        }
    }
    catch (err) {
        return Response.json({
            error: "Error. Try again later",
        }, { status: 500 })    
    }

    finally {
        await client.$disconnect();
    }

}

export async function POST(req: GenericRequest) {
    const user = isUserAuthenticated(req);
    if (!user) return Response.json({ error: "Unauthorized" }, { status: 401 });

    const workspace = await req.json();

    try {
        await client.$connect()
        const createdWorskpace = await client.workspaces.create({
            data: {
                name: workspace.name,
                userId: user.id
            }
        })

        return Response.json({ workspace: createdWorskpace }, { status: 200 })
    }

    catch (err: IDBError | any) {
        return DBErrorHandler(err);
    }

    finally {
        await client.$disconnect();
    }

}

export async function DELETE(req: GenericRequest) {

    const user = isUserAuthenticated(req);
    if (!user) return Response.json({ error: "Unauthorized" }, { status: 401 });

    const workspace = await req.json ();

    try {
        await client.$connect()

        await client.workspaces.delete({
            where: {
                uid: workspace.uid,
                userId: user.id
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
    
    const workspace = await req.json();
    
    try {
        await client.$connect()
        
        await client.workspaces.update({
            where: { uid: String(workspace.uid)  },
            data: { name: String(workspace.name) }
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


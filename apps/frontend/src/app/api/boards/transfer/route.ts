import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";
import { DBErrorHandler, GenericRequest, IDBError } from "@fullstack-todo/types";
import { isUID, isUserAuthenticated } from "@fullstack-todo/functions";
import { extractUserDataFromRequest } from "functions";

const client = new PrismaClient();

export async function PUT(req: GenericRequest) {
    
    const { from, to, target } = await req.json();

    if (!from || !to || !target || !isUID(from) || !isUID(to) || !isUID(target)) {
        return Response.json({ error: "NOT_FOUND" }, { status: 404 })
    }

    if (!isUserAuthenticated(req)) {
        return Response.json({ error: "FORBIDDEN" }, { status: 403 })
    }
    
    const user = extractUserDataFromRequest(req);

    if (!user) {
        return Response.json({ error: "WORKSPACE NOT FOUND" }, { status: 404, statusText: "WORKSPACE NOT FOUND" })
    }

    try {
        client.$connect();
        const foundedWorkspaces = await client.workspaces.findMany({
            where: {
                OR: [{
                        userId: user?.id,
                        uid: from,
                    },
                    {
                        userId: user?.id,
                        uid: to,
                    }]
                },

            select: {
                id: true,
                userId: true
            }
        })
        //validate
        if (foundedWorkspaces.length < 2) {
            return Response.json({ error: "WORKSPACE NOT FOUND" }, { status: 404, statusText: "WORKSPACE NOT FOUND" })
        }
        
        const targetBoard = await client.boards.findFirst({
            where: {
                uid: target,
            }
        })

        if (!targetBoard) { 
            client.$disconnect()
            return Response.json("BOARD NOT FOUND", { status: 404 })
        }
        
        const result = await client.boards.update({
            where: {
                id: targetBoard.id
            },

            data: {
                workspaceId: foundedWorkspaces[1].id //to board
            }
        })

        Response.json(result, { status: 200 })

    }
    
    catch (err: IDBError | any) {
        DBErrorHandler(err);
    }

    finally {
        client.$disconnect()
    }

    return NextResponse.json({ status: 200 });
}

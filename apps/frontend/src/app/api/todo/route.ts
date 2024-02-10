import { isUserAuthenticated } from '@fullstack-todo/functions';
import { IDBError, DBErrorHandler, GenericRequest } from '@fullstack-todo/types';
import { PrismaClient } from '@prisma/client'

const client = new PrismaClient();

export async function GET(req: GenericRequest) {
    const user = isUserAuthenticated(req);
    if (!user) return Response.json({ error: "Unauthorized" }, { status: 401 });
    const boardId = req.nextUrl.searchParams.get('board');
    
    try {
        await client.$connect()
        const todos = await client.todos.findMany({
            where: {
                uid: String(boardId)
            }
        })

        return Response.json(todos || [], { status: 200 })
    }

    catch (err: IDBError | any) {
        DBErrorHandler(err);
    }

    finally {
        await client.$disconnect();
    }

}
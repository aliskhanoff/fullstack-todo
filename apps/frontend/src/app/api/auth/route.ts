import { PrismaClient } from '@prisma/client'
import { validateEmailAndPassword, comparePasswords } from '@fullstack-todo/functions'
import { DBErrorHandler, GenericRequest, IDBError } from '@fullstack-todo/types';

const client = new PrismaClient();

export async function POST(req: GenericRequest) {
    const { email, password } = await req.json();

    if (!validateEmailAndPassword(email, password)) {
        return Response.json({
            error: 'INVALID_EMAIL_OR_PASSWORD',
            message: "Invalid email or password"
        }, { status: 400 })
    }
    
    let user, workspaces;

    try {
        await client.$connect()
        user = await client.users.findFirst({ where: { email } })
        
        if (!user) {
            return Response.json({
                error: 'NOT_FOUND'
            }, { status: 404 })
        }

        if (!comparePasswords(password, user.password || "")) {
            return Response.json({
                error: 'NOT_FOUND'
            }, { status: 404 })
        }
        
        workspaces = await client.workspaces.findMany({ where: { userId: user?.id } }) || []

        const userWithoutPassword = withoutPassword(user);

        return Response.json({
            token: userWithoutPassword,
            user: userWithoutPassword,
            workspaces
        })
    }

    catch (err: IDBError | any) {
        return DBErrorHandler(err);
    }

    finally {
        client.$disconnect();
    }

}


const withoutPassword = (user: { id:number, uid:string, email:string, password:string | null, created_at: Date, updated_at: Date  }) => {
    const { id, email, uid, created_at, updated_at } = user;
    return {
        id,
        uid,
        email,
        created_at,
        updated_at
    }
}
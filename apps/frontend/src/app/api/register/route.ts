import { generateToken, hashPassword,  validateEmailAndPassword} from "@fullstack-todo/functions";
import { PrismaClient } from '@prisma/client'
import { DBErrorHandler, GenericRequest, IDBError } from '@fullstack-todo/types'


export async function POST(req: GenericRequest) {

    const { email, password } = await req.body;

    if (!validateEmailAndPassword(email, password)) {
        return Response.json({
            error: "INVALID_EMAIL_OR_PASSWORD",
        }, { status: 400 });
    }

    const client = new PrismaClient();
    
    let result;

    try {
        client.$connect();

        result = await client.users.create({
            data: {
                email: email,
                password: (await hashPassword(password))
            }
        })
    }

    catch (err: IDBError | any) {
        return DBErrorHandler(err);
    }

    finally {
        client.$disconnect();
    }

    return Response.json({
        user: { 
            email: result.email,
            id: result.id
         },
        token: generateToken({
            email: result.email,
            id: result.id
        }),
        message: "ok"
    }, {
        status: 200,
    })
}
import { NextApiRequest } from "next";
import { NextRequest } from "next/server";

export type GenericRequest = NextApiRequest & Request & NextRequest;
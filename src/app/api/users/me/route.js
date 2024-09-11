import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { verifyJWT } from "@/utils/jwt"; // Importera din JWT-verifiering

const prisma = new PrismaClient();

export async function GET(req) {
    try {
        // Hämta Authorization-headern som innehåller JWT-token
        const authHeader = req.headers.get("Authorization");

        if (!authHeader) {
            return NextResponse.json({
                message: "Authorization header is missing"
            }, { status: 401 });
        }

        // Extrahera JWT-token från Authorization-headern
        const token = authHeader.split(" ")[1]; // Vi antar att headern ser ut som "Bearer <token>"
        
        // Verifiera JWT-token och få ut användarens ID
        const { userId } = await verifyJWT(token);

        // Hämta användarens information från databasen
        const user = await prisma.user.findUniqueOrThrow({
            where: { id: Number(userId) }
        });

        // Returnera användarens data
        return NextResponse.json(user);

    } catch (error) {
        console.error("Error fetching user data:", error);
        return NextResponse.json({
            message: "Failed to fetch user data"
        }, { status: 500 });
    }
}

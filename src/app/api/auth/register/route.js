import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import * as jwt from "@/utils/jwt";
import bcrypt from "bcrypt";

// Prisma client
const prisma = new PrismaClient();

// POST: Användarregistrering
export async function POST(req) {
    try {
        const { email, password, name } = await req.json();

        // Kontrollerar att email och lösenord skickas
        if (!email || !password) {
            return NextResponse.json({ error: "Email and password are required" },
                { status: 400 });
        }

        // Kontrollera om användaren redan finns
        const existingUser = await prisma.user.findUnique({
            where: { email }
        });

        if (existingUser) {
            console.log("Användare med denna email finns redan:", email);
            return NextResponse.json({ error: "Email already in use" }, { status: 400 });
        }

        // Hasha lösenordet innan det sparas i databasen
        const hashedPassword = await bcrypt.hash(password, 10);
        console.log("Hashat lösenord:", hashedPassword);

        // Skapar en ny användare om den inte finns 
        const user = await prisma.user.create({
            data: {
                email,
                password: hashedPassword,
                name
            }
        });

        console.log("Ny användare skapad:", user);

        // Skapar en JWT-token för användaren
        const token = await jwt.signJWT({ userId: user.id, email: user.email });
        console.log("JWT skapad:", token);

        // Returnerar anv.uppgifter och token
        return NextResponse.json({ token, user }, { status: 201 });
    } catch (error) {
        console.error("Ett fel inträffade:", error);
        return NextResponse.json({ error: "User already exists or other error" }, { status: 500 });
    }
}

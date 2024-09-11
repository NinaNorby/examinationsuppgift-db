import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import * as jwt from "@/utils/jwt";

// Prisma clienten
const prisma = new PrismaClient();

export async function POST(req) {
    const { email, password } = await req.json();

    // Kontrollerar om email och lösenord har skickats in
    if (!email || !password) {
        return NextResponse.json({ error: "Email and password are required" }, { status: 400 });
  
    }

    // Hämtar användaren från databasen baserat på e-postadressen
    const user = await prisma.user.findUnique({
        where: { email }
    });

  

    // Om användaren inte finns returneras 400
    if (!user) {
        return NextResponse.json({ error: "Invalid email or password" }, { status: 401 });
    }

    

    // Här sker en validering där man jämför det inskickade lösenordet med det hashade lösenordet i databasen
    const isPasswordValid = await bcrypt.compare(password, user.password);
    

    // Om lösenordet inte stämme så returneras ett felmeddelande tillå användaren
    if (!isPasswordValid) {
        return NextResponse.json({ error: "Invalid email or password" }, { status: 401 });
    }

    // Skapar en JWT-token för användaren med användarens id och epost 
    const token = await jwt.signJWT({ userId: user.id, email: user.email });

    // Returnera användaruppgifterna och token
    return NextResponse.json({ token, user }, { status: 200 });
}

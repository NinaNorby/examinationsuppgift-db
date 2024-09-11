import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { validateUserData, validateJSONData } from "@/utils/helpers";
import * as jwt from "@/utils/jwt";


const prisma = new PrismaClient();  // Skapar en ny instans (new ) av PrismaClient för att kunna göra databasanrop


// GET: Hämtar alla användare från databasen (generell)
export async function GET(req) {
    try {
        const users = await prisma.user.findMany(); // Hämtar alla användare från 'user'-tabellen som finns i prsma 

        return NextResponse.json(users); // Returnerar användarna som en json-respons
    } catch (error) {
        console.log(error); // Loggar ev. fel till konsolen. Kan tas bort ? 
        return NextResponse.json({ message: "An error occurred while fetching users" }, {
            status: 500 //Returnerar 500 om intern serverfel uppstår 
        });
    }
}

// POST--> Skapar en ny användare i databasen
export async function POST(req) {
    // Validerar att JSON-datan som skickas är korrekt
    let [hasError, body] = await validateJSONData(req);
    if (hasError) {
        return NextResponse.json({
            message: "Invalid JSON data"
        }, {
            status: 400 // Returnerar en 400-statuskod om användardatan är ogiltig
        });
    }

    // Validerar användardatan
    const [validationFailed, errors] = validateUserData(body);
    if (validationFailed) {
        return NextResponse.json({ message: errors }, {
            status: 400 // Returnerar en 400-statuskod om användardatan är ogiltig
        });
    }

    try {
        // Kontrollera om en användare med samma e-postadress redan finns
        const existingUser = await prisma.user.findUnique({
            where: { email: body.email }
        });

        if (existingUser) {
            return NextResponse.json({
                error: "Email already in use"
            }, { status: 400 });
        }

        // Skapar den nya användaren
        const newUser = await prisma.user.create({
            data: body,
        });

        // Genererar en JWT-token för den nya användaren
        const token = await signJWT({ userId: newUser.id });

        // Returnerar användaren tillsammans med JWT-token
        return NextResponse.json({ user: newUser, token }, {
            status: 201 // Returnerar 201-status om användaren skapades
        });

    } catch (error) {
        console.error("Error creating user:", error);
        return NextResponse.json({
            message: "An error occurred while creating the user"
        }, {
            status: 500 // Returnerar 500 om intern serverfel uppstår
        });
    }
}

import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';  // Importerar PrismaClient --> interagera med databasen.

const prisma = new PrismaClient();  // Skapar en ny instans (new ) av PrismaClient för att kunna göra databasanrop

// GET: Hämtar ett specifikt item baserat på ID {id}. 
export async function GET(req, { params }) {
    const { id } = params; // Extraherar ID från URL-parametrarna

    try {
        const item = await prisma.item.findUniqueOrThrow({
            where: { id: Number(id) } // Hittar ett item baserat på ID, och kastar ett fel om det inte hittas.
        });
        return NextResponse.json(item); // Returnerar det hittade item som JSON-svar
    } catch (error) {
        // console.error(error);
        return NextResponse.json({ message: "Item not found" }, { status: 404 });
    }
}

// PUT: Uppdaterar ett item baserat på ID.
export async function PUT(req, { params }) {
    const { id } = params; // Extraherar ID från URL-parametrarna
    const body = await req.json();

    // Validera att quantity är 0 eller högre
    if (body.quantity < 0) {
        return NextResponse.json({ message: "Quantity cannot be less than 0" }, { status: 400 });
    }

    try {
        const updatedItem = await prisma.item.update({
            where: { id: Number(id) }, // Hittar och uppdaterar item baserat på ID
            data: body, // Uppdaterar item med den nya datan
        });
        return NextResponse.json(updatedItem); // Returnerar det uppdaterade item som JSON-svar
    } catch (error) {
        // console.error(error);
        return NextResponse.json({ message: "Item not found" }, { status: 404 });
    }
}

// DELETE: Tar bort ett item baserat på ID.
export async function DELETE(req, { params }) {
    const { id } = params; // Extraherar ID från URL-parametrarna

    try {
        await prisma.item.delete({
            where: { id: Number(id) }, // Raderar item baserat på ID
        });
        return new Response(null, { status: 204 }); // Returnerar en tom 204-respons om raderingen lyckas
    } catch (error) {
        // console.error(error);
        return NextResponse.json({ message: "Item not found" }, { status: 404 });
    }
}

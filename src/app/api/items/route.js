import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';  // Importerar PrismaClient --> interagera med databasen.

const prisma = new PrismaClient();  // Skapar en ny instans (new ) av PrismaClient för att kunna göra databasanrop

// GET: Hämta alla items med valbar filtrering på kategorier och lagerstatus
export async function GET(req) {

    //Hämtar först query-parametrarna vilka är categories och instock 
    const { searchParams } = new URL(req.url);
    const categories = searchParams.get('categories'); 
    const inStock = searchParams.get('inStock'); // true false eller null beroende på användarens filtrering (kommer använda checkboxes)
  
    const where = {}; //Tomt objekt som behövs då man kommer att bygga upp objektet beroende på filtreringsvalen som användaren gör
  
    if (categories) {
      // Dela upp de komma-separerade kategorierna till en array
      const categoryArray = categories.split(',').map(cat => cat.trim()); //['Mobile', 'Computers'] osv 
      where.category = { in: categoryArray }; // (hittat stackoverflow) man lägger till ett filtret för kategorier i where-objekt genom att säga att man vill ha items där category är i listan av valda kategorier: { in: categoryArray }.
    }
  
    if (inStock !== null && inStock !== "") {
      if (inStock === "true") {
        where.quantity = { gt: 0 }; // Lagerstatus: In Stock. gt:0 betyder "greater than" 0 . -->prisma docs 
      } else if (inStock === "false") {
        where.quantity = 0; // Lagerstatus: Out of Stock kommer att visas om quantity är 0
      }
    }
  
    try {
      const items = await prisma.item.findMany({
        where // Här kommer objektet med  de vilkor som användaren har satt upp avseende instock och category 
      });
      return NextResponse.json(items);
    } catch (error) {
      console.error(error);
      return NextResponse.json({
        message: "An error occurred while fetching items"
      }, {
        status: 500
      });
    }
  }


// POST: Skapar ett nytt item
export async function POST(req) {
    const body = await req.json();

    const userId = req.headers.get('x-user-id'); // Hämta userId från headern
    if (!userId) {
        return NextResponse.json({ error: "User ID not found" }, { status: 401 });
    }

    // Validera att quantity är 0 eller högre
    if (body.quantity < 0) {
        return NextResponse.json({ message: "Quantity cannot be less than 0" }, { status: 400 });
    }

    try {
        const newItem = await prisma.item.create({
            data: {
                name: body.name,
                description: body.description,
                quantity: body.quantity,
                category: body.category,
                userId: parseInt(userId),  // Använd userId från headern
            },
        });

        return NextResponse.json(newItem, { status: 201 });  // Returnerar det skapade item i JSON-format
    } catch (error) {
        console.log(error);
        return NextResponse.json({ message: "An error occurred while creating the item" }, { status: 500 });
    }
}

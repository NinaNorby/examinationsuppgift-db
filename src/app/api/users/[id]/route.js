import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { validateJSONData, validateUserData, object404Respsonse, validateItemData } from "@/utils/helpers";

const prisma = new PrismaClient();

export async function GET(req, {
    params
}) {
    const { id } = params;

    try {
        const user = await prisma.user.findUniqueOrThrow({
            where: { id: Number(id) }
        })
        return NextResponse.json(user);

    } catch (error) {
        console.error(error)
        return object404Respsonse(NextResponse, "User")
    }
}


// PUT-funktion för att UPPDATERA ett specifikt item baserat på ID . Get + en en uppdatering (?)
export async function PUT(req, { params }) {
    const { id } = params; //extraherar 

    let [hasError, body] = await validateJSONData(req);

    if (hasError) {
        return NextResponse.json({ message: "Invalid JSON data" }, {
            status: 400
        });
    }
    const [validationFailed, errors] = validateUserData(body);
    if (validationFailed) {
        return NextResponse.json({
            message: errors
        }, {
            status: 400
        })
    }

    try {
        const updatedUser = await prisma.user.update({
            where: {id: Number(id)},
            data: body,
        });
        return NextResponse.json(updatedUser);
    }catch(error){
        console.error(error);
        return object404Respsonse( NextResponse, "User")
    }
}


export async function DELETE(req,{params}){
    const {id} = params; // extrahetar id 

    try{
        await prisma.user.delete({
            where: {id: Number(id)}, //Raderar User på ID
        });
    } catch(error){
        console.error(error);
        return object404Respsonse(NextResponse, "User");
        
    }
}
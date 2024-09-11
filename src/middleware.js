/* Middleware kontrollerar om förfrågan riktar sig mot skyddade API-rutter.
   För de skyddade rutterna kontrolleras om en giltig JWT-token skickats med. 
   Om ingen eller en ogiltig token finns, returneras ett 401-fel.
   
Denna kod innehåller kod-delar från kursmaterialet som vår lärare tillhandahöll oss 
   */

import { NextResponse } from "next/server"; 
import * as jwt from "@/utils/jwt";  // Importerar jwt-funktioner från  utils/jwt.js

// Definierar de skyddade API-sökvägarna och metoderna som kräver autentisering
const protectedPaths = [
    [/\/api\/items\/.+/, ['PUT', 'DELETE', 'GET']],  // skaa skyddat put, delete, get på sökvägar som matchar /api/items/ID

    [/\/api\/items/, ['POST']],  // Skyddar post-anrop till /api/items
];

// Middlewarefunktionen  körs innan varje request! Kod är från  lektionen + stackoverflow   
export async function middleware(req) {
    // console.log(("middelwere is running "))
    const path = req.nextUrl.pathname;  // Hämtar den nuvarande URL-sökvägen

    // Kontrollera om sökvägen och metoden kräver autentisering .  Regex använder jag  för att generalisera och matcha alla rutter som börjar med /api/items/ + id 
    const isProtected = protectedPaths.some(([regex, methods]) => {
        return regex.test(path) && methods.includes(req.method);
    });

    // Om sökvägen är skyddad, kan man frtsätta med autentiseringen 
    if (isProtected) {
        // Hämtar Authorization i header fliken som innehåller JWT-token 
        const bearer = req.headers.get('Authorization');
        console.log("Bearer header:", bearer);  // FELSÖKNING 5/9

        // Om det inte finns en Authorization-header, returnera 401 (401 = Unauthorized)
        if (!bearer) {
            console.log("No bearer token found");
            return NextResponse.json({ error: "User not authenticated" }, { status: 401 });
        }

        try {
            // Extraherar JWT-token från Authorization headern (efter 'Bearer '). 
            const token = bearer?.split(' ')[1]; // Använder optional chaining ,tagit från lektionen,  för att undvika krascher om 'bearer' är null eller undefined .
            console.log("Extracted token:", token);  // Loggar token för felsökning
        
            if (!token) {
                // Om token saknas, returnera 401
                console.log("No token found after splitting the Bearer header");
                return NextResponse.json({ error: "User not authenticated" }, { status: 401 });
            }
        
            // Verifiera token och extrahera payload som innehåller användarens ID
            const payload = await jwt.verifyJWT(token, process.env.JWT_SECRET);
            console.log("Token payload:", payload);  // Loggar payloaden för felsökning
        
            // Skapa ett svar och sätt 'userId' som en extra header i requesten för vidare användning
            const response = NextResponse.next();  // Fortsätter requesten
            response.headers.set('x-user-id', payload.userId);  // Sätter `userId` som en header för att skicka vidare
        
            return response;  
        } catch (e) {
            // Om det sker ett fel under JWT-verifieringen, returnera 401
            console.log("Error during JWT verification:", e); // FELSÖKNING 5/9
            return NextResponse.json({ error: "User not authenticated" }, { status: 401 });
        }
        
    }

    // Om sökvägen inte är skyddad alls kommer man kunna fortsätta utan utan autentisering
    return NextResponse.next();
}

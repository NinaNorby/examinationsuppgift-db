//Denna kod innehåller kod-delar från kursmaterialet som vår lärare tillhandahöll oss 

import * as jose from "jose";  // Importerar JSON Web Token (JWT) funktioner från 'jose' biblioteket

// Denna funktion kommer att ska Skapa en JWT som innehåller informationen i payload (användar-ID och e-post osv). och signerar den med en sectret
export async function signJWT(payload, secret, options = {}) {

    // Om ingen secret skickas in används den som är definierad i process.env.JWT_SECRET
    secret = secret || process.env.JWT_SECRET;

    // Skapar en ny JWT med det datan som skickas in i payload och signerar den med den angivna secret
    const token = await new jose.SignJWT(payload)
        .setProtectedHeader({ alg: "HS256" })
        .setIssuedAt()  //Vi angav ej detta under lektion, och gör ej det för uppgiften då det inte är nödvändigt för dena uppgift 
        .setExpirationTime("7d")  // utgår efter 7 dagar. Här skulle jag kunnat ange en kortare tid, men gör enligt kodexemplen 
        .sign(new TextEncoder().encode(secret));  // Signerar JWT:n med den secret key 

    // Returnerar den signerade token
    return token;
}



// Ny funktion för att verifierar JWT-token och returnerar payload-innehållet om token är giltig(och inte manupelerad)

export async function verifyJWT(token, secret) {

    // Om ingen secret skickas in används den som är definierad i process.env.JWT_SECRET
    secret = secret || process.env.JWT_SECRET;

    // Verifierar JWTn med den angivna secret och returnerar payload(innehållet)
    const { payload } = await jose.jwtVerify(
        token,  // Token som ska verifieras
        new TextEncoder().encode(secret)  // Kodar secret som används för verifiering
    );

    // Returnerar det dekodade och verifierade innehållet i JWT:n ( userId, email osv.)
    return payload;
}



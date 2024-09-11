//Denna kod innehåller kod-delar från kursmaterialet som vår lärare tillhandahöll oss 

//Här samlas alla funktioner som jag återanvänder 


/*Denna funktion ska validera datan som kommer in.
Funktionen tar in body som argument --> Funktionen körs och kontrollerar alla fält i body för att se om de uppfyller de krav som är satta . Om det uppstår fel kommer 
 */
export function validateItemData(data) {
    let errors = {}
    if (!data.name || typeof data.name !== "string") {
        errors.name = "Name is required"
    }
    if (!data.description || typeof data.description !== "string") {
        errors.description = "Description is required"
    }
    if (!data.quantity || typeof data.quantity !== "number" || data.quantity < 0) {
        errors.quantity = "Quantity must be a positive number"
    }
    if (!data.category || typeof data.category !== "string") {
        errors.category = "Category is required"
    }

    const hasErrors = Object.keys(errors).length > 0;
    return [hasErrors, errors]
}



// Denna funktion ska validera datan som kommer in aveeende User 
export function validateUserData(data) {
    let errors = {};

    // Kontrollera om namn är närvarande och en sträng
    if (!data.name || typeof data.name !== "string") {
        errors.name = "Name is required and must be a string";
    }

    /* Kontrollera om e-post har skrivits av en sträng, och i rätt format. Det finns en mer komplex lösning på stackoverflow som skulle kunna vara bättre men denna bör räcka för examinationsuppgiften. 
    "/\S+@\S+\.\S+/" = Regex */
    if (!data.email || typeof data.email !== "string" || !/\S+@\S+\.\S+/.test(data.email)) {
        errors.email = "A valid email is required";
    }

    // Kontrollera om lösenord är närvarande och en sträng
    if (!data.password || typeof data.password !== "string") {
        errors.password = "Password is required and must be a string";
    }

    const hasErrors = Object.keys(errors).length > 0;
    return [hasErrors, errors];
}




//Generisk 404 responsfunktion som kan användas 
export function object404Respsonse(response, model = "") {
    return response.json({
        message: `${model} not found`
    }, {
        status: 404
    })
}


//Funktion för att parsa JSON-data från en HTTP-förfrågan och hantera eventuella fel som kan uppstå
  
export async function validateJSONData(req) {
    let body; // Variabel för att lagra den parsed JSON-datan

    try {
        // try  att parsa den inkommande förfrågan (req) till JSON
        body = await req.json(); // Parsar inkommande data to JSON

        // Om parsningen lyckas, returnera false (inga fel) och den parsed JSON-datan
        return [false, body]; 
    } catch (error) {
        // Om ett fel uppstår under parsningen, returneras true (indikerar ett FEL) och null
        return [true, null]; 
    }
}

export async function showTemporaryMessage(setMessageFunc, message, timeout =3000) {

    setMessageFunc(message);

    setTimeout(()=> {
        setMessageFunc("");
    }, timeout);
    
}
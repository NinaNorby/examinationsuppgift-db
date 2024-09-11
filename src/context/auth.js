"use client";  // Detta markerar komponenten vilket betyder att det "the action takes place on the user's (the client's) computer."

import { createContext, useContext, useEffect, useState } from "react";

// Default-värden för AuthContext som kommer att användas innan token eller användarinformation sätts
const defaultState = {
    user: null,       // Användarinformation sätts som null i  början 
    token: null,      // JWT-token sätts som null i början 
    setToken: () => {},   // En placeholder-funktion för att sätta token senare (den är tom just nu)
    logout: () => {}      // En placeholder-funktion för att logga ut användaren(den är också tom initialt )
};

// Skapar AuthContext med defaultState som standardvärde
const AuthContext = createContext(defaultState);

function AuthProvider({ children }) {
    /* State för att hålla JWT-token som användaren får vid inloggning/registrering.  Den omsluter alla komponenter som behöver tillgång till autentiseringsstatus och tillhandahåller token, setToken och logout via en React Context.*/
    const [token, setToken] = useState(defaultState.token);
    

    // Denna funktion körs när sidan laddas då jag vill veta om användaren redan är inloggad (altså, finns det redan en JWT i webbläsarens localStorage ?). UseEffect kommer att köras direkt när AuthProvider-komponenten laddas för första gången.
    useEffect(() => {
        const _token = localStorage.getItem("@library/token");  // Hämta token från localStorage om den finns 
        if (_token) {
            setToken(_token);  // Om det finns en sparad token  i local storage (_token), kommer den att sättas som state genom att anropa setToken(_token). 
        }
    }, []); //  useEffect kommer bara ska köras en gång när komponenten(AuthProvider)(sidan/components) först laddas, inte varje gång sidan renderas om

    // Funktion för att logga ut användaren
    function logout() {
        localStorage.removeItem("@library/token");  // Ta bort token från localStorage
        setToken(null);  // Nollställ token i state
    }

    return (
        // Provider-komponenten ger alla underkomponenter tillgång till token, setToken och logout-funktion
        <AuthContext.Provider
            value={{
                token,          // Den aktuella JWT-token
                user: null,     // Användarinformation som du kan hantera senare
                setToken,       // Funktion för att uppdatera token
                logout          // Funktion för att logga ut användaren
            }}
        >
            {children} 
        </AuthContext.Provider>
    );
}

// Hook för att enkelt kunna använda AuthContext i andra komponenter
function useAuth() {
    return useContext(AuthContext);  // Returnerar kontextvärdena (token, setToken, logout)
}

// Exportera AuthProvider och useAuth för användning i andra delar av applikationen
export { AuthProvider, useAuth };

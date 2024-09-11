"use client"; // Detta säger att komponenten ska köras på klientens sida vilket behövs när jag använder react -hooks

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/auth";


function AuthForm() {
    const router = useRouter(); //används för att omdirigera användaren till en annan sida efter lyckad inloggning/reg. exempelvis --> items    
    const auth = useAuth();  // Om du använder en auth-context ( se filen context/auth ), användes den här hooken för att få tillgång till autentiseringsstatus och sätta JWT-token när användaren loggar in eller registrerar sig.

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [name, setName] = useState("");
    const [error, setError] = useState("");
    const [isLogin, setIsLogin] = useState(true);

    async function handleSubmit(e) {
        e.preventDefault(); // Sidan laddas ej om när formuläret skickas in . 

        setError("");   // Återställ eventuella tidigare felmeddelanden

        /*När användaren loggar in eller registrerar sig, skickas en POST-förfrågan . detta är altså min filstruktur för att komma till login och reg. 
        Om  isLogin är true, visas formuläret för inloggning. Om det är false, visar formuläret även ett fält för namn och används för registrering.*/
        const url = isLogin ? "/api/auth/login" : "/api/auth/register";
        const response = await fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                email,
                password,
                name,
            }),
        });

        if (response.ok) {
            const data = await response.json();

            //Jag har valt att använda sessionstorage ist för localstorage då datan kommer att raderas så fort som fönstret stängs . Altså kommer inte JWT att finnas sparad 
            sessionStorage.setItem("token", data.token);  // Spara token i sessionStorage

            // localStorage.setItem("token", data.token);

            auth.setToken(data.token);  // Om du har en auth-context
            router.push("/items");  // Exempel: Omdirigera till items-sidan efter inloggning
            return;
        }
        setError("Invalid login credentials");
    }

    return (
        <div>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Email</label>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="bg-white ml-10 mb-2 border border-gray-400 hover:border-gray-500  rounded shadow leading-tight focus:outline-none focus:shadow-outline"
                    />
                </div>
                <div>
                    <label>Password</label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="bg-white ml-1 mb-2 border border-gray-400 hover:border-gray-500  rounded shadow leading-tight focus:outline-none focus:shadow-outline"
                    />
                </div>
                {!isLogin && (
                    <div>
                        <label>Name</label>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="bg-white ml-9 mb-2 border border-gray-400 hover:border-gray-500  rounded shadow leading-tight focus:outline-none focus:shadow-outline"

                        />
                    </div>
                )}
                {error && <p className="text-red-600">{error}</p>}
                <button type="submit"
                    className="bg-gray-700 hover:bg-gray-800 text-white font-bold py-2 px-4 rounded ml-2 mt-4 mb-2"
                >{isLogin ? "Login" : "Register"}

                </button>

                <button
                    type="button"
                    onClick={() => setIsLogin(!isLogin)}
                    className="bg-gray-700 hover:bg-gray-800 text-white font-bold py-2 px-4 rounded ml-2 mt-4"
                >
                    {isLogin ? "Register" : "Login"}
                </button>

            </form>
        </div>
    );
}

export default AuthForm;

"use client";  // Detta är viktigt för att markera att komponenten ska köras på klienten
import { useAuth } from "@/context/auth";
import { useRouter } from "next/navigation";
import Link from "next/link";

function Header() {
    const auth = useAuth();
    const router = useRouter(); 

    const handleLogout = () => {
        auth.logout();  // Kör logout-funktionen från din auth-context
        router.push("/");  // Omdirigera till startsidan istället för /login
    };
    return (
        <header className="flex items-center justify-between bg-gray-800 p-4">
            <h1 className="text-3xl font-bold text-white">InventoryHub</h1>
            {auth.token ? (
                <button
                    onClick={handleLogout}  // Använd handleLogout istället för att bara köra logout
                    className="text-white bg-red-800 hover:bg-red-900 px-4 py-2 rounded"
                >
                    Logout
                </button>
            ) : (
                <Link
                    href="/"
                    className="text-white bg-blue-800 hover:bg-blue-900 px-4 py-2 rounded"
                >
                    Login
                </Link>
            )}
        </header>
    );
}

export default Header;
"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";  // För att omdirigera
import { useAuth } from "@/context/auth";  // För att kontrollera autentisering
import ItemForm from "@/components/ItemForm";  // Importera ItemForm

export default function ItemsPage() {
  const { token } = useAuth();  // Hämta JWT-token från AuthContext
  const router = useRouter();

  // Kontrollera om användaren är inloggad
  useEffect(() => {
    if (!token) {
      // Omdirigera till localhost:3000 om användaren inte är inloggad och försöker att gå in på ex. /items
      router.push("/"); 
    }
  }, [token, router]);

  // Om användaren inte är inloggad, returnera null (visar inget)
  if (!token) {
    return null;
  }

  return (
    <main>
      <h1 className =" text-lg text-center font-bold md-7 ">Inventory Management</h1>
      
      <ItemForm />  {/* Visar ItemForm OM användaren är inloggad!! */}
    </main>
  );
}

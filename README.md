
## **Slutuppgift v3.1**

Studenterna ska bygga en inventariehanteringsapplikation där användare kan hantera inventarieobjekt. Applikationen ska använda Next.js för både  backend och valfri frontend och Prisma för databasinteraktion. Fokus ska ligga på backend-funktionaliteten.

**Modeller**:

1. **User**: Hanterar användarregistrering och autentisering.
    - Fields: id, name, email, password
2. **Item**: Representerar ett inventarieobjekt.
    - Fields: id, name, description, quantity, category



Studenterna ska bygga en inventariehanteringsapplikation där användare kan hantera inventarieobjekt. Applikationen ska använda Next.js för både  backend och valfri frontend och Prisma för databasinteraktion. Fokus ska ligga på backend-funktionaliteten.



### **Specifikationer:**

1. **Setup och Modeller**:
    - Skapa en Next.js-applikation.
    - Definiera Prisma-modeller för User och Item
    - Kör Prisma migrations för att skapa databasschemat.
2. **API-rutter**:
    - Implementera CRUD-operationer för Item.
    - Validera in och ut data och retunera errors där det är rimligt
    - Implementera användarregistrering och autentisering med JWT.
    - (**VG**) Hämtning av items ska det gå att filtrera på kategorier (flera valbara) och på lagerstatus om det finns eller inte i lagret (true/false)
    - (**VG**) Manipulativa dataanrop (skapande och uppdatering) kan inte ske om man inte är inloggad.
    - 3. **Frontend**:
    - Skapa enkla sidor för att:
        - Registrera och logga in användare.
        - Skapa, läsa, uppdatera och radera inventarieobjekt.
        - (**VG**) Visa konkreta errors som retuneras från backend
        - Valfri design  / styling men lägg inte ner för mycket tid på det utan fokusera på funktionalitet.
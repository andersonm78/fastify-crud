-- CreateTable
CREATE TABLE "Bibliotecario" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "nome" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "endereco" TEXT,
    "nascimento" DATETIME
);

-- CreateIndex
CREATE UNIQUE INDEX "Bibliotecario_email_key" ON "Bibliotecario"("email");

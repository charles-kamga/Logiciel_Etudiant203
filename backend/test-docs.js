const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  // 1. Trouver l'ID de l'UE ict203
  const ue = await prisma.uE.findUnique({ where: { code: 'ict203' } });

  if (!ue) {
    console.log("Erreur : L'UE ict203 n'existe pas. Créez-la d'abord dans l'admin.");
    return;
  }

  // 2. Créer deux ressources de test
  await prisma.ressource.createMany({
    data: [
      { nom: "Introduction aux bases de données", url: "/docs/cours1.pdf", ueId: ue.id },
      { nom: "Schéma Relationnel et Normalisation", url: "/docs/cours2.pdf", ueId: ue.id }
    ]
  });

  console.log("Documents de test créés avec succès !");
}

main().catch(e => console.error(e)).finally(() => prisma.$disconnect());
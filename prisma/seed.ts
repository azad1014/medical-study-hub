import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

async function main() {
  console.log("Seeding database...")

  // Create subjects
  const pathology = await prisma.subject.create({
    data: {
      name: "Pathology",
      description: "Study of disease processes",
      icon: "microscope",
      color: "#ef4444",
      order: 1,
    },
  })

  const pharmacology = await prisma.subject.create({
    data: {
      name: "Pharmacology",
      description: "Study of drugs and their actions",
      icon: "pill",
      color: "#3b82f6",
      order: 2,
    },
  })

  // Create topics
  const inflammation = await prisma.topic.create({
    data: {
      name: "Inflammation",
      subjectId: pathology.id,
      order: 1,
      content: "Inflammation is a protective response involving host cells, blood vessels, and molecular mediators.",
    },
  })

  const neoplasia = await prisma.topic.create({
    data: {
      name: "Neoplasia",
      subjectId: pathology.id,
      order: 2,
      content: "Neoplasia is abnormal cell growth that may be benign or malignant.",
    },
  })

  // Create subtopics
  await prisma.subtopic.createMany({
    data: [
      { name: "Acute Inflammation", topicId: inflammation.id, content: "Rapid response to injury, neutrophil-mediated", order: 1 },
      { name: "Chronic Inflammation", topicId: inflammation.id, content: "Prolonged response, macrophage and lymphocyte-mediated", order: 2 },
      { name: "Chemical Mediators", topicId: inflammation.id, content: "Histamine, prostaglandins, leukotrienes, cytokines", order: 3 },
      { name: "Benign Tumors", topicId: neoplasia.id, content: "Well-differentiated, localized, no metastasis", order: 1 },
      { name: "Malignant Tumors", topicId: neoplasia.id, content: "Poorly differentiated, invasive, metastatic potential", order: 2 },
    ],
  })

  // Create sample flashcards
  await prisma.flashcard.createMany({
    data: [
      {
        front: "What are the five cardinal signs of acute inflammation?",
        back: "Rubor (redness), Calor (heat), Tumor (swelling), Dolor (pain), Functio laesa (loss of function)",
        subjectId: pathology.id,
        difficulty: 2,
        tags: ["inflammation", "pathology-basics"],
        userId: "demo-user",
      },
      {
        front: "What is the mechanism of action of ACE inhibitors?",
        back: "Block conversion of angiotensin I to angiotensin II, reducing vasoconstriction and aldosterone secretion",
        subjectId: pharmacology.id,
        difficulty: 3,
        tags: ["cardiovascular", "antihypertensives"],
        userId: "demo-user",
      },
    ],
  })

  // Create sample questions
  await prisma.question.createMany({
    data: [
      {
        stem: "Which of the following is the most common cause of acute pancreatitis?",
        options: ["Alcohol", "Gallstones", "Hypertriglyceridemia", "Trauma", "Medications"],
        correctAnswer: ["1"],
        explanation: "Gallstones are the most common cause of acute pancreatitis.",
        questionType: "SINGLE_CHOICE",
        difficulty: 2,
        tags: ["GI", "pancreas"],
      },
      {
        stem: "Which of the following are risk factors for DVT? (Select all)",
        options: ["Immobility", "Factor V Leiden", "Aspirin use", "Pregnancy", "Malignancy"],
        correctAnswer: ["0", "1", "3", "4"],
        explanation: "Virchow's triad: stasis, hypercoagulability, endothelial injury.",
        questionType: "MULTIPLE_CHOICE",
        difficulty: 3,
        tags: ["vascular", "hematology"],
      },
    ],
  })

  console.log("Seeding completed successfully!")
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })

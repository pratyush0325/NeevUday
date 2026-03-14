import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding database…");

  const hash = (p: string) => bcrypt.hash(p, 12);

  // Platform admin
  await prisma.user.upsert({
    where: { email: "admin@setu.in" },
    update: {},
    create: {
      name: "Setu Admin",
      email: "admin@setu.in",
      passwordHash: await hash("admin1234"),
      role: "platform",
      verified: true,
    },
  });

  // Donor
  const donor = await prisma.user.upsert({
    where: { email: "donor@ramesh.in" },
    update: {},
    create: {
      name: "Ramesh Mills Ltd",
      email: "donor@ramesh.in",
      passwordHash: await hash("donor1234"),
      role: "donor",
      location: "Mumbai",
      verified: true,
      donorProfile: { create: { orgName: "Ramesh Mills Ltd" } },
    },
    include: { donorProfile: true },
  });

  // NGO
  await prisma.user.upsert({
    where: { email: "ngo@udaan.in" },
    update: {},
    create: {
      name: "Udaan Foundation",
      email: "ngo@udaan.in",
      passwordHash: await hash("ngo1234"),
      role: "ngo",
      location: "Delhi",
      verified: true,
      ngoProfile: {
        create: {
          orgName: "Udaan Foundation",
          state: "Himachal Pradesh",
          focusAreas: ["food", "clothing"],
          verificationStatus: "approved",
          projects: {
            create: {
              title: "Winter blanket drive — Chamba",
              description: "Distributing 500 blankets to families in Chamba district",
              location: "Chamba, HP",
              progressPercent: 65,
              workersNeeded: 10,
              status: "active",
            },
          },
        },
      },
    },
  });

  // Worker
  await prisma.user.upsert({
    where: { email: "worker@setu.in" },
    update: {},
    create: {
      name: "Ravi Kumar",
      email: "worker@setu.in",
      passwordHash: await hash("worker1234"),
      role: "worker",
      location: "Delhi",
      workerProfile: {
        create: {
          skills: ["Driving", "Heavy lifting", "Sorting"],
          preferredWork: "Distribution & logistics",
          availableFrom: new Date(),
          rating: 4.8,
          daysWorked: 28,
          resourcesEarned: 6200,
        },
      },
    },
  });

  // Village rep
  await prisma.user.upsert({
    where: { email: "village@chamba.in" },
    update: {},
    create: {
      name: "Prahlad Singh Gautam",
      email: "village@chamba.in",
      passwordHash: await hash("village1234"),
      role: "village",
      location: "Chamba, HP",
      villageProfile: {
        create: {
          villageName: "Chamba",
          state: "Himachal Pradesh",
          district: "Chamba",
          requests: {
            create: {
              requestType: "clothing",
              urgency: "critical",
              quantity: 500,
              familiesAffected: 150,
              requiredBy: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
              details: "Winter is starting. 150 families need blankets before snowfall.",
              status: "pending",
            },
          },
        },
      },
    },
  });

  // Add a donation to the donor
  const donorProfile = await prisma.donorProfile.findUnique({
    where: { userId: donor.id },
  });
  if (donorProfile) {
    await prisma.donation.createMany({
      data: [
        { donorProfileId: donorProfile.id, category: "clothing", itemName: "Woollen blankets", quantity: 500, unit: "pieces", status: "queued" },
        { donorProfileId: donorProfile.id, category: "food", itemName: "Rice bags (50kg)", quantity: 200, unit: "bags", status: "matched" },
      ],
      skipDuplicates: true,
    });
  }

  console.log("✅ Seed complete!");
  console.log("\nTest accounts:");
  console.log("  admin@setu.in      / admin1234    (platform)");
  console.log("  donor@ramesh.in    / donor1234    (donor)");
  console.log("  ngo@udaan.in       / ngo1234      (ngo)");
  console.log("  worker@setu.in     / worker1234   (worker)");
  console.log("  village@chamba.in  / village1234  (village)");
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());

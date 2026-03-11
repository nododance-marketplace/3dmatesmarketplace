import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// ── Helper: random date in April/May 2026 ──────────────────────
function randomDate(monthStart: number, monthEnd: number): Date {
  const month = monthStart + Math.floor(Math.random() * (monthEnd - monthStart + 1));
  const day = 1 + Math.floor(Math.random() * 28); // safe for all months
  return new Date(2026, month - 1, day);
}

// ── Seed Providers ─────────────────────────────────────────────
const seedProviders = [
  {
    email: "seed-provider-1@3dmates.demo",
    name: "Marcus Chen",
    displayName: "Chen Fabrication Co.",
    slug: "chen-fabrication-co",
    headline: "High-precision FDM & resin printing for automotive and industrial parts",
    bio: "10+ years of manufacturing experience. We specialize in strong functional parts using engineering-grade filaments like Nylon-CF and PC. Our shop runs a fleet of Bambu X1Cs and a Formlabs Form 3L for large resin jobs. Quick turnaround on prototypes, replacement parts, and small production runs.",
    materials: JSON.stringify(["PLA", "PETG", "Nylon", "Nylon-CF", "PC"]),
    processes: JSON.stringify(["FDM", "RESIN"]),
    capabilities: JSON.stringify(["CAD_CLEANUP", "AUTOMOTIVE_FITMENT", "RAPID_PROTOTYPING"]),
    address: "2100 South Blvd, Charlotte, NC 28203",
    lat: 35.2101,
    lng: -80.8570,
  },
  {
    email: "seed-provider-2@3dmates.demo",
    name: "Jasmine Torres",
    displayName: "Torres 3D Studio",
    slug: "torres-3d-studio",
    headline: "Resin specialist — miniatures, jewelry molds, and cosplay props",
    bio: "I run a boutique resin studio in NoDa focused on fine-detail work. From tabletop miniatures to wearable cosplay armor, I deliver smooth, paint-ready surfaces. All prints are cured and post-processed in-house. I also offer custom paint and finish services.",
    materials: JSON.stringify(["Resin", "PLA", "TPU"]),
    processes: JSON.stringify(["RESIN", "FDM"]),
    capabilities: JSON.stringify(["CAD_DESIGN", "PAINT_FINISH", "SMALL_BATCH"]),
    address: "3200 N Davidson St, Charlotte, NC 28205",
    lat: 35.2429,
    lng: -80.8103,
  },
  {
    email: "seed-provider-3@3dmates.demo",
    name: "Derek Okonkwo",
    displayName: "QC Prototyping",
    slug: "qc-prototyping",
    headline: "Rapid prototyping for startups and product teams in the Charlotte area",
    bio: "We help founders go from CAD to physical prototype in under 48 hours. Our shop is equipped for FDM, SLS, and basic CNC finishing. We work with product designers, engineers, and hardware startups across the Carolinas. Volume discounts available for batch orders.",
    materials: JSON.stringify(["PLA", "PETG", "ABS", "Nylon"]),
    processes: JSON.stringify(["FDM", "SLS"]),
    capabilities: JSON.stringify(["RAPID_PROTOTYPING", "CAD_CLEANUP", "SMALL_BATCH"]),
    address: "1000 W Morehead St, Charlotte, NC 28208",
    lat: 35.2204,
    lng: -80.8662,
  },
  {
    email: "seed-provider-4@3dmates.demo",
    name: "Kayla Bennett",
    displayName: "Kayla Makes",
    slug: "kayla-makes",
    headline: "Custom home decor, organizers, and functional prints",
    bio: "I design and print custom home goods — wall art, planters, drawer organizers, light fixtures, and more. Everything is designed in Fusion 360 and printed on my Prusa farm. I love helping people solve everyday problems with 3D printing. Commissions welcome!",
    materials: JSON.stringify(["PLA", "PETG", "TPU"]),
    processes: JSON.stringify(["FDM"]),
    capabilities: JSON.stringify(["CAD_DESIGN", "PAINT_FINISH"]),
    address: "4600 Park Rd, Charlotte, NC 28209",
    lat: 35.1856,
    lng: -80.8602,
  },
  {
    email: "seed-provider-5@3dmates.demo",
    name: "Ryan Vasquez",
    displayName: "Vasquez CNC & Print",
    slug: "vasquez-cnc-print",
    headline: "CNC machining + 3D printing under one roof",
    bio: "We combine additive and subtractive manufacturing for parts that need both. Print a prototype in PLA, then machine the final version in aluminum or delrin. Our hybrid workflow saves time and reduces iteration cost. Located in the University area with easy highway access.",
    materials: JSON.stringify(["PLA", "ABS", "ASA", "Nylon-CF", "PC"]),
    processes: JSON.stringify(["FDM", "CNC"]),
    capabilities: JSON.stringify(["AUTOMOTIVE_FITMENT", "RAPID_PROTOTYPING", "INSTALL_HELP"]),
    address: "8700 University City Blvd, Charlotte, NC 28213",
    lat: 35.3074,
    lng: -80.7454,
  },
];

// ── Seed Jobs ──────────────────────────────────────────────────
const seedJobs = [
  {
    title: "Custom dashboard mount for 2019 Civic",
    description: "Need a custom phone/tablet mount that clips into the dashboard vent of a 2019 Honda Civic. Must be sturdy enough for daily use and not rattle. Ideally printed in PETG or ABS for heat resistance. I have rough dimensions but no CAD file — would need design help.",
    category: "AUTO",
    materials: JSON.stringify(["PETG", "ABS"]),
    budgetMin: 40,
    budgetMax: 80,
  },
  {
    title: "Replacement knob for vintage amplifier",
    description: "Looking for someone to 3D print a replacement volume knob for a 1978 Marantz receiver. The original cracked and the part is discontinued. I can send photos and measurements. Needs to match the original shape closely — smooth finish preferred.",
    category: "REPLACEMENT_PART",
    materials: JSON.stringify(["PLA", "Resin"]),
    budgetMin: 15,
    budgetMax: 35,
  },
  {
    title: "10x enclosures for IoT sensor prototype",
    description: "We're building a small environmental sensor and need 10 enclosures printed for our pilot deployment. The enclosure has snap-fit lid, cable grommet hole, and mounting tabs. STL files are ready. Need someone who can do consistent quality across a batch.",
    category: "PROTOTYPE",
    materials: JSON.stringify(["PETG"]),
    budgetMin: 120,
    budgetMax: 200,
  },
  {
    title: "Cosplay helmet — Mandalorian style",
    description: "Looking for a printer who can produce a full-size Mandalorian helmet, ideally split into printable sections and assembled. I'd like it sanded and primed, but I'll handle the final paint. Must be wearable and comfortable.",
    category: "COSPLAY",
    materials: JSON.stringify(["PLA", "Resin"]),
    budgetMin: 150,
    budgetMax: 300,
  },
  {
    title: "Drawer organizer set for kitchen",
    description: "Need a set of interlocking drawer organizers for a standard kitchen drawer (15\" x 20\"). Want modular pieces that snap together. Clean, modern look — matte white PLA preferred. Will need 8-12 individual pieces total.",
    category: "HOME",
    materials: JSON.stringify(["PLA"]),
    budgetMin: 50,
    budgetMax: 100,
  },
  {
    title: "CNC-ready jig for PCB alignment",
    description: "We need a jig that holds a small PCB (50mm x 30mm) in place during manual soldering. Needs to be precise to ±0.2mm. Preferably machined or printed in a rigid material. We have STEP files ready to go.",
    category: "INDUSTRIAL",
    materials: JSON.stringify(["ABS", "Nylon"]),
    budgetMin: 60,
    budgetMax: 120,
  },
  {
    title: "Prototype housing for handheld device",
    description: "Building a handheld device for our startup and need a realistic prototype housing. Two-part shell with screw bosses, button cutouts, and display window. We have Fusion 360 files. Need 2 copies — one in PLA for fit check, one in resin for investor demo.",
    category: "PROTOTYPE",
    materials: JSON.stringify(["PLA", "Resin"]),
    budgetMin: 200,
    budgetMax: 400,
  },
  {
    title: "Replacement bracket for dishwasher rack",
    description: "The plastic bracket that holds the upper rack rail in my Bosch dishwasher snapped. The OEM part is $45 + shipping and takes 3 weeks. Looking for someone to print a replacement in a heat/water-resistant material. I can provide the broken original for reference.",
    category: "REPLACEMENT_PART",
    materials: JSON.stringify(["PETG", "ASA"]),
    budgetMin: 20,
    budgetMax: 40,
  },
  {
    title: "Miniature terrain set for D&D campaign",
    description: "Looking for a resin printer to produce a set of dungeon terrain tiles — walls, floors, doors, pillars, and stairs. About 30 pieces total based on OpenLOCK format. Needs to be clean and detailed enough for tabletop play. Unpainted is fine.",
    category: "OTHER",
    materials: JSON.stringify(["Resin"]),
    budgetMin: 100,
    budgetMax: 180,
  },
  {
    title: "Custom laptop stand with cable management",
    description: "Want a custom laptop riser/stand for a 15\" MacBook Pro that includes built-in cable routing channels and a phone holder slot on the side. Needs to support the laptop weight without flexing. Open to material suggestions — just needs to look clean on a desk.",
    category: "HOME",
    materials: JSON.stringify(["PLA", "PETG"]),
    budgetMin: 35,
    budgetMax: 70,
  },
];

// ── Main seed function ─────────────────────────────────────────
async function main() {
  console.log("🌱 Seeding 3DMates demo data...\n");

  // Create seed users and provider profiles
  for (const sp of seedProviders) {
    const existingUser = await prisma.user.findUnique({
      where: { email: sp.email },
    });

    if (existingUser) {
      console.log(`  ⏭  Provider "${sp.displayName}" already exists, skipping.`);
      continue;
    }

    const user = await prisma.user.create({
      data: {
        email: sp.email,
        name: sp.name,
        role: "PROVIDER",
        hasOnboarded: true,
        providerProfile: {
          create: {
            slug: sp.slug,
            displayName: sp.displayName,
            headline: sp.headline,
            bio: sp.bio,
            city: "Charlotte",
            address: sp.address,
            lat: sp.lat,
            lng: sp.lng,
            materials: sp.materials,
            processes: sp.processes,
            capabilities: sp.capabilities,
            status: "APPROVED",
            isSeed: true,
          },
        },
      },
    });

    console.log(`  ✅ Provider "${sp.displayName}" created (user: ${user.id})`);
  }

  // Create a seed customer user for job listings
  const seedCustomerEmail = "seed-customer@3dmates.demo";
  let seedCustomer = await prisma.user.findUnique({
    where: { email: seedCustomerEmail },
  });

  if (!seedCustomer) {
    seedCustomer = await prisma.user.create({
      data: {
        email: seedCustomerEmail,
        name: "Demo Customer",
        role: "CUSTOMER",
        hasOnboarded: true,
      },
    });
    console.log(`\n  ✅ Seed customer created (user: ${seedCustomer.id})`);
  } else {
    console.log(`\n  ⏭  Seed customer already exists.`);
  }

  // Create seed jobs
  console.log("");
  for (const sj of seedJobs) {
    const existing = await prisma.jobRequest.findFirst({
      where: { title: sj.title, isSeed: true },
    });

    if (existing) {
      console.log(`  ⏭  Job "${sj.title}" already exists, skipping.`);
      continue;
    }

    const createdAt = randomDate(4, 5); // April or May 2026
    const deadline = new Date(createdAt);
    deadline.setDate(deadline.getDate() + 7 + Math.floor(Math.random() * 21)); // 7-28 days after creation

    await prisma.jobRequest.create({
      data: {
        customerId: seedCustomer.id,
        title: sj.title,
        description: sj.description,
        category: sj.category,
        materials: sj.materials,
        budgetMin: sj.budgetMin,
        budgetMax: sj.budgetMax,
        deadline,
        city: "Charlotte",
        status: "OPEN",
        isSeed: true,
        createdAt,
      },
    });

    console.log(`  ✅ Job "${sj.title}" created`);
  }

  console.log("\n🎉 Seed complete!");
}

main()
  .catch((e) => {
    console.error("❌ Seed failed:", e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());

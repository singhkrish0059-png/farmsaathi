import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
const db = new PrismaClient();
const cats = ["Grains", "Fruits", "Vegetables", "Seeds", "Natural Fertilizers", "Organic Products", "Other Farm Products"];
const places = [["Hosahalli", "Mandya"], ["Belur", "Hassan"], ["Kanakapura", "Ramanagara"], ["Hunsur", "Mysuru"], ["Devanahalli", "Bengaluru Rural"],
  ["Sira", "Tumakuru"], ["Dharwad", "Dharwad"], ["Raichur", "Raichur"], ["Chikkaballapur", "Chikkaballapur"], ["Madikeri", "Kodagu"]];
// [name, category, price, unit]
const items: [string, string, number, string][] = [["Ragi (Finger Millet)", "Grains", 42, "kg"], ["Sona Masoori Rice", "Grains", 55, "kg"], ["Tomatoes", "Vegetables", 28, "kg"],
  ["Robusta Bananas", "Fruits", 40, "dozen"], ["Groundnuts", "Grains", 95, "kg"], ["Organic Vermicompost", "Natural Fertilizers", 18, "kg"], ["Neem Cake", "Natural Fertilizers", 30, "kg"],
  ["Cow Dung Manure", "Natural Fertilizers", 8, "kg"], ["Organic Compost", "Natural Fertilizers", 12, "kg"], ["Bio-fertilizer (Rhizobium)", "Natural Fertilizers", 120, "litre"],
  ["Ragi Seeds", "Seeds", 80, "kg"], ["Brinjal", "Vegetables", 32, "kg"], ["Jowar", "Grains", 48, "kg"], ["Mangoes (Totapuri)", "Fruits", 60, "kg"], ["Onions", "Vegetables", 30, "kg"],
  ["Coorg Honey", "Organic Products", 450, "kg"], ["Turmeric Powder", "Organic Products", 160, "kg"], ["Coconut", "Fruits", 25, "piece"], ["Tur Dal", "Grains", 130, "kg"], ["Green Chilli", "Vegetables", 50, "kg"]];
async function main() {
  const pw = await bcrypt.hash(process.env.DEMO_PASSWORD ?? "demo-pass-123", 10);
  const C: Record<string, string> = {};
  for (const n of cats) C[n] = (await db.productCategory.upsert({ where: { name: n }, update: {}, create: { name: n } })).id;
  await db.user.upsert({ where: { email: process.env.ADMIN_EMAIL! }, update: {}, create: { name: "Admin", email: process.env.ADMIN_EMAIL!, phone: "0000000000", role: "ADMIN",
    passwordHash: await bcrypt.hash(process.env.ADMIN_PASSWORD!, 12) } });
  const farmers = [];
  for (let i = 0; i < 10; i++) {
    const u = await db.user.upsert({ where: { email: `farmer${i + 1}@demo.farmsaathi.test` }, update: {}, create: { name: `Demo Farmer ${i + 1}`, email: `farmer${i + 1}@demo.farmsaathi.test`,
      phone: `+9199999000${String(i).padStart(2, "0")}`, passwordHash: pw, role: "FARMER", isDemo: true,
      farmer: { create: { village: places[i][0], district: places[i][1], state: "Karnataka", farmingType: i % 2 ? "Organic" : "Traditional", farmingExperience: 5 + i, bio: "Demo Data: sample farmer profile.", verificationStatus: "VERIFIED" } } },
      include: { farmer: true } });
    farmers.push(u.farmer!);
  }
  if (!(await db.product.count({ where: { isDemo: true } })))
    for (const [i, [name, cat, price, unit]] of items.entries()) { const f = farmers[i % 10];
      await db.product.create({ data: { name, categoryId: C[cat], price, unit, quantityAvailable: 50 + i * 10, farmerId: f.id, location: `${f.village}, ${f.district}`,
        description: `Demo Data: fresh ${name.toLowerCase()} directly from the farm.`, isDemo: true, images: [] } }); }
  const buyer = await db.user.upsert({ where: { email: "buyer@demo.farmsaathi.test" }, update: {}, create: { name: "Demo Buyer", email: "buyer@demo.farmsaathi.test", phone: "+919999900100", passwordHash: pw, isDemo: true } });
  if (!(await db.enquiry.count()))
    for (const p of await db.product.findMany({ take: 5, where: { isDemo: true } }))
      await db.enquiry.create({ data: { buyerId: buyer.id, farmerId: p.farmerId, productId: p.id, message: `Demo Data: I would like to buy 50 ${p.unit} of ${p.name}. Is it available?` } });
}
main().finally(() => db.$disconnect());

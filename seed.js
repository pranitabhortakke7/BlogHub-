require("dotenv").config();
const mongoose = require("mongoose");
const Category = require("./models/Category"); // adjust path/casing if your file differs
 
const categories = [
  {
    title: "Technology",
    route: "technology",
    description: "Posts about technology and innovation",
  },
  {
    title: "Lifestyle",
    route: "lifestyle",
    description: "Posts about everyday life and habits",
  },
  {
    title: "Health",
    route: "health",
    description: "Posts about health and wellness",
  },
  {
    title: "Travel",
    route: "travel",
    description: "Posts about travel and places",
  },
];
 
async function seed() {
  try {
    await mongoose.connect(process.env.MongoDBURI);
    console.log("Connected to MongoDB");
 
    for (const cat of categories) {
      const exists = await Category.findOne({ route: cat.route });
      if (exists) {
        console.log(`Skipping "${cat.title}" (already exists)`);
        continue;
      }
      await Category.create(cat);
      console.log(`Inserted "${cat.title}"`);
    }
 
    console.log("Seeding complete.");
  } catch (err) {
    console.error("Seeding failed:", err);
  } finally {
    await mongoose.disconnect();
  }
}
 
seed();
 
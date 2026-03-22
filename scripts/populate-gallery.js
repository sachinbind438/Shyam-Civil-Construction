const mongoose = require('mongoose')

// Gallery images to upload
const galleryImages = [
  "/assets/project-1.jpg",
  "/assets/project-2.jpg",
  "/assets/project-3.jpg",
  "/assets/project-4.jpg",
  "/assets/Serene Blue Sanctuary_ Modern and Stylish Bedroom.jpeg",
  "/assets/Luxurious Living Room.jpeg",
  "/assets/lotus-design-n-print-oCw5_evbWyI-unsplash.jpg",
  "/assets/lotus-design-n-print-Nl1cP1Tr2oU-unsplash.jpg",
  "/assets/lotus-design-n-print-KiUg-4xmTwo-unsplash.jpg",
  "/assets/lotus-design-n-print-g51F6-WYzyU-unsplash.jpg",
  "/assets/lotus-design-n-print-8qNuR1lIv_k-unsplash.jpg",
  "/assets/point3d-commercial-imaging-ltd-2X9H1lD_k2Q-unsplash.jpg",
  "/assets/odiseo-castrejon-CX8ooha2yLA-unsplash.jpg",
  "/assets/kenny-eliason-iAftdIcgpFc-unsplash.jpg",
  "/assets/kara-eads-L7EwHkq1B2s-unsplash.jpg",
  "/assets/jason-briscoe-GliaHAJ3_5A-unsplash.jpg",
  "/assets/im3rd-media-CbZ4EDP__VQ-unsplash.jpg",
  "/assets/hemant-kanojiya-LSKfjiXsbUU-unsplash.jpg",
  "/assets/francesca-tosolini-tHkJAMcO3QE-unsplash.jpg",
  "/assets/Elegant Living Room Interior.jpeg",
  "/assets/collov-home-design - aDGbdTsBZg-unsplash.jpg",
  "/assets/bailey-alexander-WCBeEhZb4H0-unsplash.jpg",
  "/assets/bailey-alexander-PE4pFgcYzoQ-unsplash.jpg",
  "/assets/sven-brandsma-7nBjGZVOfMw-unsplash.jpg",
  "/assets/sven-brandsma-3hEGHI4b4gg-unsplash.jpg",
  "/assets/spacejoy-9M66C_w_ToM-unsplash.jpg",
  "/assets/point3d-commercial-imaging-ltd-2X9H1lD_k2Q-unsplash.jpg",
  "/assets/odiseo-castrejon-CX8ooha2yLA-unsplash.jpg",
  "/assets/IMG_20240328_180111.jpg",
  "/assets/IMG_20250522-WA0028.jpg",
  "/assets/IMG_20250522-WA0018.jpg",
]

// Gallery Image Schema
const GalleryImageSchema = new mongoose.Schema({
  url: { type: String, required: true },
  key: { type: String, default: "" },
}, { timestamps: true })

const GalleryImage = mongoose.models.GalleryImage || mongoose.model("GalleryImage", GalleryImageSchema)

// Function to populate gallery
async function populateGallery() {
  try {
    // Connect to MongoDB
    const MONGODB_URI = "mongodb+srv://bindsachin438:S%40chinbind438@projects.3sctlpu.mongodb.net/shyamcivilconstruction?retryWrites=true&w=majority&appName=projects"
    await mongoose.connect(MONGODB_URI)
    console.log("📊 Connected to database")

    // Clear existing gallery images
    await GalleryImage.deleteMany({})
    console.log("🗑️ Cleared existing gallery images")

    // Add new gallery images
    const galleryData = galleryImages.map((url, index) => ({
      url: url.replace(/[\n\r\t]/g, "").trim(),
      key: `gallery-image-${index}`,
      order: index
    }))

    const result = await GalleryImage.insertMany(galleryData)
    console.log(`✅ Successfully added ${result.length} images to gallery`)
    console.log("📝 Gallery populated with:", result.map(img => img.url))

    process.exit(0)
  } catch (error) {
    console.error("❌ Error populating gallery:", error)
    process.exit(1)
  }
}

// Run the function
populateGallery()

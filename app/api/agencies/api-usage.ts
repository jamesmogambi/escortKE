// Agency CRUD and Image Upload API Usage Examples

// Create an agency
// const newAgency = await fetch("/api/agencies", {
//   method: "POST",
//   headers: { "Content-Type": "application/json" },
//   body: JSON.stringify({
//     name: "Elite Escorts Agency",
//     description: "Premium escort agency in Nairobi",
//     contactEmail: "info@eliteescorts.com",
//     contactPhone: "+254712345678",
//     ownerId: "escort_owner_id",
//     county: "Nairobi",
//     region: "Westlands",
//     town: "Westlands",
//     businessType: "agency",
//     categories: ["VIP", "Premium"],
//   }),
// });

// // Get all agencies
// const agencies = await fetch("/api/agencies?county=Nairobi&page=1&limit=20");

// // Get agency by ID
// const agency = await fetch("/api/agencies/elite-escorts-agency");

// // Update agency
// const updated = await fetch("/api/agencies/elite-escorts-agency", {
//   method: "PUT",
//   headers: { "Content-Type": "application/json" },
//   body: JSON.stringify({
//     description: "Updated description",
//     isFeatured: true,
//   }),
// });

// // Delete agency (soft delete)
// await fetch("/api/agencies/elite-escorts-agency", {
//   method: "DELETE",
// });

// // Hard delete agency
// await fetch("/api/agencies/elite-escorts-agency?hardDelete=true", {
//   method: "DELETE",
// });

// =======Logo, image and Cover Image APIS Usage ========

// # Upload logo
// curl -X POST http://localhost:3000/api/agencies/agency-id/upload-logo \
//   -F "logo=@/path/to/logo.jpg"

// # Upload cover image
// curl -X POST http://localhost:3000/api/agencies/agency-id/upload-cover \
//   -F "cover=@/path/to/cover.jpg"

// # Upload gallery images
// curl -X POST http://localhost:3000/api/agencies/agency-id/upload-gallery \
//   -F "gallery=@/path/to/image1.jpg" \
//   -F "gallery=@/path/to/image2.jpg"

// # Delete logo
// curl -X DELETE http://localhost:3000/api/agencies/agency-id/upload-logo

// # Delete cover image
// curl -X DELETE http://localhost:3000/api/agencies/agency-id/upload-cover

// # Delete specific gallery image
// curl -X DELETE http://localhost:3000/api/agencies/agency-id/gallery/0

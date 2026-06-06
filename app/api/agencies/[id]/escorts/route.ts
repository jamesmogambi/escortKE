// app/api/agencies/[id]/escorts/route.ts
import {NextRequest, NextResponse} from "next/server";
import {EscortModel} from "@/lib/models/escort.model";
import {db, storage} from "@/lib/firebase";
import {collection, doc, getDoc, getDocs, orderBy, query, where,} from "firebase/firestore";
import {getDownloadURL, ref, uploadBytes} from "firebase/storage";

export async function POST(
    request: NextRequest,
    {params}: { params: { id: string } },
) {
    try {
        const {id: agencyId} = await params;

        // Verify agency exists
        const agencyRef = doc(db, "agencies", agencyId);
        const agencyDoc = await getDoc(agencyRef);

        if (!agencyDoc.exists()) {
            return NextResponse.json(
                {success: false, error: "Agency not found"},
                {status: 404},
            );
        }

        const contentType = request.headers.get("content-type") || "";
        console.log("Content-Type:", contentType); // Debug log

        let girlData: any = {};
        let uploadedProfileImage: string = "";
        let uploadedGallery: string[] = [];

        if (contentType.includes("multipart/form-data")) {
            const formData = await request.formData();

            // Debug: Log all form data keys
            console.log("FormData keys:", Array.from(formData.keys()));

            // Check what's being sent
            const dataField = formData.get("data");
            console.log("Data field exists:", !!dataField);

            // Extract girl data
            if (dataField && typeof dataField === "string") {
                girlData = JSON.parse(dataField);
                console.log("Parsed girlData:", girlData);
            } else {
                // Extract individual fields
                girlData = {
                    name: formData.get("name"),
                    email: formData.get("email"),
                    phone: formData.get("phone"),
                    age: formData.get("age")
                        ? parseInt(formData.get("age") as string)
                        : null,
                    nationality: formData.get("nationality"),
                    // ... other fields
                };
                console.log("Individual fields girlData:", girlData);
            }

            // Handle profile image
            const profileImage = formData.get("profileImage") as File;
            console.log("Profile image exists:", !!profileImage);
            console.log("Profile image size:", profileImage?.size);

            if (profileImage && profileImage.size > 0) {
                // Upload logic here...
                const timestamp = Date.now();
                const filename = `${agencyId}/${girlData.name?.replace(/\s/g, "_")}_profile_${timestamp}.${profileImage.name.split(".").pop()}`;
                const storageRef = ref(storage, `escorts/${filename}`);
                await uploadBytes(storageRef, profileImage);
                uploadedProfileImage = await getDownloadURL(storageRef);
                girlData.profileImage = uploadedProfileImage;
                console.log("Profile image uploaded:", uploadedProfileImage);
            }

            // Handle gallery images - CRITICAL PART
            const galleryImages = formData.getAll("gallery");
            console.log("Gallery images count:", galleryImages.length);
            console.log(
                "Gallery images types:",
                galleryImages.map((f) =>
                    f && typeof f === "object" && "name" in (f as any) ? `File: ${(f as any).name}` : typeof f,
                ),
            );

            if (galleryImages && galleryImages.length > 0) {
                for (const image of galleryImages) {
                    if (image && typeof image === "object" && (image as any).size > 0) {
                        console.log(
                            `Processing gallery image: ${image.name}, size: ${image.size}`,
                        );

                        const timestamp = Date.now();
                        const filename = `${agencyId}/${girlData.name?.replace(/\s/g, "_")}_gallery_${timestamp}_${image.name}`;
                        const storageRef = ref(storage, `escorts/${filename}`);
                        await uploadBytes(storageRef, image);
                        const downloadUrl = await getDownloadURL(storageRef);
                        uploadedGallery.push(downloadUrl);
                        console.log(`Gallery image uploaded: ${downloadUrl}`);
                    }
                }
                girlData.gallery = uploadedGallery;
                console.log(`Total gallery images uploaded: ${uploadedGallery.length}`);
            } else {
                console.log("No gallery images found in formData");
            }
        } else {
            // Handle JSON request
            girlData = await request.json();
            console.log("JSON request data:", girlData);
        }

        // Create the escort
        const escort = await EscortModel.create(girlData, agencyId);
        console.log(
            "Escort created with gallery:",
            escort.gallery?.length || 0,
            "images",
        );

        return NextResponse.json({
            success: true,
            data: escort,
            message: "Escort added to agency successfully",
        });
    } catch (error: any) {
        console.error("Error creating agency escort:", error);
        return NextResponse.json(
            {success: false, error: error.message},
            {status: 500},
        );
    }
}

// Get Agency Escorts (Simplified)
export async function GET(
    request: NextRequest,
    {params}: { params: { id: string } },
) {
    try {
        const {id: agencyId} = await params;

        // Check if agency exists
        const agencyRef = doc(db, "agencies", agencyId);
        const agencyDoc = await getDoc(agencyRef);

        if (!agencyDoc.exists()) {
            return NextResponse.json(
                {success: false, error: "Agency not found"},
                {status: 404},
            );
        }

        // Get all escorts belonging to this agency
        const escortsQuery = query(
            collection(db, "escorts"),
            where("agencyId", "==", agencyId),
            where("isAgencyOwned", "==", true),
            where("isActive", "==", true),
            orderBy("createdAt", "desc"),
        );

        const escortsSnapshot = await getDocs(escortsQuery);

        const escorts = escortsSnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
            joinedDate: doc.data().joinedDate?.toDate?.()?.toISOString() || null,
            createdAt: doc.data().createdAt?.toDate?.()?.toISOString() || null,
            updatedAt: doc.data().updatedAt?.toDate?.()?.toISOString() || null,
        }));

        return NextResponse.json({
            success: true,
            data: {
                agency: {
                    id: agencyDoc.id,
                    name: agencyDoc.data().name,
                },
                escorts,
                total: escorts.length,
            },
            message: `Retrieved ${escorts.length} escorts successfully`,
        });
    } catch (error: any) {
        console.error("Error fetching agency escorts:", error);
        return NextResponse.json(
            {success: false, error: error.message},
            {status: 500},
        );
    }
}

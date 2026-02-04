 // Save user data to the database
  const onSubmit = (values: z.infer<typeof formSchema>) => {
    console.log("hi there");
    const {
      // address,
      name,
      email,
      whatsappNumber,
      street,
      phone,
      monday,
      tuesday,
      wednesday,
      thursday,
      friday,
      saturday,
      sunday,
      myAge,
      myHeight,
      myBreasts,
      myWeight,
      // photo,
    } = values;
    // form.handleSubmit(onSubmit, (errors) => {
    //   console.error("Validation errors:", errors);
    // });

    // if (!isLoaded || !isSignedIn) {
    //   return;
    // }

    startTransition(async () => {
      setLoader(true);
      setError(null);
      try {
        // Update username in Clerk
        // console.log("form-values", {
        //   ...form.getValues(),
        //   town,
        //   region,
        //   selectedAvailabilty: availability,
        //   description,
        //   age,
        //   breast,
        //   character,
        //   hairColor,
        //   nationality,
        //   experience,
        //   tags,
        //   previewPhoto: selectedFiles,
        //   selectedPractices: selected,
        //   selectedMassage: massages,
        //   selectedBDSM: bdsm,
        //   selectedCategories: settingCategories,
        //   selectedLanguages: languages,
        //   selectedGallery: gallery,
        // });

        // 1 validate region
        if (!region) {
          setError("Please select your region");
          return;
        }

        // 2. validate region
        if (!town) {
          setError("Please select your area or town");
          return;
        }

        // validate your categories
        if (settingCategories.length === 0) {
          setError("Please select categories you want to appear");
          return;
        }

        // extract only images from gallery
        const allFiles = Array.from(useFileStore.getState().fileMap.values());
        // console.log("file-map values", allFiles);
        const imageFiles = allFiles.filter((file) =>
          file.type.startsWith("image/"),
        );
        console.log("front-end image files----", imageFiles);

        let imgGalleryUrls;
        let videoGalleryUrls;
        let previewPhotoUrl = "";

        // TODO: 1- UPLOAD IMAGES TO S3

        const formData = new FormData();
        imageFiles.forEach((file) => {
          formData.append("images", file); // must match `formData.getAll("images")` on server
        });
        // attach preview photo

        if (selectedFiles && selectedFiles.length > 0) {
          formData.append("images", selectedFiles[0]);
        }

        const res = await fetch("/api/s3/upload-escort-images", {
          method: "POST",
          body: formData,
        });

        if (res.status === 201) {
          const { imageUrls } = await res.json();
          // console.log("✅ Uploaded:", imageUrls);
          imgGalleryUrls = imageUrls;
          if (selectedFiles && selectedFiles.length > 0) {
            previewPhotoUrl = imageUrls?.at?.(-1);
          }
          // Optionally show placeholders or start polling for status
        } else {
          console.error("❌ Upload failed:", res.status);
        }

        // if (!res.ok) {
        //   console.error("Upload failed");
        //   return;
        // }

        // TODO: 2- UPLOAD videos to MUX

        const videoFiles = allFiles.filter((file) =>
          file.type.startsWith("video/"),
        );

        // console.log("all video files", videoFiles);

        const videoFormData = new FormData();

        videoFiles.forEach((file) => {
          videoFormData.append("videos", file); // must match `formData.getAll("images")` on server
        });

        const clerkId: any = user?.id;
        // console.log("clerk-id", clerkId);
        videoFormData.append("clerkUserID", clerkId);

        const videoRes = await fetch("/api/mux/upload-videos", {
          method: "POST",
          body: videoFormData,
        });

        if (videoRes.status === 201) {
          // const { uploads } = await res.json();
          console.log("✅ Upload initiated:");
          // for videos webhook will update the record
          // Optionally show placeholders or start polling for status
        } else {
          console.error("❌ Upload failed:", res.status);
        }

        // TODO: 3- Update clerk user role = 'escort'

        // TODO: 4-create and save profile in Escorts schmea = 'escort'
        const escortImages = imgGalleryUrls.filter(
          (item: any) => item !== previewPhotoUrl,
        );
        const escortData = {
          name,
          clerkUserid: clerkId,
          previewPhoto: imgGalleryUrls.at(-1),
          // age,
          telephone: phone,
          whatsappPhone: whatsappNumber,
          // exclude the last item if previewPhoto is their
          images: escortImages,
          // videos will be handled by mux webhook
          // videos
          about: description,
          availability,
          // ethnicity
          nationality,
          bustSize: breast,
          // Weight,
          // zodiacSign,
          // sexualOrientation,
          languages,
          // estate
          town,
          region,
          practices: selected,
          bdsm,
          massages,
          extraServices: tags,
          role: "escort",
          openingHours: {
            monday,
            tuesday,
            wednesday,
            thursday,
            friday,
            saturday,
            sunday,
          },
          ageCategory: age,
          character,
          hairColor,
          experience,
          age: myAge,
          breasts: myBreasts,
          weight: myWeight,
          height: myHeight,
          categories: settingCategories,
          // address,
          email,
        };

        await createNewEscort(escortData);
        // await createNewEscort({
        //   imageFiles: allFiles,
        //   videoFiles: [],
        //   previewPhoto: selectedFiles?.[0],
        // });
        //  if all is well proceed

        // alert("submit form");
        // Save user info in the database
        // TODO:// CLEAR OR RESET FORM  VALUES
        clear();
        (clearAll(),
          clearDescription(),
          clearLanguages(),
          clearFiles(),
          clearTags(),
          clearCategories());
        clearEscortGallery();
        toast.custom(() => (
          <SuccessToast message="Your profile was created successfully." />
        ));

        router.push("/administration");
        // Scroll user to the top after successful update

        // window.scrollTo({ top: 0, behavior: "smooth" });
      } catch (error: any) {
        console.error("Error saving profile", error);
        setError(error?.message || "Something went wrong");
      } finally {
        setLoader(false);
      }
    });
  };





  "use server";

import { auth } from "@clerk/nextjs/server";
import Escort from "@/models/Escort";
import { connectDB } from "@/lib/db";
import type { EscortDoc } from "@/types/escort";

export async function saveEscortProfile(data: Partial<EscortDoc>) {
  try {
    // 🔐 Authenticate user
    const { userId } = auth();

    if (!userId) {
      throw new Error("Unauthorized");
    }

    // 🔌 Connect to DB
    await connectDB();

    // 🚫 Check if escort already exists
    const existingEscort = await Escort.findOne({ clerkUserId: userId });

    if (existingEscort) {
      throw new Error("Escort profile already exists");
    }

    // 🧠 Generate slug
    const slug =
      `${data.name || "escort"}`
        .toLowerCase()
        .trim()
        .replace(/\s+/g, "-") +
      "-" +
      Math.random().toString(36).slice(2, 8);

    // 📝 Save escort
    const escort = await Escort.create({
      ...data,
      clerkUserId: userId, // ✅ authoritative source
      slug,
      role: "escort",
      isActive: true,
      isVerified: false,
    });

    return escort;
  } catch (error: any) {
    console.error("❌ saveEscortProfile error:", error);

    // Normalize error message
    throw new Error(
      error?.message || "Failed to create escort profile"
    );
  }
}

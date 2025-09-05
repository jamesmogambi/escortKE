"use server";

import { connectToDB } from "@/lib/mongoose";
import axios from "axios";

interface CreateNewEscortParam {
  imageFiles: any;
  videoFiles?: any;
  previewPhoto?: any;
}

const baseURL = `${process.env.NEXT_PUBLIC_SITE_URL}`;

export async function createNewEscort({
  imageFiles,
  videoFiles,

  previewPhoto,
}: CreateNewEscortParam) {
  await connectToDB();

  try {
    console.log("Uploading to:", `${baseURL}/api/s3/upload-escort-images`);
    //    1. upload images to s3
    const formData = new FormData();

    imageFiles.forEach((file: any, index: any) => {
      formData.append(`images`, file); // or just "images" if backend accepts array
    });

    formData.append(`images`, previewPhoto);

    console.log("image-files", formData);

    // imageFiles.forEach((file: any, i: any) => {
    //   console.log(`Image ${i}:`, {
    //     name: file.name,
    //     type: file.type,
    //     size: file.size,
    //     lastModified: file.lastModified,
    //   });
    // });

    // const s3Res = await axios.post(
    //   `${baseURL}/api/s3/upload-escort-images`, // ✅ fixed
    //   formData,
    //   {
    //     headers: {
    //       "Content-Type": "multipart/form-data",
    //     },
    //   }
    // );

    // const s3Res = await axios.post(
    //   `${baseURL}/api/s3/upload-escort-images`,
    //   formData,
    //   {
    //     headers: {
    //       "Content-Type": "multipart/form-data",
    //     },
    //   }
    // );

    // console.log("imgUrls", s3Res);
    return true;

    // 2. upload videos to mux

    // return newUser;
  } catch (err: any) {
    throw new Error(`Failed to create user: ${err.message}`);
  }
}

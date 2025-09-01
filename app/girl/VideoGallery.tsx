"use client";
import React, { act } from "react";
import MuxPlayer from "@mux/mux-player-react";
import Image from "next/image";

interface Prop {
  className?: string;
  videos: any;
}
const VideoGallery = ({ videos, className }: Prop) => {
  const [activeVideo, setActiveVideo] = React.useState(videos[0]?.path || "");
  return (
    <div className="flex h-[800px] flex-1 border-yellow-400  flex-col gap-4">
      {/* // section 1 */}
      <div className="h-[70%] w-full border-pink-400">
        {videos.length > 0 ? (
          <MuxPlayer
            className="w-full h-full"
            playbackId={""}
            src={activeVideo}
            preload="auto"
            metadata={{
              video_id: videos[0].videoId,
              video_title: "video title",
            }}
          />
        ) : (
          <div className="flex items-center justify-center h-full">
            <p className="text-2xl text-gray-500">No videos available</p>
          </div>
        )}
      </div>

      {/* section 2 */}

      <div className="flex-1 w-full  border-blue-400 flex gap-2 ">
        {videos.map((video: any, index: any) => (
          <div
            className="relative w-1/4 cursor-pointer overflow-hidden rounded-lg   h-3/4"
            key={index}
            onClick={() => setActiveVideo(video.path)}
          >
            <Image
              key={index}
              src={"/escort5.jpg"}
              alt={`Video thumbnail ${index + 1}`}
              //   width={200}
              //   height={150}
              priority
              fill
              quality={90}
              className="object-cover  absolute cursor-pointer"
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default VideoGallery;

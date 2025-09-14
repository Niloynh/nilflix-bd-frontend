"use client";

import { useState } from "react";
import VideoTabs from "@/components/VideoTabs";
import VideoFeed from "@/components/VideoFeed";

export default function VideoSection() {
  const [activeTab, setActiveTab] = useState("YouTube");

  return (
    <section >
      <div className="sticky top-0 z-10 bg-black pt-4 px-4 -mx-4">
        <VideoTabs activeTab={activeTab} setActiveTab={setActiveTab} />
      </div>
      {/* ------------------------------------- */}
      <div className="mt-6"> {/* একটি গ্যাপ দেওয়ার জন্য */}
        <VideoFeed source={activeTab} />
      </div>
    </section>
  );
}
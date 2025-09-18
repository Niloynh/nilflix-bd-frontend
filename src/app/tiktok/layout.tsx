import React from 'react';

export default function TikTokLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    // This layout is just a shell to ensure a full-screen experience
    <div className="h-screen w-screen bg-black">
      {children}
    </div>
  );
}
import React from 'react';

// Shorts page-er jonno ekta bisesh layout
export default function ShortsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    // Ei layout-ti shudhu ekta kalo, full-screen canvas toiri korbe
    <div className="h-screen w-screen bg-black">
      {children}
    </div>
  );
}
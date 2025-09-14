"use client"; // This marks it as a Client Component

type VideoTabsProps = {
  activeTab: string;
  setActiveTab: (tab: string) => void;
};

export default function VideoTabs({ activeTab, setActiveTab }: VideoTabsProps) {
  const tabs = ["YouTube", "TikTok"];

  return (
    <div className="flex items-center gap-4 border-b border-gray-700 mb-6">
      {tabs.map((tab) => (
        <button
          key={tab}
          onClick={() => setActiveTab(tab)}
          className={`py-2 px-4 text-lg font-semibold transition-colors duration-300 ${
            activeTab === tab
              ? 'text-white border-b-2 border-red-500'
              : 'text-gray-400'
          }`}
        >
          {tab}
        </button>
      ))}
    </div>
  );
}
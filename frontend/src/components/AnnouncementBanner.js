import React, { useState, useEffect } from "react";
import { X, Megaphone } from "lucide-react";
import { announcementsAPI } from "../services/api";

export const AnnouncementBanner = () => {
  const [announcements, setAnnouncements] = useState([]);
  const [dismissed, setDismissed] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    fetchAnnouncements();
    // Load dismissed announcements from localStorage
    const dismissedIds = JSON.parse(
      localStorage.getItem("dismissedAnnouncements") || "[]"
    );
    setDismissed(dismissedIds);
  }, []);

  useEffect(() => {
    // Rotate announcements every 5 seconds
    if (announcements.length > 1) {
      const interval = setInterval(() => {
        setCurrentIndex((prev) => (prev + 1) % announcements.length);
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [announcements.length]);

  const fetchAnnouncements = async () => {
    try {
      const data = await announcementsAPI.getActive();
      setAnnouncements(data.announcements || []);
    } catch (error) {
      console.error("Error fetching announcements:", error);
    }
  };

  const handleDismiss = (announcementId) => {
    const newDismissed = [...dismissed, announcementId];
    setDismissed(newDismissed);
    localStorage.setItem(
      "dismissedAnnouncements",
      JSON.stringify(newDismissed)
    );
  };

  const visibleAnnouncements = announcements.filter(
    (a) => !dismissed.includes(a.announcement_id)
  );

  if (visibleAnnouncements.length === 0) return null;

  const currentAnnouncement =
    visibleAnnouncements[currentIndex % visibleAnnouncements.length];

  const getBgColor = (type) => {
    switch (type) {
      case "event":
        return "bg-gradient-to-r from-purple-600 to-pink-600";
      case "promotion":
        return "bg-gradient-to-r from-green-600 to-emerald-600";
      default:
        return "bg-gradient-to-r from-blue-600 to-cyan-600";
    }
  };

  return (
    <div
      className={`${getBgColor(
        currentAnnouncement.type
      )} text-white py-2 px-4 relative`}
    >
      <div className="container mx-auto px-4 flex items-center justify-between">
        <div className="flex items-center space-x-3 flex-1">
          <Megaphone className="w-5 h-5 flex-shrink-0" />
          <div className="flex-1">
            <span className="font-semibold">{currentAnnouncement.title}: </span>
            <span>{currentAnnouncement.message}</span>
            {currentAnnouncement.link && (
              <a
                href={currentAnnouncement.link}
                className="ml-2 underline hover:text-gray-200"
                target="_blank"
                rel="noopener noreferrer"
              >
                Learn More →
              </a>
            )}
          </div>
        </div>
        <button
          onClick={() => handleDismiss(currentAnnouncement.announcement_id)}
          className="ml-4 p-1 hover:bg-white/20 rounded transition-colors flex-shrink-0"
          aria-label="Dismiss"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
      {visibleAnnouncements.length > 1 && (
        <div className="absolute bottom-1 left-1/2 -translate-x-1/2 flex space-x-1">
          {visibleAnnouncements.map((_, idx) => (
            <div
              key={idx}
              className={`w-1.5 h-1.5 rounded-full transition-all ${
                idx === currentIndex ? "bg-white w-4" : "bg-white/50"
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
};

import React, { useState, useEffect } from 'react';
import { Calendar, X } from 'lucide-react';
import axios from 'axios';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

export const HolidayNotice = () => {
  const [notice, setNotice] = useState(null);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    fetchNotice();
    // Check if notice was dismissed in this session
    const dismissedId = sessionStorage.getItem('dismissedNotice');
    if (dismissedId) {
      setDismissed(true);
    }
  }, []);

  const fetchNotice = async () => {
    try {
      const response = await axios.get(`${BACKEND_URL}/api/notices`);
      const notices = response.data.notices || [];
      if (notices.length > 0) {
        setNotice(notices[0]); // Show the first active notice
      }
    } catch (error) {
      console.error('Error fetching holiday notice:', error);
    }
  };

  const handleDismiss = () => {
    setDismissed(true);
    if (notice) {
      sessionStorage.setItem('dismissedNotice', notice.notice_id);
    }
  };

  if (!notice || dismissed) return null;

  return (
    <div className="bg-amber-100 border-b-2 border-amber-300 text-amber-900 py-2 px-4">
      <div className="container mx-auto flex items-center justify-between">
        <div className="flex items-center space-x-3 flex-1">
          <Calendar className="w-5 h-5 flex-shrink-0" />
          <div className="flex-1">
            <span className="font-semibold">{notice.title}: </span>
            <span>{notice.message}</span>
          </div>
        </div>
        <button
          onClick={handleDismiss}
          className="ml-4 p-1 hover:bg-amber-200 rounded transition-colors flex-shrink-0"
          aria-label="Dismiss"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

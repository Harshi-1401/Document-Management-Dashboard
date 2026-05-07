// NotificationBell.jsx - Bell icon with unread count badge + dropdown list
import React, { useState, useEffect, useRef } from 'react';
import api from '../api/axios';

function NotificationBell({ newNotification }) {
  const [notifications, setNotifications] = useState([]);
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef();

  // Fetch notifications from backend on mount
  useEffect(() => {
    fetchNotifications();
  }, []);

  // When a new real-time notification arrives, add it to the list
  useEffect(() => {
    if (newNotification) {
      setNotifications((prev) => [newNotification, ...prev]);
    }
  }, [newNotification]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const fetchNotifications = async () => {
    try {
      const res = await api.get('/notifications');
      setNotifications(res.data);
    } catch (err) {
      console.error('Failed to fetch notifications:', err);
    }
  };

  // Mark a single notification as read
  const markAsRead = async (id) => {
    try {
      await api.patch(`/notifications/${id}/read`);
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, isRead: 1 } : n))
      );
    } catch (err) {
      console.error('Failed to mark as read:', err);
    }
  };

  // Mark all unread notifications as read
  const markAllAsRead = async () => {
    const unread = notifications.filter((n) => !n.isRead);
    for (const n of unread) {
      await markAsRead(n.id);
    }
  };

  // Count unread notifications for the badge
  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const formatDate = (dateStr) => new Date(dateStr).toLocaleString();

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Bell button */}
      <button
        onClick={() => setOpen((prev) => !prev)}
        className="relative p-2 rounded-full hover:bg-blue-500 transition-colors"
        aria-label="Notifications"
      >
        {/* Bell icon (SVG) */}
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none"
          viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
            d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6 6 0 10-12 0v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
        </svg>

        {/* Unread count badge */}
        {unreadCount > 0 && (
          <span className="absolute top-0 right-0 bg-red-500 text-white text-xs
            rounded-full h-5 w-5 flex items-center justify-center font-bold">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown panel */}
      {open && (
        <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-xl border
          border-gray-100 z-50 overflow-hidden">

          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
            <h3 className="font-semibold text-gray-700 text-sm">Notifications</h3>
            {unreadCount > 0 && (
              <button
                onClick={markAllAsRead}
                className="text-xs text-blue-600 hover:underline"
              >
                Mark all as read
              </button>
            )}
          </div>

          {/* Notification list */}
          <ul className="max-h-72 overflow-y-auto divide-y divide-gray-50">
            {notifications.length === 0 ? (
              <li className="px-4 py-6 text-center text-gray-400 text-sm">
                No notifications yet
              </li>
            ) : (
              notifications.map((n) => (
                <li
                  key={n.id}
                  onClick={() => !n.isRead && markAsRead(n.id)}
                  className={`px-4 py-3 cursor-pointer hover:bg-gray-50 transition-colors
                    ${!n.isRead ? 'bg-blue-50' : ''}`}
                >
                  <div className="flex items-start gap-2">
                    {/* Unread dot */}
                    <span className={`mt-1.5 h-2 w-2 rounded-full flex-shrink-0
                      ${!n.isRead ? 'bg-blue-500' : 'bg-transparent'}`} />
                    <div>
                      <p className={`text-sm ${!n.isRead ? 'text-gray-800 font-medium' : 'text-gray-500'}`}>
                        {n.message}
                      </p>
                      <p className="text-xs text-gray-400 mt-0.5">{formatDate(n.createdAt)}</p>
                    </div>
                  </div>
                </li>
              ))
            )}
          </ul>
        </div>
      )}
    </div>
  );
}

export default NotificationBell;

// dateUtils.js - Date utility functions

export const formatDate = (date) => {
    return new Date(date).toLocaleDateString();
};

export const formatDateTime = (date) => {
    return new Date(date).toLocaleString();
};

export const formatRelativeTime = (date) => {
    const now = new Date();
    const diff = now - new Date(date);
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (days === 0) return 'Today';
    if (days === 1) return 'Yesterday';
    if (days < 7) return `${days} days ago`;
    return formatDate(date);
};

export const isToday = (date) => {
    const today = new Date();
    const d = new Date(date);
    return d.toDateString() === today.toDateString();
};

export const getDaysInMonth = (year, month) => {
    return new Date(year, month + 1, 0).getDate();
};

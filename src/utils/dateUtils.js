export const getFormattedTime = (dateStr) => {
    const date = new Date(dateStr);
    const formattedDate = date.toLocaleDateString('en-GB', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
    });
    const formattedTime = date.toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: 'numeric',
        hour12: true
    });
    const finalFormattedString = `${formattedDate}, ${formattedTime}`;
    return finalFormattedString;
};

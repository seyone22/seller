function currencyFormatter(amount = 0, sign = '') {
    // Ensure amount is a number
    const numericAmount = Number(amount);
    // Format to 2 decimal places and add comma as thousand separator
    const formatted = numericAmount.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    // Return the formatted string with the sign
    return sign + formatted;
}

function dateFormatter(date) {
    // Ensure date is a valid Date object or timestamp
    const dateObject = new Date(date);
    if (isNaN(dateObject.getTime())) {
        // Return a default message if the date is invalid
        return 'Invalid date';
    }
    // Format date to a readable string
    return dateObject.toLocaleString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: true // To use 12-hour format with AM/PM
    });
}

export { currencyFormatter, dateFormatter };

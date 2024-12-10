import moment from 'moment-timezone';

export function relativeTimeUtil(lastLogin) {
    const lastLoginDate = moment(lastLogin);
    return lastLoginDate.fromNow();
}

export function dateFormat(date, includeTime = true, shortMonth = false) {
    let formatString = "DD/MM/YY";
    if (includeTime) {
        formatString += " hh:mm a"; // Adds the time in 24-hour format (HH:mm)
    }
    return moment(date).format(formatString);
}
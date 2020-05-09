export function GetTimeString(locale) {
    return new Date(Date.now()).toLocaleTimeString(locale);
}

export function GetMilliseconds() {
    return new Date(Date.now()).getMilliseconds();
}
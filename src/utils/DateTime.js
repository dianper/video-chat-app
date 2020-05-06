function GetTimeString(locale) {
    return new Date(Date.now()).toLocaleTimeString(locale);
}

export { GetTimeString };
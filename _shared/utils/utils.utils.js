function defaults(existing, fallback) {
    if (existing == null || existing == undefined) {
        return fallback;
    }

    return existing;
}

module.exports = {
    defaults
}
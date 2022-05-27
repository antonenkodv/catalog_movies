const regexExp = /^[0-9a-fA-F]{8}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{12}$/gi;


module.exports = {
    validateParams(arr, type) {
        if (type === 'string') return arr.every(item => (typeof item === 'string' || item instanceof String) && (item.trim().length > 0))
        if (type === 'uuid') return arr.every(item => regexExp.test(item))
        if (type === 'number') return arr.every(item => typeof item === 'number' && !isNaN(item))
    },

    errorHandler(message, statusCode) {
        const error = new Error(message)
        error.code = statusCode
        throw error;
    },
    consistYear(year) {
        if (year < 1850 || year > 2021) return false
        return true
    }
}
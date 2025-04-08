export const removeTextKey = (obj: any) => {
    if (typeof obj !== 'object' || obj === null) return obj;

    if (obj.hasOwnProperty('_text')) return obj._text;

    for (const key in obj) {
        obj[key] = removeTextKey(obj[key]);
    }

    return obj;
};
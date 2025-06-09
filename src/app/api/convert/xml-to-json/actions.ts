export function flattenXmlJson(obj: any): any {
    if (typeof obj !== 'object' || obj === null) return obj;
  
    if (obj._text !== undefined && obj._attributes === undefined) {
      return obj._text;
    }
  
    const newObj: any = {};
    if (obj._attributes) {
      Object.assign(newObj, obj._attributes);
    }
    if (obj._text) {
      newObj.text = obj._text; // or just: return obj._text;
    }
  
    for (const key in obj) {
      if (!['_text', '_attributes'].includes(key)) {
        newObj[key] = flattenXmlJson(obj[key]);
      }
    }
  
    return newObj;
  }
  
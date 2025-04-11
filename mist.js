window.mist = {};

mist.equalsObj = function(obj1, obj2) {
  if (obj1 === null && obj2 === null) return true;
  if (obj1 === null || obj2 === null) return false;
  
  if (typeof obj1 === "object" && typeof obj2 === "object") {
    if (obj1 === obj2) return true;
    
    if (Array.isArray(obj1) && Array.isArray(obj2)) {
      if (obj1.length !== obj2.length) return false;
      
      if (obj1.every(item => item === null || typeof item !== "object") &&
          obj2.every(item => item === null || typeof item !== "object")) {
        return obj1.length === obj2.length && 
               [...new Set(obj1)].sort().toString() === [...new Set(obj2)].sort().toString();
      }
      
      for (let i = 0; i < obj1.length; i++) {
        if (!mist.equalsObj(obj1[i], obj2[i])) return false;
      }
      return true;
    }
    
    let obj1Keys = Object.keys(obj1);
    let obj2Keys = Object.keys(obj2);
    if (obj1Keys.length !== obj2Keys.length) return false;
    
    for (let key of obj2Keys) {
      if (!obj1Keys.includes(key)) return false;
      if (!mist.equalsObj(obj1[key], obj2[key])) return false;
    }
    return true;
  } else {
    return obj1 === obj2;
  }
};

mist.cloneObj = function(obj) {
  if (obj === null || obj === undefined || typeof obj !== "object") return obj;
  
  if (Array.isArray(obj)) return obj.map(item => mist.cloneObj(item));
  if (obj instanceof Date) return new Date(obj);
  if (obj instanceof RegExp) return new RegExp(obj);
  if (obj instanceof Set) return new Set([...obj].map(item => mist.cloneObj(item)));
  if (obj instanceof Map) return new Map([...obj].map(([k, v]) => [mist.cloneObj(k), mist.cloneObj(v)]));
  
  const newObj = {};
  for (let key in obj) {
    if (obj.hasOwnProperty(key)) newObj[key] = mist.cloneObj(obj[key]);
  }
  return newObj;
};

mist.mergeObj = function(obj1, obj2) {
  if (obj1 === null || obj1 === undefined || typeof obj1 !== "object") return mist.cloneObj(obj2);
  if (obj2 === null || obj2 === undefined || typeof obj2 !== "object") return mist.cloneObj(obj1);
  
  const newObj = mist.cloneObj(obj1);
  
  for (let key in obj2) {
    if (obj2.hasOwnProperty(key)) {
      if (obj1[key] !== null && obj2[key] !== null && 
          typeof obj1[key] === "object" && typeof obj2[key] === "object" &&
          !Array.isArray(obj1[key]) && !Array.isArray(obj2[key])) {
        newObj[key] = mist.mergeObj(obj1[key], obj2[key]);
      } else {
        newObj[key] = mist.cloneObj(obj2[key]);
      }
    }
  }
  
  return newObj;
};

mist.stringify = function(obj) {
  if (obj === null || obj === undefined) return String(obj);
  
  if (typeof obj === "object") {
    try {
      return JSON.stringify(obj);
    } catch (e) {
      console.error("Stringify error:", e);
      return "[Object conversion error]";
    }
  }
  
  return String(obj);
};

mist.parse = function(obj) {
  if (obj === null || obj === undefined || typeof obj === "object") return obj;
  
  if (typeof obj === "string") {
    const trimmed = obj.trim();
    
    if ((trimmed[0] === "{" && trimmed[trimmed.length - 1] === "}") || 
        (trimmed[0] === "[" && trimmed[trimmed.length - 1] === "]")) {
      try {
        return JSON.parse(trimmed.replaceAll("\n", "\\n"));
      } catch (e) {
        console.error("Parse error:", e);
        return obj;
      }
    }
  }
  
  return obj;
};

mist.flipObj = function(obj) {
  if (!obj || typeof obj !== "object" || Array.isArray(obj)) return {};
  
  const newObj = {};
  try {
    for (let key in obj) {
      if (obj.hasOwnProperty(key)) newObj[String(obj[key])] = key;
    }
  } catch (e) {
    console.error("Error flipping object:", e);
  }
  
  return newObj;
};

mist.isPrimeNum = function(n) {
  if (typeof n !== "number" || isNaN(n) || !isFinite(n)) return false;
  
  n = Math.abs(n);
  
  if (n <= 1) return false;
  if (n <= 3) return true;
  if (n % 2 === 0 || n % 3 === 0) return false;
  
  const limit = Math.sqrt(n);
  for (let i = 5; i <= limit; i += 6) {
    if (n % i === 0 || n % (i + 2) === 0) return false;
  }
  
  return true;
};

mist.setCookie = function(name, data, days = 30) {
  if (!name || typeof name !== "string") {
    console.error("Cookie name must be a non-empty string");
    return false;
  }
  
  try {
    const date = new Date();
    date.setTime(date.getTime() + (24 * days * 60 * 60 * 1000));
    document.cookie = encodeURIComponent(name) + "=" + 
                      encodeURIComponent(data) + ";expires=" + 
                      date.toUTCString() + ";path=/;SameSite=Lax";
    return true;
  } catch (e) {
    console.error("Error setting cookie:", e);
    return false;
  }
};

mist.getCookie = function(name) {
  if (!name || typeof name !== "string") return "";
  
  try {
    const nameEQ = encodeURIComponent(name) + "=";
    const cookies = document.cookie.split(';');
    
    for (let i = 0; i < cookies.length; i++) {
      let cookie = cookies[i].trim();
      if (cookie.indexOf(nameEQ) === 0) {
        return decodeURIComponent(cookie.substring(nameEQ.length));
      }
    }
    
    return "";
  } catch (e) {
    console.error("Error getting cookie:", e);
    return "";
  }
};

mist.isEmpty = function(obj) {
  if (obj === null || obj === undefined) return true;
  if (typeof obj === "string") return obj.trim().length === 0;
  if (typeof obj !== "object") return false;
  if (Array.isArray(obj)) return obj.length === 0;
  if (obj instanceof Set || obj instanceof Map) return obj.size === 0;
  return Object.keys(obj).length === 0;
};

mist.size = function(obj) {
  if (obj === null || obj === undefined) return 0;
  if (typeof obj === "string" || Array.isArray(obj)) return obj.length;
  if (obj instanceof Set || obj instanceof Map) return obj.size;
  if (typeof obj === "object") return Object.keys(obj).length;
  return 0;
};

mist.getPath = function(obj, path, defaultValue) {
  if (!obj || !path) return defaultValue;
  
  try {
    const normalizedPath = path.replace(/\[(\w+)\]/g, '.$1');
    const keys = normalizedPath.split('.');
    
    let result = obj;
    for (const key of keys) {
      if (result === null || result === undefined || typeof result !== 'object') {
        return defaultValue;
      }
      result = result[key];
    }
    
    return result === undefined ? defaultValue : result;
  } catch (e) {
    return defaultValue;
  }
};

mist.setPath = function(obj, path, value) {
  if (!obj || typeof obj !== 'object' || !path) return obj;
  
  try {
    const result = mist.cloneObj(obj);
    const normalizedPath = path.replace(/\[(\w+)\]/g, '.$1');
    const keys = normalizedPath.split('.');
    
    let current = result;
    for (let i = 0; i < keys.length - 1; i++) {
      const key = keys[i];
      
      if (!current[key] || typeof current[key] !== 'object') {
        current[key] = /^\d+$/.test(keys[i + 1]) ? [] : {};
      }
      
      current = current[key];
    }
    
    current[keys[keys.length - 1]] = value;
    return result;
  } catch (e) {
    return obj;
  }
};

mist.diff = function(obj1, obj2) {
  if (obj1 === obj2) return {};
  if (obj1 === null || obj2 === null || typeof obj1 !== 'object' || typeof obj2 !== 'object') {
    return { old: obj1, new: obj2 };
  }
  
  const differences = {};
  
  for (const key in obj1) {
    if (!obj1.hasOwnProperty(key)) continue;
    
    if (!obj2.hasOwnProperty(key)) {
      differences[key] = { old: obj1[key], new: undefined };
    } else if (typeof obj1[key] === 'object' && typeof obj2[key] === 'object' &&
               obj1[key] !== null && obj2[key] !== null) {
      const nestedDiff = mist.diff(obj1[key], obj2[key]);
      if (!mist.isEmpty(nestedDiff)) differences[key] = nestedDiff;
    } else if (!mist.equalsObj(obj1[key], obj2[key])) {
      differences[key] = { old: obj1[key], new: obj2[key] };
    }
  }
  
  for (const key in obj2) {
    if (obj2.hasOwnProperty(key) && !obj1.hasOwnProperty(key)) {
      differences[key] = { old: undefined, new: obj2[key] };
    }
  }
  
  return differences;
};

mist.flatten = function(obj, prefix = '') {
  const result = {};
  
  if (obj === null || obj === undefined || typeof obj !== 'object') return result;
  
  for (const key in obj) {
    if (!obj.hasOwnProperty(key)) continue;
    
    const newKey = prefix ? `${prefix}.${key}` : key;
    
    if (typeof obj[key] === 'object' && obj[key] !== null && !Array.isArray(obj[key])) {
      Object.assign(result, mist.flatten(obj[key], newKey));
    } else {
      result[newKey] = obj[key];
    }
  }
  
  return result;
};

mist.unflatten = function(obj) {
  const result = {};
  
  for (const key in obj) {
    if (!obj.hasOwnProperty(key)) continue;
    
    const keys = key.split('.');
    let current = result;
    
    for (let i = 0; i < keys.length - 1; i++) {
      const k = keys[i];
      current[k] = current[k] || {};
      current = current[k];
    }
    
    current[keys[keys.length - 1]] = obj[key];
  }
  
  return result;
};

mist.pick = function(obj, keys) {
  if (!obj || typeof obj !== 'object') return {};
  
  const result = {};
  const keyArray = Array.isArray(keys) ? keys : [keys];
  
  for (const key of keyArray) {
    if (obj.hasOwnProperty(key)) result[key] = obj[key];
  }
  
  return result;
};

mist.omit = function(obj, keys) {
  if (!obj || typeof obj !== 'object') return {};
  
  const result = mist.cloneObj(obj);
  const keyArray = Array.isArray(keys) ? keys : [keys];
  
  for (const key of keyArray) delete result[key];
  
  return result;
};

mist.safeGet = function(obj, ...paths) {
  if (!obj) return undefined;
  
  for (const path of paths) {
    const value = mist.getPath(obj, path);
    if (value !== undefined) return value;
  }
  
  return undefined;
};

mist.arraysEqual = function(arr1, arr2) {
  if (!Array.isArray(arr1) || !Array.isArray(arr2)) return false;
  if (arr1 === arr2) return true;
  if (arr1.length !== arr2.length) return false;
  
  if (arr1.every(item => item === null || typeof item !== "object") &&
      arr2.every(item => item === null || typeof item !== "object")) {
    
    if (arr1.length === new Set(arr1).size && arr2.length === new Set(arr2).size) {
      return new Set(arr1).size === new Set(arr2).size &&
             [...new Set(arr1)].every(item => new Set(arr2).has(item));
    }
    
    return arr1.every((val, idx) => val === arr2[idx]);
  }
  
  return arr1.every((val, idx) => mist.equalsObj(val, arr2[idx]));
};

mist.deepFreeze = function(obj) {
  if (obj === null || obj === undefined || typeof obj !== 'object' || Object.isFrozen(obj)) return obj;
  
  Object.getOwnPropertyNames(obj).forEach(prop => {
    const val = obj[prop];
    if (val && typeof val === "object") mist.deepFreeze(val);
  });
  
  return Object.freeze(obj);
};

mist.toQueryString = function(obj) {
  if (!obj || typeof obj !== 'object') return '';
  
  return Object.entries(obj)
    .filter(([_, v]) => v !== undefined && v !== null)
    .map(([k, v]) => {
      if (Array.isArray(v)) {
        return v.map(item => `${encodeURIComponent(k)}=${encodeURIComponent(item)}`).join('&');
      }
      return `${encodeURIComponent(k)}=${encodeURIComponent(v)}`;
    })
    .join('&');
};

mist.parseQueryString = function(queryString) {
  const result = {};
  
  if (!queryString || typeof queryString !== 'string') return result;
  
  const query = queryString.startsWith('?') ? queryString.substring(1) : queryString;
  const pairs = query.split('&');
  
  for (const pair of pairs) {
    if (!pair) continue;
    
    const [key, value] = pair.split('=').map(decodeURIComponent);
    
    if (result[key]) {
      result[key] = Array.isArray(result[key]) ? [...result[key], value] : [result[key], value];
    } else {
      result[key] = value;
    }
  }
  
  return result;
};
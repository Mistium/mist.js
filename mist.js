window.mist = {}

mist.equalsObj = function (obj1, obj2) {
  if (typeof obj1 === "object" && typeof obj2 === "object") {
    if (obj1 === obj2) return true;

    let obj1Keys = Object.keys(obj1);
    let obj2Keys = Object.keys(obj2);
    if (obj1Keys.length !== obj2Keys.length) return false;

    for (let key of obj2Keys) {
      if (!obj1Keys.includes(key)) return false;
      const obj1Type = typeof obj1[key];
      const obj2Type = typeof obj2[key];
      if (obj1Type !== obj2Type) return false;
      if (obj1Type === "object" && obj2Type === "object") {
        if (!Object.isSame(obj1[key], obj2[key])) return false;
      } else if (obj1[key] !== obj2[key]) return false;
    }
    return true;
  } else {
    return false;
  }
}

mist.cloneObj = function (obj) {
  if (obj === null) {
    return null;
  }

  if (typeof obj === "object") {
    if (Array.isArray(obj)) {
      return obj.map(item => Object.clone(item));
    } else if (obj instanceof RegExp) {
      return new RegExp(obj);
    } else {
      let newObj = {};
      for (let key in obj) {
        if (obj.hasOwnProperty(key)) {
          newObj[key] = Object.clone(obj[key]);
        }
      }
      return newObj;
    }
  } else {
    return obj;
  }
};

mist.mergeObj = function (obj1, obj2) {
  if (typeof obj1 === "object" && typeof obj2 === "object") {
    let newObj = Object.clone(obj1);
    for (let key in obj2) {
      if (typeof obj2[key] === "object") {
        newObj[key] = Object.merge(obj1[key], obj2[key]);
      } else {
        newObj[key] = obj2[key];
      }
    }
    return newObj;
  } else {
    return obj2;
  }
};

mist.stringify = function (obj) {
  return typeof obj === "object" ? JSON.stringify(obj) : obj
}

mist.parse = function (obj) {
  const type = typeof obj
  if (type === "object") { return obj }
  if (type === "string") obj = obj.trim()
  if ((obj[0] === "{" && obj[obj.length - 1] === "}") || (obj[0] === "[" && obj[obj.length - 1] === "]")) {
    try {
      return JSON.parse(p0.replaceAll("\n","\\n"))
    } catch(e) {
      console.error(e)
    }
  }
}

mist.flipObj = function (obj) {
  let newObj = {};
  for (let key in obj) {
    newObj[obj[key]] = key;
  }
  return newObj;
}

mist.isPrimeNum = function (n) {
  if (n <= 1) return false;
  if (n == 2 || n == 3) return true;
  if (n % 2 == 0 || n % 3 == 0) return false;
  for (var i = 5; i <= Math.sqrt(n); i = i + 6) 
    if (n % i == 0 || n % (i + 2) == 0) return false;
  return true;
}

mist.setCookie = function(name,data,days) {
  const date=new Date;
  date.setTime(date.getTime() + 24 * days * 60 * 60 * 1e3);
  let n = "expires=" + date.toUTCString();
  document.cookie = name + "=" + data + ";" + n + ";path=/"
};

window.getCookie = function(name) {
  let t=name+"=";
  let n=decodeURIComponent(document.cookie).split(";");
  for(let i = 0; i < n.length; i++) {
    let o = n[i];
    for(;" " == o.charAt(0);) o = o.substring(1);
    if(0 == o.indexOf(t)) return o.substring(t.length,o.length)
  }
  return""
};

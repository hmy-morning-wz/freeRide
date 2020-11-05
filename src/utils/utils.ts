
/**
 * 解析utf8字符串到16进制
 */
export function parseUtf8StringToHex(input: string | number | boolean) {
  input = unescape(encodeURIComponent(input))

  const length = input.length

  // 转换到字数组
  const words: number[] = []
  for (let i = 0; i < length; i++) {
    words[i >>> 2] |= (input.charCodeAt(i) & 0xff) << (24 - (i % 4) * 8)
  }

  // 转换到16进制
  const hexChars = []
  for (let i = 0; i < length; i++) {
    const bite = (words[i >>> 2] >>> (24 - (i % 4) * 8)) & 0xff
    hexChars.push((bite >>> 4).toString(16))
    hexChars.push((bite & 0x0f).toString(16))
  }

  return hexChars.join('')
}

/**
 * 解析arrayBuffer到16进制字符串
 */
export function parseArrayBufferToHex(input: Iterable<number>) {
  return Array.prototype.map.call(new Uint8Array(input), x => ('00' + x.toString(16)).slice(-2)).join('')
}

/**
 * 补全16进制字符串
 */
function leftPad(input: string | any[], num: number) {
  if (input.length >= num) return input

  return (new Array(num - input.length + 1)).join('0') + input
}

/**
 * 转成16进制串
 */
export function arrayToHex(arr: string | any[]) {
  const words: number[] = []
  let j = 0
  for (let i = 0; i < arr.length * 2; i += 2) {
    words[i >>> 3] |= parseInt(arr[j], 10) << (24 - (i % 8) * 4)
    j++
  }

  // 转换到16进制
  const hexChars = []
  for (let i = 0; i < arr.length; i++) {
    const bite = (words[i >>> 2] >>> (24 - (i % 4) * 8)) & 0xff
    hexChars.push((bite >>> 4).toString(16))
    hexChars.push((bite & 0x0f).toString(16))
  }

  return hexChars.join('')
}

/**
 * 转成utf8串
 */
export function arrayToUtf8(arr: string | any[]) {
  const words: number[] = []
  let j = 0
  for (let i = 0; i < arr.length * 2; i += 2) {
    words[i >>> 3] |= parseInt(arr[j], 10) << (24 - (i % 8) * 4)
    j++
  }

  try {
    const latin1Chars = []

    for (let i = 0; i < arr.length; i++) {
      const bite = (words[i >>> 2] >>> (24 - (i % 4) * 8)) & 0xff
      latin1Chars.push(String.fromCharCode(bite))
    }

    return decodeURIComponent(escape(latin1Chars.join('')))
  } catch (e) {
    throw new Error('Malformed UTF-8 data')
  }
}

/**
 * 转成ascii码数组
 */
export function hexToArray(hexStr: any) {
  const words = []
  let hexStrLength = hexStr.length

  if (hexStrLength % 2 !== 0) {
    hexStr = leftPad(hexStr, hexStrLength + 1)
  }

  hexStrLength = hexStr.length

  for (let i = 0; i < hexStrLength; i += 2) {
    words.push(parseInt(hexStr.substr(i, 2), 16))
  }
  return words
}
export function arrayBufferConcat(a:any,b:any){
   if(!a) return b
   if(!b) return a
   a =  new Uint8Array(a)
   b =  new Uint8Array(b)
   let out = new Uint8Array(a.byteLength + b.byteLength)
   
   for(let i=0;i<a.byteLength ; i+=1) {
      out[i] =a[i]
   }
    for(let i=a.byteLength;i<out.byteLength ; i+=1) {
      out[i] = b[i-a.byteLength]
   }
   return out.buffer
}

export function arrayBufferToBase64(buffer: Iterable<number>) {
  let result = "";
  const uintArray = new Uint8Array(buffer);
  const byteLength = uintArray.byteLength;
  for (let i = 0; i < byteLength; i++) {
    result += String.fromCharCode(uintArray[i]);
  }
  return encode(result);
}

export function base64ToArrayBuffer(base64: any) {
  const string = decode(base64);
  const length = string.length;
  let uintArray = new Uint8Array(length);
  for (let i = 0; i < length; i++) {
    uintArray[i] = string.charCodeAt(i);
  }
  return uintArray.buffer;
}

function encode(str: string) {
  let encodings =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
  const string = String(str);
  let result = "";
  let currentIndex = 0;
  let sum:any;
  while (
    string.charAt(0 | currentIndex) ||
    ((encodings = "="), currentIndex % 1)
  ) {
    currentIndex += 0.75; // 每次移动3/4个位置
    let currentCode = string.charCodeAt(currentIndex); // 获取code point
    if (currentCode > 255) {
      // 大于255无法处理
      throw new Error('"btoa" failed');
    }
    sum = (sum << 8) | currentCode; // 每次在上次的基础上左移8位再加上当前code point
    const encodeIndex = 63 & (sum >> (8 - (currentIndex % 1) * 8)); // 去除多余的位数，再去最后6位
    result += encodings.charAt(encodeIndex);
  }

  return result;
}

function decode(str: any) {
  const encodings =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
  let res = "";
  const string = String(str).replace(/=+$/, "");
  if (string.length % 4 === 1) {
    throw new Error('"atob" failed');
  }
  let o:any,
    r,
    i = 0,
    currentIndex = 0;
  while ((r = string.charAt(currentIndex))) {
    currentIndex = currentIndex + 1;
    r = encodings.indexOf(r);
    if (~r) {
      o = i % 4 ? 64 * o + r : r;
      if (i++ % 4) {
        res += String.fromCharCode(255 & (o >> ((-2 * i) & 6)));
      }
    }
  }

  return res;
}


export function hashCode(str: string) {
  if (!str) return 0
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    let character = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + character;
    hash = hash & hash; // Convert to 32bit integer
  }
  return hash & 0x7fffffff;
}
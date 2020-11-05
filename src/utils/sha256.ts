const K:any[] = []


function bytesToHex(bytes:any[]){
  for (var hex = [], i = 0; i < bytes.length; i++) {
        hex.push((bytes[i] >>> 4).toString(16));
        hex.push((bytes[i] & 0xF).toString(16));
    }
    return hex.join("");
}


function hexToBytes(hex:string) {
    for (var bytes = [], c = 0; c < hex.length; c += 2)
    bytes.push(parseInt(hex.substr(c, 2), 16));
    return bytes;
}

function stringToHex(str:string) {
    return str.split("").map(function(c) {
        return ("0" + c.charCodeAt(0).toString(16)).slice(-2);
    }).join("");
}


function hexToString(hex:string) {   
    var str = '';
    for (var i = 0; i < hex.length; i += 2)
        str += String.fromCharCode(parseInt(hex.substr(i, 2), 16));
    return str;
}

function bytesToString(bytes:any[]) {
	return hexToString(bytesToHex(bytes));
}


function stringToBytes(str:string){
 return hexToBytes(stringToHex(str));
}



// Compute constants
function initK() {
  function isPrime(n:number) {
    var sqrtN = Math.sqrt(n);
    for (var factor = 2; factor <= sqrtN; factor++) {
      if (!(n % factor)) return false
    }

    return true
  }

  function getFractionalBits(n: number) {
    return ((n - (n | 0)) * 0x100000000) | 0
  }

  var n = 2
  var nPrime = 0
  while (nPrime < 64) {
    if (isPrime(n)) {
      K[nPrime] = getFractionalBits(Math.pow(n, 1 / 3))
      nPrime++
    }

    n++
  }
}
initK()


var bytesToWords = function (bytes:any[]) {
  var words:any[] = []
  for (var i = 0, b = 0; i < bytes.length; i++, b += 8) {
    words[b >>> 5] |= bytes[i] << (24 - b % 32)
  }
  return words
}

var wordsToBytes = function (words:any[]) {
  var bytes = []
  for (var b = 0; b < words.length * 32; b += 8) {
    bytes.push((words[b >>> 5] >>> (24 - b % 32)) & 0xFF)
  }
  return bytes
}

// Reusable object
var W:any[] = []

var processBlock = function (H: any[], M: any[], offset: number) {
  // Working variables
  var a = H[0], b = H[1], c = H[2], d = H[3]
  var e = H[4], f = H[5], g = H[6], h = H[7]

    // Computation
  for (var i = 0; i < 64; i++) {
    if (i < 16) {
      W[i] = M[offset + i] | 0
    } else {
      var gamma0x = W[i - 15]
      var gamma0  = ((gamma0x << 25) | (gamma0x >>> 7))  ^
                    ((gamma0x << 14) | (gamma0x >>> 18)) ^
                    (gamma0x >>> 3)

      var gamma1x = W[i - 2];
      var gamma1  = ((gamma1x << 15) | (gamma1x >>> 17)) ^
                    ((gamma1x << 13) | (gamma1x >>> 19)) ^
                    (gamma1x >>> 10)

      W[i] = gamma0 + W[i - 7] + gamma1 + W[i - 16];
    }

    var ch  = (e & f) ^ (~e & g);
    var maj = (a & b) ^ (a & c) ^ (b & c);

    var sigma0 = ((a << 30) | (a >>> 2)) ^ ((a << 19) | (a >>> 13)) ^ ((a << 10) | (a >>> 22));
    var sigma1 = ((e << 26) | (e >>> 6)) ^ ((e << 21) | (e >>> 11)) ^ ((e << 7)  | (e >>> 25));

    var t1 = h + sigma1 + ch + K[i] + W[i];
    var t2 = sigma0 + maj;

    h = g;
    g = f;
    f = e;
    e = (d + t1) | 0;
    d = c;
    c = b;
    b = a;
    a = (t1 + t2) | 0;
  }

  // Intermediate hash value
  H[0] = (H[0] + a) | 0;
  H[1] = (H[1] + b) | 0;
  H[2] = (H[2] + c) | 0;
  H[3] = (H[3] + d) | 0;
  H[4] = (H[4] + e) | 0;
  H[5] = (H[5] + f) | 0;
  H[6] = (H[6] + g) | 0;
  H[7] = (H[7] + h) | 0;
}

export function sha256(msg: string, options: { asBytes?: boolean; asString?: boolean; }={}) {;
  let message
  if (typeof msg === 'string') {
    message = stringToBytes(msg);
  }else {
    message = msg
  }

  var H =[ 0x6A09E667, 0xBB67AE85, 0x3C6EF372, 0xA54FF53A,
           0x510E527F, 0x9B05688C, 0x1F83D9AB, 0x5BE0CD19 ];

  var m = bytesToWords(message);
  var l = message.length * 8;

  m[l >> 5] |= 0x80 << (24 - l % 32);
  m[((l + 64 >> 9) << 4) + 15] = l;

  for (var i=0 ; i<m.length; i += 16) {
    processBlock(H, m, i);
  }

  var digestbytes = wordsToBytes(H);
  return options && options.asBytes ? digestbytes :
         options && options.asString ? bytesToString(digestbytes) :
         bytesToHex(digestbytes)
}


export function HMAC256(msg:string, k:string, options?:any) {
    let message:any
    // Convert to byte arrays
    if (typeof msg === 'string') {
      message = stringToBytes(msg);
    }else {
      message = msg||[]
    }
     let key:any
    if (typeof k === 'string') {
      key = stringToBytes(k);
    }else {
       key = k||[]
    }

    const _blocksize = 16;
    const _digestsize = 32;

    /* else, assume byte arrays already */
    // Allow arbitrary length keys

    if (key.length > _blocksize * 4) key = sha256(key, {
      asBytes: true
    }); // XOR keys with pad constants

    let okey = key.slice(0),
        ikey = key.slice(0);

    for (var i = 0; i < _blocksize * 4; i++) {
      okey[i] ^= 0x5C;
      ikey[i] ^= 0x36;
    }

    let hmacbytes:any = sha256(okey.concat(sha256(ikey.concat(message), {
      asBytes: true
    })), {
      asBytes: true
    });
    return options && options.asBytes ? hmacbytes : options && options.asString ? bytesToString(hmacbytes) : bytesToHex(hmacbytes);
  }
/* 
function test(){
  let msg = ""+Math.random()*100
  let out = ""
  for(let i=0;i<100;i++)
    {
     out =  HMAC256(msg,"123456781")
     console.log("HMAC256",msg,out)
     msg = out
    }

}
 test()
*/
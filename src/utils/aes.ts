// based on the aes implimentation in triple sec
// https://github.com/keybase/triplesec
// which is in turn based on the one from crypto-js
// https://code.google.com/p/crypto-js/
//@ts-ignore
import {Buffer} from  'buffer'
import * as _ from "./utils"

const BLOCK = 16



function asUInt32Array (buf: any ) {
  if (!Buffer.isBuffer(buf)) buf = Buffer.from(buf)

  let len = (buf.length / 4) | 0
  let out = new Array(len)

  for (let i = 0; i < len; i++) {
    out[i] = buf.readUInt32BE(i * 4)
  }

  return out
}

function scrubVec (v: any[]) {
  for (let i = 0; i < v.length; i++) {
    v[i] = 0
  }
}

function cryptBlock (M: number[], keySchedule: number[], SUB_MIX: any[], SBOX: number[], nRounds: number) {
  let SUB_MIX0 = SUB_MIX[0]
  let SUB_MIX1 = SUB_MIX[1]
  let SUB_MIX2 = SUB_MIX[2]
  let SUB_MIX3 = SUB_MIX[3]

  let s0 = M[0] ^ keySchedule[0]
  let s1 = M[1] ^ keySchedule[1]
  let s2 = M[2] ^ keySchedule[2]
  let s3 = M[3] ^ keySchedule[3]
  let t0, t1, t2, t3
  let ksRow = 4

  for (let round = 1; round < nRounds; round++) {
    t0 = SUB_MIX0[s0 >>> 24] ^ SUB_MIX1[(s1 >>> 16) & 0xff] ^ SUB_MIX2[(s2 >>> 8) & 0xff] ^ SUB_MIX3[s3 & 0xff] ^ keySchedule[ksRow++]
    t1 = SUB_MIX0[s1 >>> 24] ^ SUB_MIX1[(s2 >>> 16) & 0xff] ^ SUB_MIX2[(s3 >>> 8) & 0xff] ^ SUB_MIX3[s0 & 0xff] ^ keySchedule[ksRow++]
    t2 = SUB_MIX0[s2 >>> 24] ^ SUB_MIX1[(s3 >>> 16) & 0xff] ^ SUB_MIX2[(s0 >>> 8) & 0xff] ^ SUB_MIX3[s1 & 0xff] ^ keySchedule[ksRow++]
    t3 = SUB_MIX0[s3 >>> 24] ^ SUB_MIX1[(s0 >>> 16) & 0xff] ^ SUB_MIX2[(s1 >>> 8) & 0xff] ^ SUB_MIX3[s2 & 0xff] ^ keySchedule[ksRow++]
    s0 = t0
    s1 = t1
    s2 = t2
    s3 = t3
  }

  t0 = ((SBOX[s0 >>> 24] << 24) | (SBOX[(s1 >>> 16) & 0xff] << 16) | (SBOX[(s2 >>> 8) & 0xff] << 8) | SBOX[s3 & 0xff]) ^ keySchedule[ksRow++]
  t1 = ((SBOX[s1 >>> 24] << 24) | (SBOX[(s2 >>> 16) & 0xff] << 16) | (SBOX[(s3 >>> 8) & 0xff] << 8) | SBOX[s0 & 0xff]) ^ keySchedule[ksRow++]
  t2 = ((SBOX[s2 >>> 24] << 24) | (SBOX[(s3 >>> 16) & 0xff] << 16) | (SBOX[(s0 >>> 8) & 0xff] << 8) | SBOX[s1 & 0xff]) ^ keySchedule[ksRow++]
  t3 = ((SBOX[s3 >>> 24] << 24) | (SBOX[(s0 >>> 16) & 0xff] << 16) | (SBOX[(s1 >>> 8) & 0xff] << 8) | SBOX[s2 & 0xff]) ^ keySchedule[ksRow++]
  t0 = t0 >>> 0
  t1 = t1 >>> 0
  t2 = t2 >>> 0
  t3 = t3 >>> 0

  return [t0, t1, t2, t3]
}

// AES constants
let RCON = [0x00, 0x01, 0x02, 0x04, 0x08, 0x10, 0x20, 0x40, 0x80, 0x1b, 0x36]
let G = (function () {
  // Compute double table
  let d = new Array(256)
  for (let j = 0; j < 256; j++) {
    if (j < 128) {
      d[j] = j << 1
    } else {
      d[j] = (j << 1) ^ 0x11b
    }
  }

  let SBOX = []
  let INV_SBOX = []
  let SUB_MIX:any = [[], [], [], []]
  let INV_SUB_MIX:any = [[], [], [], []]

  // Walk GF(2^8)
  let x = 0
  let xi = 0
  for (let i = 0; i < 256; ++i) {
    // Compute sbox
    let sx = xi ^ (xi << 1) ^ (xi << 2) ^ (xi << 3) ^ (xi << 4)
    sx = (sx >>> 8) ^ (sx & 0xff) ^ 0x63
    SBOX[x] = sx
    INV_SBOX[sx] = x

    // Compute multiplication
    let x2 = d[x]
    let x4 = d[x2]
    let x8 = d[x4]

    // Compute sub bytes, mix columns tables
    let t = (d[sx] * 0x101) ^ (sx * 0x1010100)
    SUB_MIX[0][x] = (t << 24) | (t >>> 8)
    SUB_MIX[1][x] = (t << 16) | (t >>> 16)
    SUB_MIX[2][x] = (t << 8) | (t >>> 24)
    SUB_MIX[3][x] = t

    // Compute inv sub bytes, inv mix columns tables
    t = (x8 * 0x1010101) ^ (x4 * 0x10001) ^ (x2 * 0x101) ^ (x * 0x1010100)
    INV_SUB_MIX[0][sx] = (t << 24) | (t >>> 8)
    INV_SUB_MIX[1][sx] = (t << 16) | (t >>> 16)
    INV_SUB_MIX[2][sx] = (t << 8) | (t >>> 24)
    INV_SUB_MIX[3][sx] = t

    if (x === 0) {
      x = xi = 1
    } else {
      x = x2 ^ d[d[d[x8 ^ x2]]]
      xi ^= d[d[xi]]
    }
  }

  return {
    SBOX: SBOX,
    INV_SBOX: INV_SBOX,
    SUB_MIX: SUB_MIX,
    INV_SUB_MIX: INV_SUB_MIX
  }
})()
const  blockSize = 4 * 4
const   keySize = 256 / 8
class AES{
  _key:any
  blockSize =blockSize
  keySize = keySize
  _nRounds: any
  _keySchedule: any
  _invKeySchedule: any
  constructor(key: any){
  this._key = asUInt32Array(key)
  this._reset()
  }

_reset() {
  let keyWords = this._key
  let keySize = keyWords.length
  let nRounds = keySize + 6
  let ksRows = (nRounds + 1) * 4

  let keySchedule = []
  for (let k = 0; k < keySize; k++) {
    keySchedule[k] = keyWords[k]
  }

  for (let k = keySize; k < ksRows; k++) {
    let t:any = keySchedule[k - 1]

    if (k % keySize === 0) {
      t = (t << 8) | (t >>> 24)
      t =
        (G.SBOX[t >>> 24] << 24) |
        (G.SBOX[(t >>> 16) & 0xff] << 16) |
        (G.SBOX[(t >>> 8) & 0xff] << 8) |
        (G.SBOX[t & 0xff])

      t ^= RCON[(k / keySize) | 0] << 24
    } else if (keySize > 6 && k % keySize === 4) {
      t =
        (G.SBOX[t >>> 24] << 24) |
        (G.SBOX[(t >>> 16) & 0xff] << 16) |
        (G.SBOX[(t >>> 8) & 0xff] << 8) |
        (G.SBOX[t & 0xff])
    }

    keySchedule[k] = keySchedule[k - keySize] ^ t
  }

  let invKeySchedule = []
  for (let ik = 0; ik < ksRows; ik++) {
    let ksR = ksRows - ik
    let tt = keySchedule[ksR - (ik % 4 ? 0 : 4)]

    if (ik < 4 || ksR <= 4) {
      invKeySchedule[ik] = tt
    } else {
      invKeySchedule[ik] =
        G.INV_SUB_MIX[0][G.SBOX[tt >>> 24]] ^
        G.INV_SUB_MIX[1][G.SBOX[(tt >>> 16) & 0xff]] ^
        G.INV_SUB_MIX[2][G.SBOX[(tt >>> 8) & 0xff]] ^
        G.INV_SUB_MIX[3][G.SBOX[tt & 0xff]]
    }
  }

  this._nRounds = nRounds
  this._keySchedule = keySchedule
  this._invKeySchedule = invKeySchedule
}

encryptBlockRaw(M: any) {
  M = asUInt32Array(M)
  return cryptBlock(M, this._keySchedule, G.SUB_MIX, G.SBOX, this._nRounds)
}

encryptBlock(M: any) {
  let out = this.encryptBlockRaw(M)
  let buf = Buffer.allocUnsafe(16)
  buf.writeUInt32BE(out[0], 0)
  buf.writeUInt32BE(out[1], 4)
  buf.writeUInt32BE(out[2], 8)
  buf.writeUInt32BE(out[3], 12)
  return buf
}

decryptBlock(M: any) {
  M = asUInt32Array(M)

  // swap
  let m1 = M[1]
  M[1] = M[3]
  M[3] = m1

  let out = cryptBlock(M, this._invKeySchedule, G.INV_SUB_MIX, G.INV_SBOX, this._nRounds)
  let buf = Buffer.allocUnsafe(16)
  buf.writeUInt32BE(out[0], 0)
  buf.writeUInt32BE(out[3], 4)
  buf.writeUInt32BE(out[2], 8)
  buf.writeUInt32BE(out[1], 12)
  return buf
}

scrub() {
  scrubVec(this._keySchedule)
  scrubVec(this._invKeySchedule)
  scrubVec(this._key)
}
}

export default {// ECB pkcs7padding
    encrypt(msg: any, key:any,options:any = {}) {
        options = Object.assign({ keyIsHex: true, msgIsHex: true }, options);
        let inArray = [];
        if (typeof msg === 'string') {
            if (options && options.msgIsHex) {
                inArray =Buffer.from(msg,'hex')  //_.hexToArray(msg);
            }
            else {
                inArray =Buffer.from(msg) //_.hexToArray(_.parseUtf8StringToHex(msg));
            }
        }
        else {
            inArray = msg;
        }
        if (inArray.length % BLOCK != 0) {
            let len = BLOCK - inArray.length % BLOCK;
            let pading = new Buffer(len);
            pading.fill(len)
            inArray = Buffer.concat([inArray,pading],inArray.length+len);
        }
        let inKey = [];
        if (typeof key === 'string') {
            if (options && options.keyIsHex) {
                inKey = Buffer.from(key,'hex')// _.hexToArray(key);
            }
            else {
                inKey = Buffer.from(key)//_.hexToArray(_.parseUtf8StringToHex(key));
            }
        }
        else {
            inKey = key;
        }
        let outArray =new Buffer([]);
        let aes = new AES(inKey)
        let point = 0
        let input:any //= new Array(16);
        let output;
        let inLen = inArray.length;
        while (inLen >= BLOCK) {
          input = inArray.slice(point, point + 16);
        output =  aes.encryptBlock(input);
        outArray =  Buffer.concat([outArray,output],outArray.length+BLOCK);
        //for (let i = 0; i < BLOCK; i++) {
        //    outArray[point + i] =  output.readInt8(i);
        //}
        inLen -= BLOCK;
        point += BLOCK;
        }
        let out = outArray
        return options && options.asBytes ? outArray.buffer : options && options.asString ? out.toString('utf8') :  out.toString('hex');
    },
    decrypt(msg: any, key: any, options:any = {}) {
        options = Object.assign({ keyIsHex: true, msgIsHex: true }, options);
        let inArray = [];
        if (typeof msg === 'string') {
            if (options && options.msgIsHex) {
                inArray =Buffer.from(msg,'hex')// _.hexToArray(msg);
            }
            else {
                inArray = Buffer.from(msg)//_.hexToArray(_.parseUtf8StringToHex(msg));
            }
        }
        else {
            inArray = msg;
        }
        let inKey = [];
        if (typeof key === 'string') {
            if (options && options.keyIsHex) {
                inKey = Buffer.from(key,'hex')//_.hexToArray(key);
            }
            else {
                inKey = Buffer.from(msg)// _.hexToArray(_.parseUtf8StringToHex(key));
            }
        }
        else {
            inKey = key;
        }
        let outArray = new Buffer([]);
        let aes = new AES(inKey)
        let point = 0
        let input:any //= new Array(16);
        let output;
        let inLen = inArray.length;
        while (inLen >= BLOCK) {
          input = inArray.slice(point, point + 16);
        output =  aes.decryptBlock(input);
         outArray =  Buffer.concat([outArray,output],outArray.length+BLOCK);
        //for (let i = 0; i < BLOCK; i++) {
        //    outArray[point + i] = output.readInt8(i);
        //}
        inLen -= BLOCK;
        point += BLOCK;
        }
        
        let index = outArray.length - 1;
        const end = outArray.readInt8(index);
        let len = 0;        
        while (index > 0 && len < end) {
            if ( outArray.readInt8(index) === end) {
                index -= 1;
                len += 1;
            }
            else {
                break;
            }
        }
        if (len === end) {
            outArray = outArray.slice(0, index + 1);
        }
        let out = outArray
        return options && options.asBytes ? out.buffer : options && options.asString ? out.toString('utf8') :  out.toString('hex');
    }
};



/**
 * msg length  
 *   let ret =  aes.encrypt("2088232317811628,2088232317811628,2088232317811628,2088232317811628,2088232317811628,2088232317811628,2088232317811628,2088232317811628,2088232317811628,2088232317811628,2088232317811628","41ded573014071341627e7251a4ac221",{ keyIsHex:true,msgIsHex:false})
     console.log("aes",ret.length,ret)
     let msg =  aes.decrypt(ret,"41ded573014071341627e7251a4ac221",{ keyIsHex:true,msgIsHex:true,asString:true})
     console.log("aes",msg.length,msg)
 */
const secp = require("ethereum-cryptography/secp256k1");
const { keccak256 } = require("ethereum-cryptography/keccak");
const { toHex } = require("ethereum-cryptography/utils");

const privateKey = secp.utils.randomPrivateKey();
console.log('private key: ', toHex(privateKey));

const publicKey = secp.getPublicKey(privateKey);

function getAddress(publicKey) {
    const removeBytePK = publicKey.slice(1, publicKey.length);
    const hash = keccak256(removeBytePK);
    return hash.slice(hash.length - 20);
}

const address = getAddress(publicKey);

console.log('Address: ', toHex(address));
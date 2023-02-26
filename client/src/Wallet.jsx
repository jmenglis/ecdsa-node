import server from "./server";
import { getPublicKey } from 'ethereum-cryptography/secp256k1'
import { keccak256 }  from "ethereum-cryptography/keccak";
import { toHex } from "ethereum-cryptography/utils";

function Wallet({ address, setAddress, balance, setBalance, privateKey, setPrivateKey }) {
  async function onChange(evt) {
    const privateKey = evt.target.value;
    setPrivateKey(privateKey)
    const publicKey = getPublicKey(privateKey);
    const removeBytePK = publicKey.slice(1, publicKey.length);
    const hash = keccak256(removeBytePK);
    const hashedAddress = hash.slice(hash.length - 20);
    const hexedAddress = toHex(hashedAddress);
    setAddress(hexedAddress);
    if (address) {
      const {
        data: { balance },
      } = await server.get(`balance/${address}`);
      setBalance(balance);
    } else {
      setBalance(0);
    }
  }

  return (
    <div className="container wallet">
      <h1>Your Wallet</h1>

      <label>
        Wallet Address
        <input placeholder="Type an address, for example: 0x1" value={privateKey} onChange={onChange}></input>
      </label>

      <div className="balance">Balance: {balance}</div>
    </div>
  );
}

export default Wallet;

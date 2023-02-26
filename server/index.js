const express = require("express");
const app = express();
const cors = require("cors");
const { keccak256 } = require("ethereum-cryptography/keccak");
const { utf8ToBytes } = require("ethereum-cryptography/utils");
const secp = require("ethereum-cryptography/secp256k1");
const { toHex } = require("ethereum-cryptography/utils");

const port = 3042;

app.use(cors());
app.use(express.json());

//40f3531fda90aa0129385c6726b14e9b267e2207782341f9b86f4cc08ccf9532
//a7db95b23ce14beff921448b0934f0321da1ed7e92f56fbdcf42159dceaf940e
//c564013a8091a6c4d97c11f89651a39f95bb57afe20cd565be6a1d27d78e2435

const balances = {
  "65630ab1e06d655b7c8ffbb8e72098bd36aaa6e7": 100,
  "c27fafebaf89bb864f3d77b8c17175bf41b80f39": 50,
  "6f5e7ff2665e824838ad9de9d1f0605ed03da8b2": 75,
};

app.get("/balance/:address", (req, res) => {
  const { address } = req.params;
  const balance = balances[address] || 0;
  res.send({ balance });
});

app.post("/send", (req, res) => {
  const { sender, recipient, message, signedMessage } = req.body;
  const [sig, bit] = signedMessage;
  const bytes = utf8ToBytes(message);
  const hash = keccak256(bytes);
  const recoveryKey = secp.recoverPublicKey(hash, Uint8Array.from(Object.values(sig)), bit);
  const removeBytePK = recoveryKey.slice(1, recoveryKey.length);
  const hashAdd = keccak256(removeBytePK);
  const unHexedAdd = hashAdd.slice(hash.length-20);
  const address = toHex(unHexedAdd);
  const { amount } = JSON.parse(message);

  setInitialBalance(sender);
  setInitialBalance(recipient);

  if (sender !== address) {
    res.status(400).send({ message: "Incorrect private key for address" });
  }

  if (balances[sender] < amount) {
    res.status(400).send({ message: "Not enough funds!" });
  } else {
    balances[sender] -= amount;
    balances[recipient] += amount;
    res.send({ balance: balances[sender] });
  }
});

app.listen(port, () => {
  console.log(`Listening on port ${port}!`);
});

function setInitialBalance(address) {
  if (!balances[address]) {
    balances[address] = 0;
  }
}

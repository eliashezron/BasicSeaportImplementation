const ethSigUtil = require("eth-sig-util")

const EIP712Domain = [
  { name: "name", type: "string" },
  { name: "version", type: "string" },
  { name: "chainId", type: "uint256" },
  { name: "verifyingContract", type: "address" },
]

const OrderComponents = [
  { name: "nonce", type: "uint256" },
  { name: "offerer", type: "address" },
  { name: "offerToken", type: "address" },
  { name: "offerAmount", type: "uint256" },
  { name: "considerationToken", type: "address" },
  { name: "considerationAmount", type: "uint256" },
  { name: "startTime", type: "uint256" },
  { name: "endTime", type: "uint256" },
]

function getMetaTxTypeData(chainId, verifyingContract) {
  return {
    types: {
      EIP712Domain,
      OrderComponents,
    },
    domain: {
      name: "VerifyingContract",
      version: "0.0.1",
      chainId,
      verifyingContract,
    },
    primaryType: "OrderComponents",
  }
}

async function signTypedData(signer, from, data) {
  // If signer is a private key, use it to sign
  if (typeof signer === "string") {
    const privateKey = Buffer.from(signer.replace(/^0x/, ""), "hex")
    return ethSigUtil.signTypedMessage(privateKey, { data })
  }

  // Otherwise, send the signTypedData RPC call
  // Note that hardhatvm and metamask require different EIP712 input
  const isHardhat = data.domain.chainId == 31337
  const [method, argData] = isHardhat
    ? ["eth_signTypedData", data]
    : ["eth_signTypedData_v4", JSON.stringify(data)]
  return await signer.send(method, [from, argData])
}
async function buildRequest(verifyingContract, input) {
  const nonce = await verifyingContract
    .getNonce(input.offerer)
    .then((nonce) => nonce.toString())
  return { nonce, ...input }
}
async function buildTypedData(verifyingContract, input) {
  const chainId = await verifyingContract.provider
    .getNetwork()
    .then((n) => n.chainId)
  const typeData = getMetaTxTypeData(chainId, verifyingContract.address)
  return { ...typeData, message: input }
}

async function signMetaTxRequest(signer, verifyingContract, input) {
  const request = await buildRequest(verifyingContract, input)
  const toSign = await buildTypedData(verifyingContract, request)
  const signature = await signTypedData(signer, input.offerer, toSign)
  return { signature, request }
}

module.exports = {
  signMetaTxRequest,
  buildTypedData,
}

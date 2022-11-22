const { ethers } = require("hardhat")
const { signMetaTxRequest } = require("../src/signer")
const { readFileSync, writeFileSync } = require("fs")
require("dotenv").config()

async function getInstance(name) {
  const address = JSON.parse(readFileSync("deployMarketplacePolygon.json"))[
    name
  ]
  if (!address) throw new Error(`Contract ${name} not found in deploy.json`)
  return ethers.getContractFactory(name).then((f) => f.attach(address))
}

async function main() {
  const erc20 = await getInstance("ERC20Token")
  const erc721 = await getInstance("ERC721Token")
  const contract = await getInstance("Marketplace")
  const vContract = await getInstance("VerifyingContract")

  const { PRIVATE_KEY: signer } = process.env
  const amount = ethers.utils.parseEther("10")
  const acc = new ethers.Wallet(signer).address
  const seaportContractAddress = "0x00000000006c3852cbEf3e08E8dF289169EdE581"
  const result = await signMetaTxRequest(signer, vContract, {
    offerer: acc,
    offerToken: erc721.address,
    offerAmount: 1,
    considerationToken: erc20.address,
    considerationAmount: amount,
    startTime: Math.floor(Date.now() / 1000).toString(),
    endTime: Math.floor(Date.now() / 1000) + (1000000).toString(),
  })
  writeFileSync(
    "tmp/requestCashoutPolygon.json",
    JSON.stringify(result, null, 2)
  )
  const signature = await result.signature

  // appoving the seaport contract to make approvals
  const tx = await erc721.connect(acc).approve(seaportContractAddress, 1)
  await tx(5)

  // make an offer

  const offer = await contract
    .connect(acc)
    .createOffer(erc20.address, amount, erc721.address, 1, signature)
  await offer(5)

  const offerLength = await contract.getOfferLength()
  console.log(offerLength)
}

if (require.main === module) {
  main()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error(error)
      process.exit(1)
    })
}

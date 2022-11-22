const { ethers } = require("hardhat")
const { writeFileSync } = require("fs")
require("dotenv").config()

async function main() {
  const ERC20 = await ethers.getContractFactory("ERC20Token")
  const erc20 = await ERC20.deploy()
  await erc20.deployed()
  const ERC721 = await ethers.getContractFactory("ERC721Token")
  const erc721 = await ERC721.deploy()
  await erc721.deployed()
  const VContract = await ethers.getContractFactory("VerifyingContract")
  const vContract = await VContract.deploy()
  await vContract.deployed()
  const Marketplace = await ethers.getContractFactory("Marketplace")
  const contract = await Marketplace.deploy()
  await contract.deployed()
  const amount = ethers.utils.parseEther("100000000")
  const { PRIVATE_KEY: signer } = process.env
  const acc = new ethers.Wallet(signer).address
  await erc20.mint(acc, amount)
  await erc721.mint(acc, 5)

  writeFileSync(
    "deployMarketplacePolygon.json",
    JSON.stringify(
      {
        Marketplace: contract.address,
        ERC721Token: erc721.address,
        ERC20Token: erc20.address,
        VerifyingContract: vContract.address,
      },
      null,
      2
    )
  )

  console.log(
    `MarketPlace: ${contract.address}\nERC721: ${erc721.address}\nERC20:${erc20.address}\nVerifyingContract:${vContract.address} `
  )
}

if (require.main === module) {
  main()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error(error)
      process.exit(1)
    })
}

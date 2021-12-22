import {Minted, Redeemed, RedemptionCollected} from "../generated/PoolAGOUSD/StablePool";
import {Token, Transaction} from "../generated/schema";
import {Address} from "@graphprotocol/graph-ts";
import {convertTokenToDecimal, ZERO_BD, ZERO_BI} from "./helpers";

export const POOL_AGOUSD = "0x3EEfC50453Fa7EBDcA08623196c9aDa6678f4245"
export const AGOUSD = "0x3295a41Bb929dCE32CC4598b8B6a1A032E72E1c0".toLowerCase()
export const CNUSD = "0x7F4709a14ff74184db51b50d27c11fC9e4A59C02".toLowerCase()
export const USDT = "0x7A15b47b851Cd24aBbC2A6d11c12C94185DCCFB1".toLowerCase()

export const AGOBTC = "0x3Ca12532Ca8F65C2C296729514170c5146548bAF".toLowerCase()
export const CNBTC = "0x83FaC28Ee84D1A4018f836C40E4e87baF7E3A7fC".toLowerCase()
export const WBTC = "0x42ab48a1A6D356661EC72F7AB0E0Ec7F4631fBE0".toLowerCase()

export function handlePoolMint(event: Minted): void {

    let tx = new Transaction(event.transaction.hash.toHexString());

    if (event.address == Address.fromString(POOL_AGOUSD)) {
        let agousd = Token.load(AGOUSD)!
        let cnusd = Token.load(CNUSD)!
        let usdt = Token.load(USDT)!

        tx.from = event.params.user
        tx.name = "Mint"
        tx.token0 = agousd.symbol
        tx.tokenShare = cnusd.symbol
        tx.token1 = usdt.symbol
        tx.amount0 = convertTokenToDecimal(event.params.collateralAmount, agousd.decimals);
        tx.amountShare = convertTokenToDecimal(event.params.shareAmount, cnusd.decimals);
        tx.amount1 = convertTokenToDecimal(event.params.dollarAmount, usdt.decimals);
        tx.amountTotalUSD = event.params.dollarAmount.toBigDecimal().times(agousd.priceUSD)
        tx.timestamp = event.block.timestamp
        tx.save();
    }
    else {
        let agobtc = Token.load(AGOBTC)!
        let cnbtc = Token.load(CNBTC)!
        let wbtc = Token.load(WBTC)!

        tx.from = event.params.user
        tx.name = "Mint"
        tx.token0 = agobtc.symbol
        tx.tokenShare = cnbtc.symbol
        tx.token1 = wbtc.symbol
        tx.amount0 = convertTokenToDecimal(event.params.collateralAmount, agobtc.decimals)
        tx.amountShare = convertTokenToDecimal(event.params.shareAmount, cnbtc.decimals)
        tx.amount1 = convertTokenToDecimal(event.params.dollarAmount, wbtc.decimals)
        tx.amountTotalUSD = event.params.dollarAmount.toBigDecimal().times(agobtc.priceUSD)
        tx.timestamp = event.block.timestamp
        tx.save();
    }

}


export function handlePoolRedeem(event: Redeemed): void {
    let tx = new Transaction(event.transaction.hash.toHexString());

    if (event.address == Address.fromString(POOL_AGOUSD)) {
        let agousd = Token.load(AGOUSD)!
        let cnusd = Token.load(CNUSD)!
        let usdt = Token.load(USDT)!

        tx.from = event.params.user
        tx.name = "Redeem"
        tx.token0 = agousd.symbol
        tx.tokenShare = cnusd.symbol
        tx.token1 = usdt.symbol
        tx.amount0 = convertTokenToDecimal(event.params.dollarAmount, agousd.decimals);
        tx.amountShare = convertTokenToDecimal(event.params.shareAmount, cnusd.decimals);
        tx.amount1 = convertTokenToDecimal(event.params.collateralAmount, usdt.decimals);
        tx.amountTotalUSD = event.params.dollarAmount.toBigDecimal().times(agousd.priceUSD)
        tx.timestamp = event.block.timestamp
        tx.save();
    }
    else {
        let agobtc = Token.load(AGOBTC)!
        let cnbtc = Token.load(CNBTC)!
        let wbtc = Token.load(WBTC)!

        tx.from = event.params.user
        tx.name = "Redeem"
        tx.token0 = agobtc.symbol
        tx.tokenShare = cnbtc.symbol
        tx.token1 = wbtc.symbol
        tx.amount0 = convertTokenToDecimal(event.params.dollarAmount, agobtc.decimals)
        tx.amountShare = convertTokenToDecimal(event.params.shareAmount, cnbtc.decimals)
        tx.amount1 = convertTokenToDecimal(event.params.collateralAmount, wbtc.decimals)
        tx.amountTotalUSD = event.params.dollarAmount.toBigDecimal().times(agobtc.priceUSD)
        tx.timestamp = event.block.timestamp
        tx.save();
    }
}

export function handlePoolCollectRedemption(event: RedemptionCollected): void {

    let tx = new Transaction(event.transaction.hash.toHexString());

    if (event.address == Address.fromString(POOL_AGOUSD)) {
        let cnusd = Token.load(CNUSD)!
        let usdt = Token.load(USDT)!

        tx.from = event.params.user
        tx.name = "Collect redemption"
        tx.token0 = usdt.symbol
        tx.tokenShare = cnusd.symbol
        tx.token1 = ""
        tx.amount0 = convertTokenToDecimal(event.params.collateralAmount, usdt.decimals)
        tx.amountShare = convertTokenToDecimal(event.params.shareAmount, cnusd.decimals);
        tx.amount1 = ZERO_BD;
        tx.amountTotalUSD = event.params.collateralAmount.toBigDecimal().times(usdt.priceUSD).plus(event.params.shareAmount.toBigDecimal().times(cnusd.priceUSD))
        tx.timestamp = event.block.timestamp
        tx.save();
    }
    else {
        let cnbtc = Token.load(CNBTC)!
        let wbtc = Token.load(WBTC)!

        tx.from = event.params.user
        tx.name = "Collect redemption"
        tx.token0 = wbtc.symbol
        tx.tokenShare = cnbtc.symbol
        tx.token1 = ""
        tx.amount0 = convertTokenToDecimal(event.params.collateralAmount, wbtc.decimals)
        tx.amountShare = convertTokenToDecimal(event.params.shareAmount, cnbtc.decimals)
        tx.amount1 = ZERO_BD
        tx.amountTotalUSD = event.params.collateralAmount.toBigDecimal().times(wbtc.priceUSD).plus(event.params.shareAmount.toBigDecimal().times(cnbtc.priceUSD))
        tx.timestamp = event.block.timestamp
        tx.save();
    }

}
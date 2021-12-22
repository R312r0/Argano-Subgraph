
/* eslint-disable prefer-const */
import { Pair, Token, Bundle  } from '../generated/schema'
import { BigDecimal, Address, BigInt } from '@graphprotocol/graph-ts/index'
import { ZERO_BD, ONE_BD, FACTORY_ADDRESS, ADDRESS_ZERO } from './helpers'
import { Factory as FactoryContract } from '../generated/templates/Pair/Factory'
import {log} from "@graphprotocol/graph-ts";

const WETH_ADDRESS = '0xf86e9D05e5465EE287D898BE4CaFBcA8dc49c752'.toLowerCase()
const USDC_WETH_PAIR = '0xefbe103f21e4ac7b35c2377f1e07c64e59b64dc9'.toLowerCase() // created 10008355
const DAI_WETH_PAIR = '0x0caa086768f2fa0ed0c2c0d2210602863fde085c'.toLowerCase() // created block 10042267
const USDT_WETH_PAIR = '0x697c6647d8932c7169d28804a71071c42b6d9025'.toLowerCase() // created block 10093341

export let factoryContract = FactoryContract.bind(Address.fromString(FACTORY_ADDRESS))

// minimum liquidity required to count towards tracked volume for pairs with small # of Lps
let MINIMUM_USD_THRESHOLD_NEW_PAIRS = BigDecimal.fromString('400000')

// minimum liquidity for price to get tracked
let MINIMUM_LIQUIDITY_THRESHOLD_ETH = BigDecimal.fromString('2')

export function getEthPriceInUSD(): BigDecimal {
    // fetch eth prices for each stablecoin
    let daiPair = Pair.load(DAI_WETH_PAIR) // dai is token0
    let usdcPair = Pair.load(USDC_WETH_PAIR) // usdc is token0
    let usdtPair = Pair.load(USDT_WETH_PAIR) // usdt is token1
  
    // all 3 have been created
    if (daiPair !== null && usdcPair !== null && usdtPair !== null) {
      let totalLiquidityETH = daiPair.reserve1.plus(usdcPair.reserve1).plus(usdtPair.reserve1)
      let daiWeight = daiPair.reserve1.div(totalLiquidityETH)
      let usdcWeight = usdcPair.reserve1.div(totalLiquidityETH)
      let usdtWeight = usdtPair.reserve1.div(totalLiquidityETH)
      return daiPair.token0Price
        .times(daiWeight)
        .plus(usdcPair.token0Price.times(usdcWeight))
        .plus(usdtPair.token0Price.times(usdtWeight))
      // dai and USDC have been created
    } else if (daiPair !== null && usdcPair !== null) {
      let totalLiquidityETH = daiPair.reserve1.plus(usdcPair.reserve1)
      let daiWeight = daiPair.reserve1.div(totalLiquidityETH)
      let usdcWeight = usdcPair.reserve1.div(totalLiquidityETH)
      return daiPair.token0Price.times(daiWeight).plus(usdcPair.token0Price.times(usdcWeight))
      // USDC is the only pair so far
    } else if (usdcPair !== null) {
      return usdcPair.token0Price
    } else {
      return ZERO_BD
    }
}

// FIXME: CHAGNE ADRESESS!
// FIXME: probably change it for lowercase for getting true data
// token where amounts should contribute to tracked volume and liquidity
let WHITELIST: string[] = [
    '0x4712D01F889FFc0e729a9B7E6228F4B6c3ec5Daa'.toLowerCase(), // AGO
    '0xf86e9D05e5465EE287D898BE4CaFBcA8dc49c752'.toLowerCase(), // WMATIC
    '0x5E06D8eed6FBbfDeB3bFd56007Df2a134d329364'.toLowerCase(), // DAI
    '0x8beADf271aDfc20c11Fc02FbC645728885a4E2c4'.toLowerCase(), // USDC
    '0x7A15b47b851Cd24aBbC2A6d11c12C94185DCCFB1'.toLowerCase(), // USDT
    '0x3295a41Bb929dCE32CC4598b8B6a1A032E72E1c0'.toLowerCase(), // AGOUSD
    '0x7F4709a14ff74184db51b50d27c11fC9e4A59C02'.toLowerCase(), // CNUSD
    '0x3Ca12532Ca8F65C2C296729514170c5146548bAF'.toLowerCase(), // AGOBTC
    '0x83FaC28Ee84D1A4018f836C40E4e87baF7E3A7fC'.toLowerCase(), // CNBTC
    '0x42ab48a1A6D356661EC72F7AB0E0Ec7F4631fBE0'.toLowerCase(), // WBTC
]

let PROTOCOL_MAIN: string[] = [
    '0x4712D01F889FFc0e729a9B7E6228F4B6c3ec5Daa'.toLowerCase(), // AGO
    '0x3295a41Bb929dCE32CC4598b8B6a1A032E72E1c0'.toLowerCase(), // AGOUSD
    '0x7F4709a14ff74184db51b50d27c11fC9e4A59C02'.toLowerCase(), // CNUSD
    '0x3Ca12532Ca8F65C2C296729514170c5146548bAF'.toLowerCase(), // AGOBTC
    '0x83FaC28Ee84D1A4018f836C40E4e87baF7E3A7fC'.toLowerCase(), // CNBTC
    '0x7A15b47b851Cd24aBbC2A6d11c12C94185DCCFB1'.toLowerCase(), // USDT
    '0x42ab48a1A6D356661EC72F7AB0E0Ec7F4631fBE0'.toLowerCase(), // WBTC
    '0xf86e9D05e5465EE287D898BE4CaFBcA8dc49c752'.toLowerCase(), // WMATIC
]

export function isProtocolToken(tokenAddr: string): boolean {

    for (let i = 0; i < PROTOCOL_MAIN.length; ++i) {
        // TODO: error was in "===" should be "=="
        if (tokenAddr == PROTOCOL_MAIN[i]) {
            return  true;
        }
    }

    return false;
}

// Get derived eth for token.
export function findEthPerToken(token: Token): BigDecimal {
    if (token.id == WETH_ADDRESS) {
      return ONE_BD
    }
    // loop through whitelist and check if paired with any
    for (let i = 0; i < WHITELIST.length; ++i) {
      let pairAddress = factoryContract.getPair(Address.fromString(token.id), Address.fromString(WHITELIST[i]))
      if (pairAddress.toHexString() != ADDRESS_ZERO) {
        let pair = Pair.load(pairAddress.toHexString())
          if (pair) {
              if (pair.token0 == token.id && pair.reserveETH.gt(MINIMUM_LIQUIDITY_THRESHOLD_ETH)) {
                  let token1 = Token.load(pair.token1)
                  if (token1) {
                      return pair.token1Price.times(token1.derivedETH as BigDecimal) // return token1 per our token * Eth per token 1
                  }
              }
              if (pair.token1 == token.id && pair.reserveETH.gt(MINIMUM_LIQUIDITY_THRESHOLD_ETH)) {
                  let token0 = Token.load(pair.token0)
                  if (token0) {
                      return pair.token0Price.times(token0.derivedETH as BigDecimal) // return token0 per our token * ETH per token 0
                  }
              }
          }
      }
    }
    return ZERO_BD // nothing was found return 0
}

export function getTrackedVolumeUSD(
  tokenAmount0: BigDecimal,
  token0: Token,
  tokenAmount1: BigDecimal,
  token1: Token,
  pair: Pair
): BigDecimal {

  let price0: BigDecimal;
  let price1: BigDecimal;
  let bundle = Bundle.load('1')
    if (bundle) {
        price0 = token0.derivedETH.times(bundle.ethPrice)
        price1 = token1.derivedETH.times(bundle.ethPrice)
    }

    // if less than 5 LPs, require high minimum reserve amount amount or return 0
    if (pair.liquidityProviderCount.lt(BigInt.fromI32(5))) {
        let reserve0USD = pair.reserve0.times(price0)
        let reserve1USD = pair.reserve1.times(price1)
        if (WHITELIST.includes(token0.id) && WHITELIST.includes(token1.id)) {
            if (reserve0USD.plus(reserve1USD).lt(MINIMUM_USD_THRESHOLD_NEW_PAIRS)) {
                return ZERO_BD
            }
        }
        if (WHITELIST.includes(token0.id) && !WHITELIST.includes(token1.id)) {
            if (reserve0USD.times(BigDecimal.fromString('2')).lt(MINIMUM_USD_THRESHOLD_NEW_PAIRS)) {
                return ZERO_BD
            }
        }
        if (!WHITELIST.includes(token0.id) && WHITELIST.includes(token1.id)) {
            if (reserve1USD.times(BigDecimal.fromString('2')).lt(MINIMUM_USD_THRESHOLD_NEW_PAIRS)) {
                return ZERO_BD
            }
        }
    }

    // both are whitelist tokens, take average of both amounts
    if (WHITELIST.includes(token0.id) && WHITELIST.includes(token1.id)) {
        return tokenAmount0
            .times(price0)
            .plus(tokenAmount1.times(price1))
            .div(BigDecimal.fromString('2'))
    }

    // take full value of the whitelisted token amount
    if (WHITELIST.includes(token0.id) && !WHITELIST.includes(token1.id)) {
        return tokenAmount0.times(price0)
    }

    // take full value of the whitelisted token amount
    if (!WHITELIST.includes(token0.id) && WHITELIST.includes(token1.id)) {
        return tokenAmount1.times(price1)
    }

    // neither token is on white list, tracked volume is 0
    return ZERO_BD

}
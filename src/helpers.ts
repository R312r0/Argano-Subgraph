import { TokenDefinition } from './tokenDefinition';
import {log, BigInt, BigDecimal, Address, Bytes} from '@graphprotocol/graph-ts'
import { ERC20 } from '../generated/Factory/ERC20';
import { ERC20SymbolBytes } from '../generated/Factory/ERC20SymbolBytes';
import { ERC20NameBytes } from '../generated/Factory/ERC20NameBytes';
import {PortfolioPerfomanceItem, PortfolioTokens, UniswapFactory, User, UsersArr} from "../generated/schema";
import {ERC20Contract} from "../generated/AGOToken/ERC20Contract";

export function isNullEthValue(value: string): boolean {
    return value == '0x0000000000000000000000000000000000000000000000000000000000000001'
}

export const ADDRESS_ZERO = '0x0000000000000000000000000000000000000000'
export const FACTORY_ADDRESS = '0xD97c98cCe28353a2EfbB41b9f13B3a7229b02b92'.toLowerCase()

export let ZERO_BI = BigInt.fromI32(0)
export let ONE_BI = BigInt.fromI32(1)
export let ZERO_BD = BigDecimal.fromString('0')
export let ONE_BD = BigDecimal.fromString('1')
export let BI_18 = BigInt.fromI32(18)

let REWARD_TYPE_WHITELIST: string[] = [
  '0x93eefbe7763f3a62a84ee3d35e092c3149d91988'.toLowerCase(), // AGO - WMATIC
  '0xf450696388adf29885dcb7065140e23731b5460f'.toLowerCase(), // AGOUSD - USDT
  '0x6947ef24d75a4508462ffd9fc68b4038a6cacf34'.toLowerCase(), // AGOBTC - WBTC
  '0x2c5d12bae750876c5fd08ca689c4d3c0550be26e'.toLowerCase(), // CNUSD - WMATIC
  '0xaf25337920942fb0ae9e42fe6e677a3dce451b35'.toLowerCase(), // CNBTC - WMATIC
]

export const WHITELIST_USER_PORTFOLIO = [
    '0x4712D01F889FFc0e729a9B7E6228F4B6c3ec5Daa'.toLowerCase(), // AGO
    '0x3295a41Bb929dCE32CC4598b8B6a1A032E72E1c0'.toLowerCase(), // AGOUSD
    '0x7F4709a14ff74184db51b50d27c11fC9e4A59C02'.toLowerCase(), // CNUSD
    '0x3Ca12532Ca8F65C2C296729514170c5146548bAF'.toLowerCase(), // AGOBTC
    '0x83FaC28Ee84D1A4018f836C40E4e87baF7E3A7fC'.toLowerCase(), // CNBTC
    '0x7A15b47b851Cd24aBbC2A6d11c12C94185DCCFB1'.toLowerCase(), // USDT
    '0x42ab48a1A6D356661EC72F7AB0E0Ec7F4631fBE0'.toLowerCase(), // WBTC
    '0xf86e9D05e5465EE287D898BE4CaFBcA8dc49c752'.toLowerCase(), // WMATIC
]

export const WHITELIST_USER_PORTFOLIO_TOKEN_NAMES = [
    "AGO", // AGO
    "AGOUSD", // AGOUSD
    "CNUSD", // CNUSD
    "AGOBTC", // AGOBTC
    "CNBTC", // CNBTC
    "USDT", // USDT
    "WBTC", // WBTC
    "WMATIC", // WMATIC
]


export function getUserPortfoilo(user: Address): BigDecimal {

  let bal = ZERO_BD;

  // for (let i = 0; i < WHITELIST_USER_PORTFOLIO.length; ++i) {
      let tokenContract = ERC20.bind(Address.fromString("0x6F5b69CF3090e65872b28E150B00cb8cD0f5e1bA"));
      let userBalance = tokenContract.try_balanceOf(user)

      if (userBalance.reverted) {
        bal = ZERO_BD
      }
      else {
        bal = convertTokenToDecimal(userBalance.value, new BigInt(18));
      }

      // let tokenDecimals = BigInt.fromI32(tokenContract.decimals())
      // let userBalanceFormatted = convertTokenToDecimal(userBalance, tokenDecimals);
      // bal.plus(bal.plus(userBalanceFormatted));
  // }
    return bal;
}

export function fetchTokenSymbol(tokenAddress: Address): string {
    // static definitions overrides
    // FIXME: error this wtf idk
    // let staticDefinition = TokenDefinition.fromAddress(tokenAddress)
    // if(staticDefinition !== null) {
    //   return (staticDefinition as TokenDefinition).symbol
    // }
  
    let contract = ERC20.bind(tokenAddress)
    let contractSymbolBytes = ERC20SymbolBytes.bind(tokenAddress)
  
    // try types string and bytes32 for symbol
    let symbolValue = 'unknown'
    let symbolResult = contract.try_symbol()
    if (symbolResult.reverted) {
      let symbolResultBytes = contractSymbolBytes.try_symbol()
      if (!symbolResultBytes.reverted) {
        // for broken pairs that have no symbol function exposed
        if (!isNullEthValue(symbolResultBytes.value.toHexString())) {
          symbolValue = symbolResultBytes.value.toString()
        }
      }
    } else {
      symbolValue = symbolResult.value
    }
  
  return symbolValue
}

export function convertTokenToDecimal(tokenAmount: BigInt, exchangeDecimals: BigInt): BigDecimal {
  if (exchangeDecimals == ZERO_BI) {
    return tokenAmount.toBigDecimal()
  }
  return tokenAmount.toBigDecimal().div(exponentToBigDecimal(exchangeDecimals))
}

export function exponentToBigDecimal(decimals: BigInt): BigDecimal {
  let bd = BigDecimal.fromString('1')
  for (let i = ZERO_BI; i.lt(decimals as BigInt); i = i.plus(ONE_BI)) {
    bd = bd.times(BigDecimal.fromString('10'))
  }
  return bd
}

export function fetchTokenDecimals(tokenAddress: Address): BigInt {
  // static definitions overrides
  // FIXME: here error too
  // let staticDefinition = TokenDefinition.fromAddress(tokenAddress)
  // if(staticDefinition != null) {
  //   return (staticDefinition as TokenDefinition).decimals
  // }

  let contract = ERC20.bind(tokenAddress)
  // try types uint8 for decimals
  let decimalValue = null
  let decimalResult = contract.try_decimals()
  if (!decimalResult.reverted) {
    decimalValue = decimalResult.value
  }
  return BigInt.fromI32(decimalValue as i32)
}

export function fetchTokenName(tokenAddress: Address): string {
  // static definitions overrides
  // FIXME: error here wtf
  // let staticDefinition = TokenDefinition.fromAddress(tokenAddress)
  // if(staticDefinition != null) {
  //   return (staticDefinition as TokenDefinition).name
  // }

  let contract = ERC20.bind(tokenAddress)
  let contractNameBytes = ERC20NameBytes.bind(tokenAddress)

  // try types string and bytes32 for name
  let nameValue = 'unknown'
  let nameResult = contract.try_name()
  if (nameResult.reverted) {
    let nameResultBytes = contractNameBytes.try_name()
    if (!nameResultBytes.reverted) {
      // for broken exchanges that have no name function exposed
      if (!isNullEthValue(nameResultBytes.value.toHexString())) {
        nameValue = nameResultBytes.value.toString()
      }
    }
  } else {
    nameValue = nameResult.value
  }

  return nameValue
}

export function fetchTokenTotalSupply(tokenAddress: Address): BigInt {
  let contract = ERC20.bind(tokenAddress)
  let totalSupplyValue = null
  let totalSupplyResult = contract.try_totalSupply()
  if (!totalSupplyResult.reverted) {
    totalSupplyValue = totalSupplyResult as i32
  }
  return BigInt.fromI32(totalSupplyValue as i32)
}


export function searchIsEarnTypePair(pairAddress: String): boolean {

  for (let i = 0; i < REWARD_TYPE_WHITELIST.length; ++i) {
    if (pairAddress == REWARD_TYPE_WHITELIST[i]) {
      return  true;
    }
  }

  return false;

}

export function createUser(address: Address): void {
    let user = User.load(address.toHexString())
    if (user === null) {
        user = new User(address.toHexString())
        user.save()
    }
}

export function initUserBalances(
    tokenSymbol: String,
    tokenItem: PortfolioTokens,
    portfolioItem: PortfolioPerfomanceItem,
    value: BigDecimal,
    timestamp: BigInt,
    portfolioArr: string[],
    user: User,
    contract: ERC20Contract,
): void {

    let balance = contract.balanceOf(Address.fromString(user.id));

    if (tokenSymbol == "AGO") {
        tokenItem.AGOBalance = balance.toBigDecimal()
        tokenItem.AGOUSDBalance = ZERO_BD;
        tokenItem.AGOBTCBalance = ZERO_BD
        tokenItem.CNUSDBalance = ZERO_BD;
        tokenItem.CNBTCBalance = ZERO_BD;
        tokenItem.WMATICBalance = ZERO_BD;
        tokenItem.USDTBalance = ZERO_BD;
        tokenItem.WBTCBalance = ZERO_BD;
    }

    else if (tokenSymbol == "AGOUSD") {
        tokenItem.AGOBalance = ZERO_BD
        tokenItem.AGOUSDBalance = balance.toBigDecimal()
        tokenItem.AGOBTCBalance = ZERO_BD
        tokenItem.CNUSDBalance = ZERO_BD;
        tokenItem.CNBTCBalance = ZERO_BD;
        tokenItem.WMATICBalance = ZERO_BD
        tokenItem.USDTBalance = ZERO_BD
        tokenItem.WBTCBalance = ZERO_BD;

    }

    else if (tokenSymbol == "AGOBTC") {
        tokenItem.AGOBalance = ZERO_BD
        tokenItem.AGOUSDBalance = ZERO_BD
        tokenItem.AGOBTCBalance = balance.toBigDecimal()
        tokenItem.CNUSDBalance = ZERO_BD;
        tokenItem.CNBTCBalance = ZERO_BD;
        tokenItem.WMATICBalance = ZERO_BD
        tokenItem.USDTBalance = ZERO_BD
        tokenItem.WBTCBalance = ZERO_BD;

    }

    else if (tokenSymbol == "CNBTC") {
        tokenItem.AGOBalance = ZERO_BD
        tokenItem.AGOUSDBalance = ZERO_BD;
        tokenItem.AGOBTCBalance = ZERO_BD
        tokenItem.CNUSDBalance = ZERO_BD;
        tokenItem.CNBTCBalance = balance.toBigDecimal();
        tokenItem.WMATICBalance = ZERO_BD;
        tokenItem.USDTBalance = ZERO_BD
        tokenItem.WBTCBalance = ZERO_BD;
    }

    else if (tokenSymbol == "CNUSD") {
        tokenItem.AGOBalance = ZERO_BD
        tokenItem.AGOUSDBalance = ZERO_BD;
        tokenItem.AGOBTCBalance = ZERO_BD
        tokenItem.CNUSDBalance = balance.toBigDecimal();
        tokenItem.CNBTCBalance = ZERO_BD;
        tokenItem.WMATICBalance = ZERO_BD;
        tokenItem.USDTBalance = ZERO_BD
        tokenItem.WBTCBalance = ZERO_BD;
    }

    else if (tokenSymbol == "WMATIC") {
        tokenItem.AGOBalance = ZERO_BD
        tokenItem.AGOUSDBalance = ZERO_BD;
        tokenItem.AGOBTCBalance = ZERO_BD
        tokenItem.CNUSDBalance = ZERO_BD;
        tokenItem.WMATICBalance = balance.toBigDecimal();
        tokenItem.CNBTCBalance = ZERO_BD;
        tokenItem.USDTBalance = ZERO_BD;
        tokenItem.WBTCBalance = ZERO_BD;
    }

    else if (tokenSymbol == "USDT") {
        tokenItem.AGOBalance = ZERO_BD
        tokenItem.AGOUSDBalance = ZERO_BD;
        tokenItem.AGOBTCBalance = ZERO_BD
        tokenItem.CNUSDBalance = ZERO_BD;
        tokenItem.CNBTCBalance = ZERO_BD;
        tokenItem.WMATICBalance = ZERO_BD;
        tokenItem.USDTBalance = balance.toBigDecimal();
        tokenItem.WBTCBalance = ZERO_BD;
    }

    else if (tokenSymbol == "WBTC") {
        tokenItem.AGOBalance = ZERO_BD
        tokenItem.AGOUSDBalance = ZERO_BD;
        tokenItem.AGOBTCBalance = ZERO_BD
        tokenItem.CNUSDBalance = ZERO_BD;
        tokenItem.CNBTCBalance = ZERO_BD;
        tokenItem.WMATICBalance = ZERO_BD;
        tokenItem.USDTBalance = ZERO_BD;
        tokenItem.WBTCBalance = balance.toBigDecimal();
    }

    tokenItem.save();

    portfolioItem.value = tokenItem.id;
    portfolioItem.timestamp = timestamp;
    portfolioItem.save()

    portfolioArr.push(portfolioItem.id);

    user.portfolioPerfomance = portfolioArr;
    user.save()

    let usersArr = UsersArr.load("0");

    if (usersArr === null) {
        usersArr = new UsersArr("0")
        usersArr.arr = [user.id]
        usersArr.save()
    }

    else {
        let userExistArr = usersArr.arr!;
        for (let i = 0; i < userExistArr.length; i++) {
            if (user.id == userExistArr[i]) {
                return
            }
        }
        userExistArr.push(user.id)
        usersArr.arr = userExistArr
        usersArr.save()
    }
}

export function changeBalance(
    to: boolean,
    tokenSymbol: string,
    tokenItemPrev: PortfolioTokens,
    tokenItem: PortfolioTokens,
    portfolioItem: PortfolioPerfomanceItem,
    portfolioArr: string[],
    value: BigDecimal,
    timestamp: BigInt,
    user: User,
    contract: ERC20Contract,
): void {

    let callResult = contract.balanceOf(Address.fromString(user.id));

    if (tokenSymbol == "AGO") {
        // CHANGING BALANCE HERE
        tokenItem.AGOBalance = callResult.toBigDecimal();
        // CHANGING BALANCE HERE
        tokenItem.AGOUSDBalance = tokenItemPrev.AGOUSDBalance
        tokenItem.AGOBTCBalance = tokenItemPrev.AGOBTCBalance
        tokenItem.CNUSDBalance = tokenItemPrev.CNUSDBalance
        tokenItem.CNBTCBalance = tokenItemPrev.CNBTCBalance
        tokenItem.WMATICBalance = tokenItemPrev.WMATICBalance
        tokenItem.USDTBalance = tokenItemPrev.USDTBalance
        tokenItem.WBTCBalance = tokenItemPrev.WBTCBalance
    }

    else if (tokenSymbol == "AGOUSD") {
        tokenItem.AGOBalance = tokenItemPrev.AGOBalance
        // CHANGING BALANCE HERE
        tokenItem.AGOUSDBalance = callResult.toBigDecimal();
        // CHANGING BALANCE HERE
        tokenItem.AGOBTCBalance = tokenItemPrev.AGOBTCBalance
        tokenItem.CNUSDBalance = tokenItemPrev.CNUSDBalance
        tokenItem.CNBTCBalance = tokenItemPrev.CNBTCBalance
        tokenItem.WMATICBalance = tokenItemPrev.WMATICBalance
        tokenItem.USDTBalance = tokenItemPrev.USDTBalance
        tokenItem.WBTCBalance = tokenItemPrev.WBTCBalance
    }

    else if (tokenSymbol == "AGOBTC") {
        tokenItem.AGOBalance = tokenItemPrev.AGOBalance
        tokenItem.AGOUSDBalance = tokenItemPrev.AGOUSDBalance;
        // CHANGING BALANCE HERE
        tokenItem.AGOBTCBalance = callResult.toBigDecimal()
        // CHANGING BALANCE HERE
        tokenItem.CNUSDBalance = tokenItemPrev.CNUSDBalance
        tokenItem.CNBTCBalance = tokenItemPrev.CNBTCBalance
        tokenItem.WMATICBalance = tokenItemPrev.WMATICBalance
        tokenItem.USDTBalance = tokenItemPrev.USDTBalance
        tokenItem.WBTCBalance = tokenItemPrev.WBTCBalance
    }

    else if (tokenSymbol == "CNUSD") {
        tokenItem.AGOBalance = tokenItemPrev.AGOBalance
        tokenItem.AGOUSDBalance = tokenItemPrev.AGOUSDBalance
        tokenItem.AGOBTCBalance = tokenItemPrev.AGOBTCBalance
        // CHANGING BALANCE HERE
        tokenItem.CNUSDBalance = callResult.toBigDecimal();
        // CHANGING BALANCE HERE
        tokenItem.CNBTCBalance = tokenItemPrev.CNBTCBalance
        tokenItem.WMATICBalance = tokenItemPrev.WMATICBalance
        tokenItem.USDTBalance = tokenItemPrev.USDTBalance
        tokenItem.WBTCBalance = tokenItemPrev.WBTCBalance
    }

    else if (tokenSymbol == "CNBTC") {
        tokenItem.AGOBalance = tokenItemPrev.AGOBalance
        tokenItem.AGOUSDBalance = tokenItemPrev.AGOUSDBalance
        tokenItem.AGOBTCBalance = tokenItemPrev.AGOBTCBalance
        tokenItem.CNUSDBalance = tokenItemPrev.CNUSDBalance;
        // CHANGING BALANCE HERE
        tokenItem.CNBTCBalance = callResult.toBigDecimal();
        // CHANGING BALANCE HERE
        tokenItem.WMATICBalance = tokenItemPrev.WMATICBalance
        tokenItem.USDTBalance = tokenItemPrev.USDTBalance
        tokenItem.WBTCBalance = tokenItemPrev.WBTCBalance
    }

    else if (tokenSymbol == "WMATIC") {
        tokenItem.AGOBalance = tokenItemPrev.AGOBalance
        tokenItem.AGOUSDBalance = tokenItemPrev.AGOUSDBalance
        tokenItem.AGOBTCBalance = tokenItemPrev.AGOBTCBalance
        tokenItem.CNUSDBalance = tokenItemPrev.CNUSDBalance
        tokenItem.CNBTCBalance = tokenItemPrev.CNBTCBalance
        // CHANGING BALANCE HERE
        tokenItem.WMATICBalance = callResult.toBigDecimal();
        // CHANGING BALANCE HERE
        tokenItem.USDTBalance = tokenItemPrev.USDTBalance
        tokenItem.WBTCBalance = tokenItemPrev.WBTCBalance
    }

    else if (tokenSymbol == "USDT") {
        tokenItem.AGOBalance = tokenItemPrev.AGOBalance
        tokenItem.AGOUSDBalance = tokenItemPrev.AGOUSDBalance
        tokenItem.AGOBTCBalance = tokenItemPrev.AGOBTCBalance
        tokenItem.CNUSDBalance = tokenItemPrev.CNUSDBalance
        tokenItem.CNBTCBalance = tokenItemPrev.CNBTCBalance
        tokenItem.WMATICBalance = tokenItemPrev.WMATICBalance
        // CHANGING BALANCE HERE
        tokenItem.USDTBalance = callResult.toBigDecimal();
        // CHANGING BALANCE HERE
        tokenItem.WBTCBalance = tokenItemPrev.WBTCBalance
    }

    else if (tokenSymbol == "WBTC") {
        tokenItem.AGOBalance = tokenItemPrev.AGOBalance
        tokenItem.AGOUSDBalance = tokenItemPrev.AGOUSDBalance
        tokenItem.AGOBTCBalance = tokenItemPrev.AGOBTCBalance
        tokenItem.CNUSDBalance = tokenItemPrev.CNUSDBalance
        tokenItem.CNBTCBalance = tokenItemPrev.CNBTCBalance
        tokenItem.WMATICBalance = tokenItemPrev.WMATICBalance
        tokenItem.USDTBalance = tokenItemPrev.USDTBalance;
        // CHANGING BALANCE HERE
        tokenItem.WBTCBalance = callResult.toBigDecimal()
        // CHANGING BALANCE HERE
    }

    tokenItem.save()

    portfolioItem.value = tokenItem.id;
    portfolioItem.timestamp = timestamp;
    portfolioItem.save()

    portfolioArr.push(portfolioItem.id)

    user.portfolioPerfomance = portfolioArr;
    user.save()

    let usersArr = UsersArr.load("0");

    if (usersArr === null) {
        usersArr = new UsersArr("0")
        usersArr.arr = [user.id]
        usersArr.save()
    }

    else {
        let userExistArr = usersArr.arr!;
        for (let i = 0; i < userExistArr.length; i++) {
            if (user.id == userExistArr[i]) {
                return
            }
        }
        userExistArr.push(user.id)
        usersArr.arr = userExistArr
        usersArr.save()
    }
}
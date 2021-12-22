import { Mint, Sync, Burn, Swap } from '../generated/templates/Pair/Pair';
import {BigDecimal, BigInt, Bytes, log} from '@graphprotocol/graph-ts';
import { ERC20 } from '../generated/Factory/ERC20';
import {
    Transaction,
    Token,
    Pair,
    UniswapFactory,
    TokenPriceLineItem,
    TvlChartItem,
    VolumeChartItem,
    LiquidityChartItem, PairVolumeChartItem, User, PortfolioPerfomanceItem, PortfolioTokens, UsersArr
} from '../generated/schema';
import { Address } from '@graphprotocol/graph-ts'
import { PairCreated } from '../generated/Factory/Factory';
import { Transfer } from '../generated/AGOToken/ERC20Contract';
import { Pair as PairTemplate } from '../generated/templates';
import {
    fetchTokenSymbol,
    FACTORY_ADDRESS,
    fetchTokenDecimals,
    convertTokenToDecimal,
    fetchTokenName,
    ZERO_BD,
    ZERO_BI,
    ADDRESS_ZERO,
    fetchTokenTotalSupply,
    searchIsEarnTypePair,
    getUserPortfoilo,
    createUser,
    WHITELIST_USER_PORTFOLIO,
    WHITELIST_USER_PORTFOLIO_TOKEN_NAMES,
    changeBalance,
    initUserBalances
} from './helpers';
import {getEthPriceInUSD, findEthPerToken, getTrackedVolumeUSD, isProtocolToken} from './prices';
import { Bundle } from '../generated/schema';
import {Minted} from "../generated/PoolAGOUSD/StablePool";
import {ERC20Contract} from "../generated/AGOToken/ERC20Contract";


// factory = new UniswapFactory(FACTORY_ADDRESS)
// factory.pairCount = 0
// factory.totalVolumeETH = ZERO_BD
// factory.totalLiquidityETH = ZERO_BD
// factory.totalVolumeUSD = ZERO_BD
// factory.untrackedVolumeUSD = ZERO_BD
// factory.totalLiquidityUSD = ZERO_BD
// factory.txCount = ZERO_BI
//
// // create new bundle
// let bundle = new Bundle('1')
// bundle.ethPrice = ZERO_BD
// bundle.save()

export function handleNewPair(event: PairCreated): void {
 // load factory (create if first exchange)
 let factory = UniswapFactory.load(FACTORY_ADDRESS)
 if (factory === null) {
  let tvlChartItem = new TvlChartItem(event.transaction.hash.toHex().concat("_"))
  tvlChartItem.value = ZERO_BD;
  tvlChartItem.timestamp = event.block.timestamp;
  tvlChartItem.save();
  let volumeChartItem = new VolumeChartItem(event.transaction.hash.toHex().concat("_"));
  volumeChartItem.value = ZERO_BD;
  volumeChartItem.timestamp = event.block.timestamp;
  volumeChartItem.save();
   factory = new UniswapFactory(FACTORY_ADDRESS)
   factory.totalVolumeETH = ZERO_BD
   factory.totalLiquidityETH = ZERO_BD
   factory.totalVolume = [volumeChartItem.id]
   factory.untrackedVolumeUSD = ZERO_BD
   factory.totalLiquidityUSD = ZERO_BD
   factory.totalValueLocked = [tvlChartItem.id];
   // create new bundle
   let bundle = new Bundle('1')
   bundle.ethPrice = ZERO_BD
   bundle.save()
 }
 factory.save()

 // create the tokens
 let token0 = Token.load(event.params.token0.toHexString())
 let token1 = Token.load(event.params.token1.toHexString())
//
//  // fetch info if null
 if (!token0) {
   token0 = new Token(event.params.token0.toHexString())
   token0.symbol = fetchTokenSymbol(event.params.token0)
   token0.name = fetchTokenName(event.params.token0)
   token0.isProtocolMain = isProtocolToken(token0.id); //FIXME something wrong here

   let decimals = fetchTokenDecimals(event.params.token0);

   // bail if we couldn't figure out the decimals
   if (!decimals) {
     log.debug('mybug the decimal on token 0 was null', [])
     return
   }
let priceItem0 = new TokenPriceLineItem(event.transaction.hash.toHexString().concat('-').concat(token0.symbol).concat("line_usd_chart"))
   token0.decimals = decimals
   token0.derivedETH = ZERO_BD
   token0.priceUSD = ZERO_BD
  //  token0.tradeVolume = ZERO_BD
  //  token0.tradeVolumeUSD = ZERO_BD
  //  token0.untrackedVolumeUSD = ZERO_BD
   token0.totalLiquidity = ZERO_BD
     priceItem0.timestamp = event.block.timestamp;
   priceItem0.valueUSD = ZERO_BD;
   priceItem0.save()
   token0.lineChartUSD = [priceItem0.id]
   // token0.allPairs = []
  //  token0.txCount = ZERO_BI
 }

 // fetch info if null
 if (!token1) {
   token1 = new Token(event.params.token1.toHexString())
   token1.symbol = fetchTokenSymbol(event.params.token1)
   token1.name = fetchTokenName(event.params.token1)
   token1.isProtocolMain = isProtocolToken(token1.id);

   let decimals = fetchTokenDecimals(event.params.token1);

   // bail if we couldn't figure out the decimals
   if (!decimals) {
     return
   }

     let priceItem1 = new TokenPriceLineItem(event.transaction.hash.toHexString().concat('-').concat(token1.symbol).concat("line_usd_chart"))

     token1.decimals = decimals
   token1.derivedETH = ZERO_BD
   token1.priceUSD = ZERO_BD
     priceItem1.timestamp = event.block.timestamp;
     priceItem1.valueUSD = ZERO_BD;
     priceItem1.save()
  //  token1.tradeVolume = ZERO_BD
  //  token1.tradeVolumeUSD = ZERO_BD
  //  token1.untrackedVolumeUSD = ZERO_BD
   token1.totalLiquidity = ZERO_BD
     token1.lineChartUSD = [priceItem1.id]
   // token1.allPairs = []
  //  token1.txCount = ZERO_BI
 }
 let liquidityChartItem = new LiquidityChartItem(event.block.timestamp.toHex().concat("_liq-chart-item"))
 liquidityChartItem.valueUSD = ZERO_BD;
 liquidityChartItem.timestamp = event.block.timestamp;
 liquidityChartItem.save();
 let pairVolumeChartItem = new PairVolumeChartItem(event.block.timestamp.toHex().concat("_pair-vol-chart-item"))
 pairVolumeChartItem.valueUSD = ZERO_BD;
 pairVolumeChartItem.timestamp = event.block.timestamp;
 pairVolumeChartItem.save();
 let pair = new Pair(event.params.pair.toHexString()) as Pair
 pair.token0 = token0.id
 pair.token1 = token1.id
 pair.isRewardPool = searchIsEarnTypePair(event.params.pair.toHexString())
//  pair.liquidityProviderCount = ZERO_BI
//  pair.createdAtTimestamp = event.block.timestamp
//  pair.createdAtBlockNumber = event.block.number
//  pair.txCount = ZERO_BI
 pair.reserve0 = ZERO_BD
 pair.reserve1 = ZERO_BD
 pair.trackedReserveETH = ZERO_BD
 pair.reserveETH = ZERO_BD
 pair.reserveUSD = ZERO_BD
 pair.liquidityProviderCount = ZERO_BI
 pair.liquidityChart = [liquidityChartItem.id];
 pair.volumeChart = [pairVolumeChartItem.id];
//  pair.totalSupply = ZERO_BD
//  pair.volumeToken0 = ZERO_BD
//  pair.volumeToken1 = ZERO_BD
 pair.volumeUSD = ZERO_BD
//  pair.untrackedVolumeUSD = ZERO_BD
 pair.token0Price = ZERO_BD
 pair.token1Price = ZERO_BD

 // create the tracked contract based on the template
 PairTemplate.create(event.params.pair)
//
//  // save updated values
 token0.save()
 token1.save()
 pair.save()
}

export function handleMint(event: Mint): void { 

  let tx = new Transaction(event.transaction.hash.toHex());
  let proj = UniswapFactory.load(FACTORY_ADDRESS)!;
  let pair = Pair.load(event.address.toHex())!;
  let tvlChartItem = new TvlChartItem(event.transaction.hash.toHex().concat("_"))

  let token0 = Token.load(pair.token0)!;
  let token1 = Token.load(pair.token1)!;

  let token0Amount = convertTokenToDecimal(event.params.amount0, token0.decimals)
  let token1Amount = convertTokenToDecimal(event.params.amount1, token1.decimals)
  let bundle = Bundle.load('1')!

  let amountTotalUSD = token1.derivedETH
      .times(token1Amount)
      .plus(token0.derivedETH.times(token0Amount))
      .times(bundle.ethPrice)
  let tvl = proj.totalValueLocked;
  let previously = TvlChartItem.load(tvl[tvl.length - 1])!;

  tvlChartItem.value = previously.value.plus(amountTotalUSD);
  tvlChartItem.timestamp = event.block.timestamp;
  tvlChartItem.save();
  tvl.push(tvlChartItem.id);

  proj.totalValueLocked = tvl;

  tx.name = "Add liquidity";
  tx.from = event.transaction.from;
  tx.token0 = token0.symbol;
  tx.token1 = token1.symbol;
  tx.amount0 = token0Amount;
  tx.amount1 = token1Amount;
  tx.amountTotalUSD = amountTotalUSD;
  tx.timestamp = event.block.timestamp;
  proj.save();
  tx.save();
}

export function handleSync(event: Sync): void {

    let uniswap = UniswapFactory.load(FACTORY_ADDRESS)!
    let pair = Pair.load(event.address.toHex())!
    let token0 = Token.load(pair.token0)!
    let token1 = Token.load(pair.token1)!

    // reset token total liquidity amounts
    token0.totalLiquidity = token0.totalLiquidity.minus(pair.reserve0)
    token1.totalLiquidity = token1.totalLiquidity.minus(pair.reserve1)
    // reset factory liquidity by subtracting onluy tarcked liquidity
    uniswap.totalLiquidityETH = uniswap.totalLiquidityETH.minus(pair.trackedReserveETH as BigDecimal)
    pair.reserve0 = convertTokenToDecimal(event.params.reserve0, token0.decimals)
    pair.reserve1 = convertTokenToDecimal(event.params.reserve1, token1.decimals)
    if (pair.reserve1 !== ZERO_BD) pair.token0Price = pair.reserve0.div(pair.reserve1)
    else pair.token0Price = ZERO_BD
    if (pair.reserve0 !== ZERO_BD) pair.token1Price = pair.reserve1.div(pair.reserve0)
    else pair.token1Price = ZERO_BD

    pair.save()

    let bundle = Bundle.load('1')!

    bundle.ethPrice = getEthPriceInUSD()
    bundle.save()
    token0.derivedETH = findEthPerToken(token0 as Token)
    token1.derivedETH = findEthPerToken(token1 as Token)

    token0.priceUSD = token0.derivedETH.times(bundle.ethPrice);
    token1.priceUSD = token1.derivedETH.times(bundle.ethPrice);
    // FIXME: Maybe end this in future.

    // let usersArr = UsersArr.load("0")!;
    // let usersArrArr = usersArr.arr!

    // for (let i = 0; i < usersArrArr.length ; i++) {
    //
    //     let user = User.load(usersArrArr[i])!;
    //     let prevPorftolio = user.portfolioPerfomance[user.portfolioPerfomance.length - 1]
    //     let prevPortfolioItem = PortfolioPerfomanceItem.load(prevPorftolio)!
    //     let prevTokenItem = PortfolioTokens.load(prevPortfolioItem.value)!
    //
    //     if (token0.symbol == "AGO") {
    //         prevTokenItem.AGOPrice = token0.derivedETH.times(bundle.ethPrice);
    //     }
    //     else if (token1.symbol == "AGO") {
    //         prevTokenItem.AGOPrice = token1.derivedETH.times(bundle.ethPrice);
    //     }
    //
    //     prevTokenItem.save()
    //     prevPortfolioItem.value = prevTokenItem.id
    //     prevPortfolioItem.timestamp = prevPortfolioItem.timestamp
    //     prevPortfolioItem.save()
    //     user.save()
    //
    // }

    let arr0 = token0.lineChartUSD;
    let arr1 = token1.lineChartUSD;

    let lineChartItem0 = new TokenPriceLineItem(event.transaction.hash.toHexString().concat('-').concat(token0.symbol).concat("line_usd_chart"));
    let lineChartItem1 = new TokenPriceLineItem(event.transaction.hash.toHexString().concat('-').concat(token1.symbol).concat("line_usd_chart"));

    lineChartItem0.valueUSD = token0.derivedETH.times(bundle.ethPrice);
    lineChartItem0.timestamp = event.block.timestamp;

    lineChartItem1.valueUSD = token1.derivedETH.times(bundle.ethPrice);
    lineChartItem1.timestamp = event.block.timestamp;

    lineChartItem0.save()
    lineChartItem1.save()

    arr0.push(lineChartItem0.id);
    arr1.push(lineChartItem1.id)

    token0.lineChartUSD = arr0;
    token1.lineChartUSD = arr1

    token0.save();
    token1.save();


    pair.reserveETH = pair.reserve0
      .times(token0.derivedETH as BigDecimal)
      .plus(pair.reserve1.times(token1.derivedETH as BigDecimal))
    pair.reserveUSD = pair.reserveETH.times(bundle.ethPrice)

    let liquidityChart = pair.liquidityChart;
    let newLiqChartItem = new LiquidityChartItem(event.block.timestamp.toHex().concat("_liq-chart-item"));
    newLiqChartItem.valueUSD = pair.reserveUSD;
    newLiqChartItem.timestamp = event.block.timestamp;
    newLiqChartItem.save();

    liquidityChart.push(newLiqChartItem.id);

    pair.liquidityChart = liquidityChart;
    // // use tracked amounts globally
    // uniswap.totalLiquidityETH = uniswap.totalLiquidityETH.plus(trackedLiquidityETH)
    // uniswap.totalLiquidityUSD = uniswap.totalLiquidityETH.times(bundle.ethPrice)

    // // now correctly set liquidity amounts for each token
    // token0.totalLiquidity = token0.totalLiquidity.plus(pair.reserve0)
    // token1.totalLiquidity = token1.totalLiquidity.plus(pair.reserve1)

    // // save entities
    pair.save()
    // uniswap.save()
    token0.save()
    token1.save()
}


// BURN
export function handleBurn(event: Burn): void {

  let tx = new Transaction(event.transaction.hash.toHexString())
  let tvlItem = new TvlChartItem(event.transaction.hash.toHexString())

    let pair = Pair.load(event.address.toHex())!
    let uniswap = UniswapFactory.load(FACTORY_ADDRESS)!
    let token0 = Token.load(pair.token0)!
    let token1 = Token.load(pair.token1)!
    let token0Amount = convertTokenToDecimal(event.params.amount0, token0.decimals)
    let token1Amount = convertTokenToDecimal(event.params.amount1, token1.decimals)
    let bundle = Bundle.load('1')!
    let amountTotalUSD = token1.derivedETH
        .times(token1Amount)
        .plus(token0.derivedETH.times(token0Amount))
        .times(bundle.ethPrice)

    let tvl = uniswap.totalValueLocked;
    let prevValue = TvlChartItem.load(tvl[tvl.length - 1])!

    tvlItem.value = prevValue.value.minus(amountTotalUSD);
    tvlItem.timestamp = event.block.timestamp;
    tvlItem.save();
    tvl.push(tvlItem.id)

    uniswap.totalValueLocked = tvl;
    tx.name = "Remove liquidity";
    tx.from = event.transaction.from;
    tx.token0 = token0.symbol;
    tx.token1 = token1.symbol;
    tx.amount0 = token0Amount;
    tx.amount1 = token1Amount;
    // TODO: Probably Project Volume 24h depends on removing liquidity too.
    // TODO: Decide with Stas and Pasha is it true.
    tx.amountTotalUSD = amountTotalUSD;
    tx.timestamp = event.block.timestamp;

    // update global counter and save
    token0.save()
    token1.save()
    pair.save()
    uniswap.save()
    tx.save()
}


export function handleSwap(event: Swap): void {

  let tx = new Transaction(event.transaction.hash.toHexString());
    let factory = UniswapFactory.load(FACTORY_ADDRESS)!;
    let pair = Pair.load(event.address.toHexString())!

    let token0 = Token.load(pair.token0)!
    let token1 = Token.load(pair.token1)!

    let amount0In = convertTokenToDecimal(event.params.amount0In, token0.decimals)
    let amount1In = convertTokenToDecimal(event.params.amount1In, token1.decimals)
    let amount0Out = convertTokenToDecimal(event.params.amount0Out, token0.decimals)
    let amount1Out = convertTokenToDecimal(event.params.amount1Out, token1.decimals)

    // FIXME: write new porfolio entity with fresh price of asset


    // totals for volume updates
    let amount0Total = amount0Out.plus(amount0In)
    let amount1Total = amount1Out.plus(amount1In)

    let bundle = Bundle.load('1')!

    let derivedAmountETH = token1.derivedETH
        .times(amount1Total)
        .plus(token0.derivedETH.times(amount0Total))
        .div(BigDecimal.fromString('2'))
    let derivedAmountUSD = derivedAmountETH.times(bundle.ethPrice)

    let trackedAmountUSD = getTrackedVolumeUSD(amount0Total, token0 as Token, amount1Total, token1 as Token, pair as Pair)

    let trackedAmountETH: BigDecimal

    if (bundle.ethPrice.equals(ZERO_BD)) {
        trackedAmountETH = ZERO_BD
    } else {
        trackedAmountETH = trackedAmountUSD.div(bundle.ethPrice)
    }
    tx.name = "Swap"
    tx.from = event.transaction.from;
    tx.amount0 = amount0Total;
    tx.amount1 = amount1Total;
    tx.token0 = token0.symbol;
    tx.token1 = token1.symbol;
    tx.amountTotalUSD = trackedAmountUSD === ZERO_BD ? derivedAmountUSD : trackedAmountUSD;
    tx.timestamp = event.block.timestamp;

    tx.save();

    let totalVolume = factory.totalVolume;
    let volumeItem = VolumeChartItem.load(totalVolume[totalVolume.length - 1])!;

    let possiblyNextDay = volumeItem.timestamp.toI32();
    let currentTime = event.block.timestamp.toI32();

    // If right now is the next day.
    if (currentTime <= possiblyNextDay + 86400) {
        volumeItem.value = volumeItem.value.plus(trackedAmountUSD === ZERO_BD ? derivedAmountUSD : trackedAmountUSD);
        volumeItem.save();
        factory.save();
    }
                    // If right now is still current day
    else {
        let newVolItem = new VolumeChartItem(event.transaction.hash.toHexString());
        newVolItem.timestamp = event.block.timestamp;
        newVolItem.value = trackedAmountUSD === ZERO_BD ? derivedAmountUSD : trackedAmountUSD;
        newVolItem.save()
        totalVolume.push(newVolItem.id);
        factory.totalVolume = totalVolume;
        factory.save();
    }

    let newPairVolumeChartItem = new PairVolumeChartItem(event.block.timestamp.toHex().concat("_pair-vol-chart-item"))
    let pairVolumeChart = pair.volumeChart;

    pair.volumeUSD = pair.volumeUSD.plus(derivedAmountUSD)
    newPairVolumeChartItem.valueUSD = derivedAmountUSD;
    newPairVolumeChartItem.timestamp = event.block.timestamp;
    newPairVolumeChartItem.save()
    pairVolumeChart.push(newPairVolumeChartItem.id);
    pair.volumeChart = pairVolumeChart;

    pair.save()
}

export function handleTokenTransfer(event: Transfer): void {


    let tokenSymbol = "";
    let contract = ERC20Contract.bind(event.address)

    for (let i = 0; i < WHITELIST_USER_PORTFOLIO.length; ++i) {

        let item = WHITELIST_USER_PORTFOLIO[i]

        if(item.toString() == event.address.toHexString()) {
            tokenSymbol = WHITELIST_USER_PORTFOLIO_TOKEN_NAMES[i]
            break;
        }
    }

    let userFrom = User.load(event.params.from.toHexString())
    if (userFrom === null) {
        userFrom = new User(event.params.from.toHexString())

        let pfFromArr = userFrom.portfolioPerfomance

        let pfFromItem = new PortfolioPerfomanceItem(event.transaction.hash.toHex() + "-" + event.logIndex.toString().concat("_from").concat(event.params.from.toHexString()).concat('new'));
        let pfFromTok = new PortfolioTokens(event.transaction.hash.toHex() + "-" + event.logIndex.toString() + "-" + event.logIndex.toString().concat("_from").concat(event.params.from.toHexString()).concat('new'))

        initUserBalances(
            tokenSymbol,
            pfFromTok,
            pfFromItem,
            event.params.value.toBigDecimal(),
            event.block.timestamp,
            pfFromArr,
            userFrom,
            contract,
        );

    }

    else {

        let pfFromArr = userFrom.portfolioPerfomance

        let pfFromItemPrev = PortfolioPerfomanceItem.load(pfFromArr[pfFromArr.length - 1])!
        let pfFromTokPrev = PortfolioTokens.load(pfFromItemPrev.value)!
        let pfFromItem = new PortfolioPerfomanceItem(event.transaction.hash.toHex() + "-" + event.logIndex.toString().concat("_from").concat(event.params.from.toHexString()));
        let pfFromTok = new PortfolioTokens(event.transaction.hash.toHex() + "-" + event.logIndex.toString() + "-" + event.logIndex.toString().concat("_from").concat(event.params.from.toHexString()))

        changeBalance(
            false,
            tokenSymbol,
            pfFromTokPrev,
            pfFromTok,
            pfFromItem,
            pfFromArr,
            event.params.value.toBigDecimal(),
            event.block.timestamp,
            userFrom,
            contract,
        );

    }

    let userTo = User.load(event.params.to.toHexString())
    if (userTo === null) {
        userTo = new User(event.params.to.toHexString())
        let pfToArr = userTo.portfolioPerfomance

        let pfToItem = new PortfolioPerfomanceItem(event.transaction.hash.toHex() + "-" + event.logIndex.toString().concat("_to").concat(event.params.to.toHexString()).concat('new'));
        let pfToTok = new PortfolioTokens(event.transaction.hash.toHex() + "-" + event.logIndex.toString() + "-" + event.logIndex.toString().concat("_to").concat(event.params.to.toHexString()).concat('new'))

        initUserBalances(
            tokenSymbol,
            pfToTok, pfToItem, event.params.value.toBigDecimal(), event.block.timestamp, pfToArr, userTo, contract);
    }

    else {
        let pfToArr = userTo.portfolioPerfomance;

        let pfToItemPrev = PortfolioPerfomanceItem.load(pfToArr[pfToArr.length - 1])!;
        let pfToTokenPrev = PortfolioTokens.load(pfToItemPrev.value)!;
        let pfToItem = new PortfolioPerfomanceItem(event.transaction.hash.toHex() + "-" + event.logIndex.toString().concat("_to").concat(event.params.to.toHexString()));
        let pfToTok = new PortfolioTokens(event.transaction.hash.toHex() + "-" + event.logIndex.toString() + "-" + event.logIndex.toString().concat("_to").concat(event.params.to.toHexString()));

        changeBalance(true,
            tokenSymbol,
            pfToTokenPrev,
            pfToTok, pfToItem, pfToArr, event.params.value.toBigDecimal(), event.block.timestamp, userTo, contract);
    }
}
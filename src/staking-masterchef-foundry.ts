import {Deposit, MasterChef, Withdraw} from "../generated/MasterChef/MasterChef";
import {Pair, Token, Transaction, TvlChartItem, UniswapFactory} from "../generated/schema";
import {convertTokenToDecimal, FACTORY_ADDRESS, REWARD_TYPE_WHITELIST, SINGLE_STAKING_POOL, ZERO_BD} from "./helpers";
import {Address, BigInt, log} from "@graphprotocol/graph-ts";
import {ERC20Contract} from "../generated/MasterChef/ERC20Contract";

export function handleStake(event: Deposit): void {

    let masterChef = MasterChef.bind(Address.fromString("0xe3b49f1382e146b6C2c7E497d4A32b39D2AD07B6"))
    let lpToken = masterChef.poolInfo(event.params.pid);

    let tokenUsdAmount = ZERO_BD;
    let tokenAmount = ZERO_BD;
    let tokenSymbol = "";
    let uniToken = false;

    let tx = new Transaction(event.transaction.hash.toHexString());

    for (let i = 0; i < SINGLE_STAKING_POOL.length; i++) {
        if (lpToken.value0.toHexString().toLowerCase() == SINGLE_STAKING_POOL[i]) {
            let token = Token.load(SINGLE_STAKING_POOL[i])!;
            tokenSymbol = token.symbol
            tokenUsdAmount = token.priceUSD.times(convertTokenToDecimal(event.params.amount, token.decimals))
            tokenAmount = convertTokenToDecimal(event.params.amount, token.decimals)
            break;
        }
    }

    for (let i = 0; i < REWARD_TYPE_WHITELIST.length; i++) {
        if (lpToken.value0.toHexString().toLowerCase() == REWARD_TYPE_WHITELIST[i]) {
            uniToken = true
            let pair = Pair.load(REWARD_TYPE_WHITELIST[i])!
            let lpToken = ERC20Contract.bind(Address.fromString(REWARD_TYPE_WHITELIST[i]))

            let token0 = Token.load(pair.token0)!
            let token1 = Token.load(pair.token1)!

            tokenSymbol = token0.symbol.concat("-").concat(token1.symbol)

            tokenUsdAmount =
                pair.reserveUSD
                    .div(convertTokenToDecimal(lpToken.totalSupply(), BigInt.fromI32(lpToken.decimals())))
                    .times(event.params.amount.toBigDecimal());
            tokenAmount = convertTokenToDecimal(event.params.amount, BigInt.fromI32(lpToken.decimals()))
            break;
        }
    }

    if (!uniToken) {
        let proj = UniswapFactory.load(FACTORY_ADDRESS)!;

        let tvlChart = proj.totalValueLocked
        let tvlChartItemPrev = TvlChartItem.load(tvlChart[tvlChart.length - 1])!
        let newTvlChartItem = new TvlChartItem(event.transaction.hash.toHex().concat("_").concat(tvlChart.length.toString()))

        newTvlChartItem.value = tvlChartItemPrev.value.plus(tokenUsdAmount);
        newTvlChartItem.timestamp = event.block.timestamp;
        newTvlChartItem.save()

        tvlChart.push(newTvlChartItem.id)
        proj.totalValueLocked = tvlChart;
        proj.save()
        // Add tx actions,

    }

    tx.name = "Stake"
    tx.from = event.transaction.from;
    tx.token0 = tokenSymbol
    tx.token1 = ""
    tx.amount0 =
    tx.amountTotalUSD = tokenUsdAmount
    tx.amount1 = ZERO_BD
    tx.timestamp = event.block.timestamp
    tx.save()

}


export function handleUnStake(event: Withdraw): void {

    let masterChef = MasterChef.bind(Address.fromString("0xe3b49f1382e146b6C2c7E497d4A32b39D2AD07B6"))
    let lpToken = masterChef.poolInfo(event.params.pid);

    let tokenUsdAmount = ZERO_BD;
    let tokenAmount = ZERO_BD;
    let tokenSymbol = "";
    let uniToken = false;

    let tx = new Transaction(event.transaction.hash.toHexString());

    for (let i = 0; i < SINGLE_STAKING_POOL.length; i++) {
        if (lpToken.value0.toHexString().toLowerCase() == SINGLE_STAKING_POOL[i]) {
            let token = Token.load(SINGLE_STAKING_POOL[i])!;
            tokenSymbol = token.symbol
            tokenUsdAmount = token.priceUSD.times(convertTokenToDecimal(event.params.amount, token.decimals))
            tokenAmount = convertTokenToDecimal(event.params.amount, token.decimals)
            break;
        }
    }

    for (let i = 0; i < REWARD_TYPE_WHITELIST.length; i++) {
        if (lpToken.value0.toHexString().toLowerCase() == REWARD_TYPE_WHITELIST[i]) {
            uniToken = true
            let pair = Pair.load(REWARD_TYPE_WHITELIST[i])!
            let lpToken = ERC20Contract.bind(Address.fromString(REWARD_TYPE_WHITELIST[i]))

            let token0 = Token.load(pair.token0)!
            let token1 = Token.load(pair.token1)!

            tokenSymbol = token0.symbol.concat("-").concat(token1.symbol)

            tokenUsdAmount =
                pair.reserveUSD
                    .div(convertTokenToDecimal(lpToken.totalSupply(), BigInt.fromI32(lpToken.decimals())))
                    .times(event.params.amount.toBigDecimal());
            tokenAmount = convertTokenToDecimal(event.params.amount, BigInt.fromI32(lpToken.decimals()))
            break;
        }
    }

    if (!uniToken) {
        let proj = UniswapFactory.load(FACTORY_ADDRESS)!;

        let tvlChart = proj.totalValueLocked
        let tvlChartItemPrev = TvlChartItem.load(tvlChart[tvlChart.length - 1])!
        let newTvlChartItem = new TvlChartItem(event.transaction.hash.toHex().concat("_").concat(tvlChart.length.toString()))

        newTvlChartItem.value = tvlChartItemPrev.value.minus(tokenUsdAmount);
        newTvlChartItem.timestamp = event.block.timestamp;
        newTvlChartItem.save()

        tvlChart.push(newTvlChartItem.id)
        proj.totalValueLocked = tvlChart;
        proj.save()
        // Add tx actions,

    }

    tx.name = "Unstake"
    tx.from = event.transaction.from;
    tx.token0 = tokenSymbol
    tx.token1 = ""
    tx.amount0 = tokenAmount
    tx.amountTotalUSD = tokenUsdAmount
    tx.amount1 = ZERO_BD
    tx.timestamp = event.block.timestamp
    tx.save()


}
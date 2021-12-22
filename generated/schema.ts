// THIS IS AN AUTOGENERATED FILE. DO NOT EDIT THIS FILE DIRECTLY.

import {
  TypedMap,
  Entity,
  Value,
  ValueKind,
  store,
  Bytes,
  BigInt,
  BigDecimal
} from "@graphprotocol/graph-ts";

export class UniswapFactory extends Entity {
  constructor(id: string) {
    super();
    this.set("id", Value.fromString(id));

    this.set("totalVolumeETH", Value.fromBigDecimal(BigDecimal.zero()));
    this.set("untrackedVolumeUSD", Value.fromBigDecimal(BigDecimal.zero()));
    this.set("totalLiquidityUSD", Value.fromBigDecimal(BigDecimal.zero()));
    this.set("totalLiquidityETH", Value.fromBigDecimal(BigDecimal.zero()));
    this.set("totalValueLocked", Value.fromStringArray(new Array(0)));
    this.set("totalVolume", Value.fromStringArray(new Array(0)));
  }

  save(): void {
    let id = this.get("id");
    assert(id != null, "Cannot save UniswapFactory entity without an ID");
    if (id) {
      assert(
        id.kind == ValueKind.STRING,
        "Cannot save UniswapFactory entity with non-string ID. " +
          'Considering using .toHex() to convert the "id" to a string.'
      );
      store.set("UniswapFactory", id.toString(), this);
    }
  }

  static load(id: string): UniswapFactory | null {
    return changetype<UniswapFactory | null>(store.get("UniswapFactory", id));
  }

  get id(): string {
    let value = this.get("id");
    return value!.toString();
  }

  set id(value: string) {
    this.set("id", Value.fromString(value));
  }

  get totalVolumeETH(): BigDecimal {
    let value = this.get("totalVolumeETH");
    return value!.toBigDecimal();
  }

  set totalVolumeETH(value: BigDecimal) {
    this.set("totalVolumeETH", Value.fromBigDecimal(value));
  }

  get untrackedVolumeUSD(): BigDecimal {
    let value = this.get("untrackedVolumeUSD");
    return value!.toBigDecimal();
  }

  set untrackedVolumeUSD(value: BigDecimal) {
    this.set("untrackedVolumeUSD", Value.fromBigDecimal(value));
  }

  get totalLiquidityUSD(): BigDecimal {
    let value = this.get("totalLiquidityUSD");
    return value!.toBigDecimal();
  }

  set totalLiquidityUSD(value: BigDecimal) {
    this.set("totalLiquidityUSD", Value.fromBigDecimal(value));
  }

  get totalLiquidityETH(): BigDecimal {
    let value = this.get("totalLiquidityETH");
    return value!.toBigDecimal();
  }

  set totalLiquidityETH(value: BigDecimal) {
    this.set("totalLiquidityETH", Value.fromBigDecimal(value));
  }

  get totalValueLocked(): Array<string> {
    let value = this.get("totalValueLocked");
    return value!.toStringArray();
  }

  set totalValueLocked(value: Array<string>) {
    this.set("totalValueLocked", Value.fromStringArray(value));
  }

  get totalVolume(): Array<string> {
    let value = this.get("totalVolume");
    return value!.toStringArray();
  }

  set totalVolume(value: Array<string>) {
    this.set("totalVolume", Value.fromStringArray(value));
  }
}

export class UsersArr extends Entity {
  constructor(id: string) {
    super();
    this.set("id", Value.fromString(id));
  }

  save(): void {
    let id = this.get("id");
    assert(id != null, "Cannot save UsersArr entity without an ID");
    if (id) {
      assert(
        id.kind == ValueKind.STRING,
        "Cannot save UsersArr entity with non-string ID. " +
          'Considering using .toHex() to convert the "id" to a string.'
      );
      store.set("UsersArr", id.toString(), this);
    }
  }

  static load(id: string): UsersArr | null {
    return changetype<UsersArr | null>(store.get("UsersArr", id));
  }

  get id(): string {
    let value = this.get("id");
    return value!.toString();
  }

  set id(value: string) {
    this.set("id", Value.fromString(value));
  }

  get arr(): Array<string> | null {
    let value = this.get("arr");
    if (!value || value.kind == ValueKind.NULL) {
      return null;
    } else {
      return value.toStringArray();
    }
  }

  set arr(value: Array<string> | null) {
    if (!value) {
      this.unset("arr");
    } else {
      this.set("arr", Value.fromStringArray(<Array<string>>value));
    }
  }
}

export class VolumeChartItem extends Entity {
  constructor(id: string) {
    super();
    this.set("id", Value.fromString(id));

    this.set("value", Value.fromBigDecimal(BigDecimal.zero()));
    this.set("timestamp", Value.fromBigInt(BigInt.zero()));
  }

  save(): void {
    let id = this.get("id");
    assert(id != null, "Cannot save VolumeChartItem entity without an ID");
    if (id) {
      assert(
        id.kind == ValueKind.STRING,
        "Cannot save VolumeChartItem entity with non-string ID. " +
          'Considering using .toHex() to convert the "id" to a string.'
      );
      store.set("VolumeChartItem", id.toString(), this);
    }
  }

  static load(id: string): VolumeChartItem | null {
    return changetype<VolumeChartItem | null>(store.get("VolumeChartItem", id));
  }

  get id(): string {
    let value = this.get("id");
    return value!.toString();
  }

  set id(value: string) {
    this.set("id", Value.fromString(value));
  }

  get value(): BigDecimal {
    let value = this.get("value");
    return value!.toBigDecimal();
  }

  set value(value: BigDecimal) {
    this.set("value", Value.fromBigDecimal(value));
  }

  get timestamp(): BigInt {
    let value = this.get("timestamp");
    return value!.toBigInt();
  }

  set timestamp(value: BigInt) {
    this.set("timestamp", Value.fromBigInt(value));
  }
}

export class TvlChartItem extends Entity {
  constructor(id: string) {
    super();
    this.set("id", Value.fromString(id));

    this.set("value", Value.fromBigDecimal(BigDecimal.zero()));
    this.set("timestamp", Value.fromBigInt(BigInt.zero()));
  }

  save(): void {
    let id = this.get("id");
    assert(id != null, "Cannot save TvlChartItem entity without an ID");
    if (id) {
      assert(
        id.kind == ValueKind.STRING,
        "Cannot save TvlChartItem entity with non-string ID. " +
          'Considering using .toHex() to convert the "id" to a string.'
      );
      store.set("TvlChartItem", id.toString(), this);
    }
  }

  static load(id: string): TvlChartItem | null {
    return changetype<TvlChartItem | null>(store.get("TvlChartItem", id));
  }

  get id(): string {
    let value = this.get("id");
    return value!.toString();
  }

  set id(value: string) {
    this.set("id", Value.fromString(value));
  }

  get value(): BigDecimal {
    let value = this.get("value");
    return value!.toBigDecimal();
  }

  set value(value: BigDecimal) {
    this.set("value", Value.fromBigDecimal(value));
  }

  get timestamp(): BigInt {
    let value = this.get("timestamp");
    return value!.toBigInt();
  }

  set timestamp(value: BigInt) {
    this.set("timestamp", Value.fromBigInt(value));
  }
}

export class Transaction extends Entity {
  constructor(id: string) {
    super();
    this.set("id", Value.fromString(id));

    this.set("name", Value.fromString(""));
    this.set("from", Value.fromBytes(Bytes.empty()));
    this.set("token0", Value.fromString(""));
    this.set("token1", Value.fromString(""));
    this.set("amount0", Value.fromBigDecimal(BigDecimal.zero()));
    this.set("amountTotalUSD", Value.fromBigDecimal(BigDecimal.zero()));
    this.set("timestamp", Value.fromBigInt(BigInt.zero()));
  }

  save(): void {
    let id = this.get("id");
    assert(id != null, "Cannot save Transaction entity without an ID");
    if (id) {
      assert(
        id.kind == ValueKind.STRING,
        "Cannot save Transaction entity with non-string ID. " +
          'Considering using .toHex() to convert the "id" to a string.'
      );
      store.set("Transaction", id.toString(), this);
    }
  }

  static load(id: string): Transaction | null {
    return changetype<Transaction | null>(store.get("Transaction", id));
  }

  get id(): string {
    let value = this.get("id");
    return value!.toString();
  }

  set id(value: string) {
    this.set("id", Value.fromString(value));
  }

  get name(): string {
    let value = this.get("name");
    return value!.toString();
  }

  set name(value: string) {
    this.set("name", Value.fromString(value));
  }

  get from(): Bytes {
    let value = this.get("from");
    return value!.toBytes();
  }

  set from(value: Bytes) {
    this.set("from", Value.fromBytes(value));
  }

  get token0(): string {
    let value = this.get("token0");
    return value!.toString();
  }

  set token0(value: string) {
    this.set("token0", Value.fromString(value));
  }

  get tokenShare(): string | null {
    let value = this.get("tokenShare");
    if (!value || value.kind == ValueKind.NULL) {
      return null;
    } else {
      return value.toString();
    }
  }

  set tokenShare(value: string | null) {
    if (!value) {
      this.unset("tokenShare");
    } else {
      this.set("tokenShare", Value.fromString(<string>value));
    }
  }

  get token1(): string {
    let value = this.get("token1");
    return value!.toString();
  }

  set token1(value: string) {
    this.set("token1", Value.fromString(value));
  }

  get amount0(): BigDecimal {
    let value = this.get("amount0");
    return value!.toBigDecimal();
  }

  set amount0(value: BigDecimal) {
    this.set("amount0", Value.fromBigDecimal(value));
  }

  get amountShare(): BigDecimal | null {
    let value = this.get("amountShare");
    if (!value || value.kind == ValueKind.NULL) {
      return null;
    } else {
      return value.toBigDecimal();
    }
  }

  set amountShare(value: BigDecimal | null) {
    if (!value) {
      this.unset("amountShare");
    } else {
      this.set("amountShare", Value.fromBigDecimal(<BigDecimal>value));
    }
  }

  get amount1(): BigDecimal | null {
    let value = this.get("amount1");
    if (!value || value.kind == ValueKind.NULL) {
      return null;
    } else {
      return value.toBigDecimal();
    }
  }

  set amount1(value: BigDecimal | null) {
    if (!value) {
      this.unset("amount1");
    } else {
      this.set("amount1", Value.fromBigDecimal(<BigDecimal>value));
    }
  }

  get amountTotalUSD(): BigDecimal {
    let value = this.get("amountTotalUSD");
    return value!.toBigDecimal();
  }

  set amountTotalUSD(value: BigDecimal) {
    this.set("amountTotalUSD", Value.fromBigDecimal(value));
  }

  get timestamp(): BigInt {
    let value = this.get("timestamp");
    return value!.toBigInt();
  }

  set timestamp(value: BigInt) {
    this.set("timestamp", Value.fromBigInt(value));
  }
}

export class User extends Entity {
  constructor(id: string) {
    super();
    this.set("id", Value.fromString(id));

    this.set("portfolioPerfomance", Value.fromStringArray(new Array(0)));
  }

  save(): void {
    let id = this.get("id");
    assert(id != null, "Cannot save User entity without an ID");
    if (id) {
      assert(
        id.kind == ValueKind.STRING,
        "Cannot save User entity with non-string ID. " +
          'Considering using .toHex() to convert the "id" to a string.'
      );
      store.set("User", id.toString(), this);
    }
  }

  static load(id: string): User | null {
    return changetype<User | null>(store.get("User", id));
  }

  get id(): string {
    let value = this.get("id");
    return value!.toString();
  }

  set id(value: string) {
    this.set("id", Value.fromString(value));
  }

  get portfolioPerfomance(): Array<string> {
    let value = this.get("portfolioPerfomance");
    return value!.toStringArray();
  }

  set portfolioPerfomance(value: Array<string>) {
    this.set("portfolioPerfomance", Value.fromStringArray(value));
  }
}

export class PortfolioPerfomanceItem extends Entity {
  constructor(id: string) {
    super();
    this.set("id", Value.fromString(id));

    this.set("value", Value.fromString(""));
    this.set("timestamp", Value.fromBigInt(BigInt.zero()));
  }

  save(): void {
    let id = this.get("id");
    assert(
      id != null,
      "Cannot save PortfolioPerfomanceItem entity without an ID"
    );
    if (id) {
      assert(
        id.kind == ValueKind.STRING,
        "Cannot save PortfolioPerfomanceItem entity with non-string ID. " +
          'Considering using .toHex() to convert the "id" to a string.'
      );
      store.set("PortfolioPerfomanceItem", id.toString(), this);
    }
  }

  static load(id: string): PortfolioPerfomanceItem | null {
    return changetype<PortfolioPerfomanceItem | null>(
      store.get("PortfolioPerfomanceItem", id)
    );
  }

  get id(): string {
    let value = this.get("id");
    return value!.toString();
  }

  set id(value: string) {
    this.set("id", Value.fromString(value));
  }

  get value(): string {
    let value = this.get("value");
    return value!.toString();
  }

  set value(value: string) {
    this.set("value", Value.fromString(value));
  }

  get timestamp(): BigInt {
    let value = this.get("timestamp");
    return value!.toBigInt();
  }

  set timestamp(value: BigInt) {
    this.set("timestamp", Value.fromBigInt(value));
  }
}

export class PortfolioTokens extends Entity {
  constructor(id: string) {
    super();
    this.set("id", Value.fromString(id));

    this.set("AGOBalance", Value.fromBigDecimal(BigDecimal.zero()));
    this.set("AGOUSDBalance", Value.fromBigDecimal(BigDecimal.zero()));
    this.set("AGOBTCBalance", Value.fromBigDecimal(BigDecimal.zero()));
    this.set("CNUSDBalance", Value.fromBigDecimal(BigDecimal.zero()));
    this.set("CNBTCBalance", Value.fromBigDecimal(BigDecimal.zero()));
    this.set("WMATICBalance", Value.fromBigDecimal(BigDecimal.zero()));
    this.set("USDTBalance", Value.fromBigDecimal(BigDecimal.zero()));
    this.set("WBTCBalance", Value.fromBigDecimal(BigDecimal.zero()));
  }

  save(): void {
    let id = this.get("id");
    assert(id != null, "Cannot save PortfolioTokens entity without an ID");
    if (id) {
      assert(
        id.kind == ValueKind.STRING,
        "Cannot save PortfolioTokens entity with non-string ID. " +
          'Considering using .toHex() to convert the "id" to a string.'
      );
      store.set("PortfolioTokens", id.toString(), this);
    }
  }

  static load(id: string): PortfolioTokens | null {
    return changetype<PortfolioTokens | null>(store.get("PortfolioTokens", id));
  }

  get id(): string {
    let value = this.get("id");
    return value!.toString();
  }

  set id(value: string) {
    this.set("id", Value.fromString(value));
  }

  get AGOBalance(): BigDecimal {
    let value = this.get("AGOBalance");
    return value!.toBigDecimal();
  }

  set AGOBalance(value: BigDecimal) {
    this.set("AGOBalance", Value.fromBigDecimal(value));
  }

  get AGOUSDBalance(): BigDecimal {
    let value = this.get("AGOUSDBalance");
    return value!.toBigDecimal();
  }

  set AGOUSDBalance(value: BigDecimal) {
    this.set("AGOUSDBalance", Value.fromBigDecimal(value));
  }

  get AGOBTCBalance(): BigDecimal {
    let value = this.get("AGOBTCBalance");
    return value!.toBigDecimal();
  }

  set AGOBTCBalance(value: BigDecimal) {
    this.set("AGOBTCBalance", Value.fromBigDecimal(value));
  }

  get CNUSDBalance(): BigDecimal {
    let value = this.get("CNUSDBalance");
    return value!.toBigDecimal();
  }

  set CNUSDBalance(value: BigDecimal) {
    this.set("CNUSDBalance", Value.fromBigDecimal(value));
  }

  get CNBTCBalance(): BigDecimal {
    let value = this.get("CNBTCBalance");
    return value!.toBigDecimal();
  }

  set CNBTCBalance(value: BigDecimal) {
    this.set("CNBTCBalance", Value.fromBigDecimal(value));
  }

  get WMATICBalance(): BigDecimal {
    let value = this.get("WMATICBalance");
    return value!.toBigDecimal();
  }

  set WMATICBalance(value: BigDecimal) {
    this.set("WMATICBalance", Value.fromBigDecimal(value));
  }

  get USDTBalance(): BigDecimal {
    let value = this.get("USDTBalance");
    return value!.toBigDecimal();
  }

  set USDTBalance(value: BigDecimal) {
    this.set("USDTBalance", Value.fromBigDecimal(value));
  }

  get WBTCBalance(): BigDecimal {
    let value = this.get("WBTCBalance");
    return value!.toBigDecimal();
  }

  set WBTCBalance(value: BigDecimal) {
    this.set("WBTCBalance", Value.fromBigDecimal(value));
  }
}

export class Pair extends Entity {
  constructor(id: string) {
    super();
    this.set("id", Value.fromString(id));

    this.set("token0", Value.fromString(""));
    this.set("token1", Value.fromString(""));
    this.set("reserve0", Value.fromBigDecimal(BigDecimal.zero()));
    this.set("reserve1", Value.fromBigDecimal(BigDecimal.zero()));
    this.set("reserveETH", Value.fromBigDecimal(BigDecimal.zero()));
    this.set("reserveUSD", Value.fromBigDecimal(BigDecimal.zero()));
    this.set("trackedReserveETH", Value.fromBigDecimal(BigDecimal.zero()));
    this.set("token0Price", Value.fromBigDecimal(BigDecimal.zero()));
    this.set("token1Price", Value.fromBigDecimal(BigDecimal.zero()));
    this.set("liquidityProviderCount", Value.fromBigInt(BigInt.zero()));
    this.set("volumeUSD", Value.fromBigDecimal(BigDecimal.zero()));
    this.set("volumeChart", Value.fromStringArray(new Array(0)));
    this.set("liquidityChart", Value.fromStringArray(new Array(0)));
  }

  save(): void {
    let id = this.get("id");
    assert(id != null, "Cannot save Pair entity without an ID");
    if (id) {
      assert(
        id.kind == ValueKind.STRING,
        "Cannot save Pair entity with non-string ID. " +
          'Considering using .toHex() to convert the "id" to a string.'
      );
      store.set("Pair", id.toString(), this);
    }
  }

  static load(id: string): Pair | null {
    return changetype<Pair | null>(store.get("Pair", id));
  }

  get id(): string {
    let value = this.get("id");
    return value!.toString();
  }

  set id(value: string) {
    this.set("id", Value.fromString(value));
  }

  get token0(): string {
    let value = this.get("token0");
    return value!.toString();
  }

  set token0(value: string) {
    this.set("token0", Value.fromString(value));
  }

  get token1(): string {
    let value = this.get("token1");
    return value!.toString();
  }

  set token1(value: string) {
    this.set("token1", Value.fromString(value));
  }

  get reserve0(): BigDecimal {
    let value = this.get("reserve0");
    return value!.toBigDecimal();
  }

  set reserve0(value: BigDecimal) {
    this.set("reserve0", Value.fromBigDecimal(value));
  }

  get reserve1(): BigDecimal {
    let value = this.get("reserve1");
    return value!.toBigDecimal();
  }

  set reserve1(value: BigDecimal) {
    this.set("reserve1", Value.fromBigDecimal(value));
  }

  get reserveETH(): BigDecimal {
    let value = this.get("reserveETH");
    return value!.toBigDecimal();
  }

  set reserveETH(value: BigDecimal) {
    this.set("reserveETH", Value.fromBigDecimal(value));
  }

  get reserveUSD(): BigDecimal {
    let value = this.get("reserveUSD");
    return value!.toBigDecimal();
  }

  set reserveUSD(value: BigDecimal) {
    this.set("reserveUSD", Value.fromBigDecimal(value));
  }

  get trackedReserveETH(): BigDecimal {
    let value = this.get("trackedReserveETH");
    return value!.toBigDecimal();
  }

  set trackedReserveETH(value: BigDecimal) {
    this.set("trackedReserveETH", Value.fromBigDecimal(value));
  }

  get token0Price(): BigDecimal {
    let value = this.get("token0Price");
    return value!.toBigDecimal();
  }

  set token0Price(value: BigDecimal) {
    this.set("token0Price", Value.fromBigDecimal(value));
  }

  get token1Price(): BigDecimal {
    let value = this.get("token1Price");
    return value!.toBigDecimal();
  }

  set token1Price(value: BigDecimal) {
    this.set("token1Price", Value.fromBigDecimal(value));
  }

  get liquidityProviderCount(): BigInt {
    let value = this.get("liquidityProviderCount");
    return value!.toBigInt();
  }

  set liquidityProviderCount(value: BigInt) {
    this.set("liquidityProviderCount", Value.fromBigInt(value));
  }

  get isRewardPool(): boolean {
    let value = this.get("isRewardPool");
    return value!.toBoolean();
  }

  set isRewardPool(value: boolean) {
    this.set("isRewardPool", Value.fromBoolean(value));
  }

  get volumeUSD(): BigDecimal {
    let value = this.get("volumeUSD");
    return value!.toBigDecimal();
  }

  set volumeUSD(value: BigDecimal) {
    this.set("volumeUSD", Value.fromBigDecimal(value));
  }

  get volumeChart(): Array<string> {
    let value = this.get("volumeChart");
    return value!.toStringArray();
  }

  set volumeChart(value: Array<string>) {
    this.set("volumeChart", Value.fromStringArray(value));
  }

  get liquidityChart(): Array<string> {
    let value = this.get("liquidityChart");
    return value!.toStringArray();
  }

  set liquidityChart(value: Array<string>) {
    this.set("liquidityChart", Value.fromStringArray(value));
  }
}

export class PairVolumeChartItem extends Entity {
  constructor(id: string) {
    super();
    this.set("id", Value.fromString(id));

    this.set("timestamp", Value.fromBigInt(BigInt.zero()));
    this.set("valueUSD", Value.fromBigDecimal(BigDecimal.zero()));
  }

  save(): void {
    let id = this.get("id");
    assert(id != null, "Cannot save PairVolumeChartItem entity without an ID");
    if (id) {
      assert(
        id.kind == ValueKind.STRING,
        "Cannot save PairVolumeChartItem entity with non-string ID. " +
          'Considering using .toHex() to convert the "id" to a string.'
      );
      store.set("PairVolumeChartItem", id.toString(), this);
    }
  }

  static load(id: string): PairVolumeChartItem | null {
    return changetype<PairVolumeChartItem | null>(
      store.get("PairVolumeChartItem", id)
    );
  }

  get id(): string {
    let value = this.get("id");
    return value!.toString();
  }

  set id(value: string) {
    this.set("id", Value.fromString(value));
  }

  get timestamp(): BigInt {
    let value = this.get("timestamp");
    return value!.toBigInt();
  }

  set timestamp(value: BigInt) {
    this.set("timestamp", Value.fromBigInt(value));
  }

  get valueUSD(): BigDecimal {
    let value = this.get("valueUSD");
    return value!.toBigDecimal();
  }

  set valueUSD(value: BigDecimal) {
    this.set("valueUSD", Value.fromBigDecimal(value));
  }
}

export class LiquidityChartItem extends Entity {
  constructor(id: string) {
    super();
    this.set("id", Value.fromString(id));

    this.set("timestamp", Value.fromBigInt(BigInt.zero()));
    this.set("valueUSD", Value.fromBigDecimal(BigDecimal.zero()));
  }

  save(): void {
    let id = this.get("id");
    assert(id != null, "Cannot save LiquidityChartItem entity without an ID");
    if (id) {
      assert(
        id.kind == ValueKind.STRING,
        "Cannot save LiquidityChartItem entity with non-string ID. " +
          'Considering using .toHex() to convert the "id" to a string.'
      );
      store.set("LiquidityChartItem", id.toString(), this);
    }
  }

  static load(id: string): LiquidityChartItem | null {
    return changetype<LiquidityChartItem | null>(
      store.get("LiquidityChartItem", id)
    );
  }

  get id(): string {
    let value = this.get("id");
    return value!.toString();
  }

  set id(value: string) {
    this.set("id", Value.fromString(value));
  }

  get timestamp(): BigInt {
    let value = this.get("timestamp");
    return value!.toBigInt();
  }

  set timestamp(value: BigInt) {
    this.set("timestamp", Value.fromBigInt(value));
  }

  get valueUSD(): BigDecimal {
    let value = this.get("valueUSD");
    return value!.toBigDecimal();
  }

  set valueUSD(value: BigDecimal) {
    this.set("valueUSD", Value.fromBigDecimal(value));
  }
}

export class Token extends Entity {
  constructor(id: string) {
    super();
    this.set("id", Value.fromString(id));

    this.set("symbol", Value.fromString(""));
    this.set("name", Value.fromString(""));
    this.set("totalLiquidity", Value.fromBigDecimal(BigDecimal.zero()));
    this.set("decimals", Value.fromBigInt(BigInt.zero()));
    this.set("derivedETH", Value.fromBigDecimal(BigDecimal.zero()));
    this.set("priceUSD", Value.fromBigDecimal(BigDecimal.zero()));
    this.set("lineChartUSD", Value.fromStringArray(new Array(0)));
  }

  save(): void {
    let id = this.get("id");
    assert(id != null, "Cannot save Token entity without an ID");
    if (id) {
      assert(
        id.kind == ValueKind.STRING,
        "Cannot save Token entity with non-string ID. " +
          'Considering using .toHex() to convert the "id" to a string.'
      );
      store.set("Token", id.toString(), this);
    }
  }

  static load(id: string): Token | null {
    return changetype<Token | null>(store.get("Token", id));
  }

  get id(): string {
    let value = this.get("id");
    return value!.toString();
  }

  set id(value: string) {
    this.set("id", Value.fromString(value));
  }

  get symbol(): string {
    let value = this.get("symbol");
    return value!.toString();
  }

  set symbol(value: string) {
    this.set("symbol", Value.fromString(value));
  }

  get name(): string {
    let value = this.get("name");
    return value!.toString();
  }

  set name(value: string) {
    this.set("name", Value.fromString(value));
  }

  get totalLiquidity(): BigDecimal {
    let value = this.get("totalLiquidity");
    return value!.toBigDecimal();
  }

  set totalLiquidity(value: BigDecimal) {
    this.set("totalLiquidity", Value.fromBigDecimal(value));
  }

  get decimals(): BigInt {
    let value = this.get("decimals");
    return value!.toBigInt();
  }

  set decimals(value: BigInt) {
    this.set("decimals", Value.fromBigInt(value));
  }

  get derivedETH(): BigDecimal {
    let value = this.get("derivedETH");
    return value!.toBigDecimal();
  }

  set derivedETH(value: BigDecimal) {
    this.set("derivedETH", Value.fromBigDecimal(value));
  }

  get priceUSD(): BigDecimal {
    let value = this.get("priceUSD");
    return value!.toBigDecimal();
  }

  set priceUSD(value: BigDecimal) {
    this.set("priceUSD", Value.fromBigDecimal(value));
  }

  get isProtocolMain(): boolean {
    let value = this.get("isProtocolMain");
    return value!.toBoolean();
  }

  set isProtocolMain(value: boolean) {
    this.set("isProtocolMain", Value.fromBoolean(value));
  }

  get lineChartUSD(): Array<string> {
    let value = this.get("lineChartUSD");
    return value!.toStringArray();
  }

  set lineChartUSD(value: Array<string>) {
    this.set("lineChartUSD", Value.fromStringArray(value));
  }
}

export class TokenPriceLineItem extends Entity {
  constructor(id: string) {
    super();
    this.set("id", Value.fromString(id));

    this.set("timestamp", Value.fromBigInt(BigInt.zero()));
    this.set("valueUSD", Value.fromBigDecimal(BigDecimal.zero()));
  }

  save(): void {
    let id = this.get("id");
    assert(id != null, "Cannot save TokenPriceLineItem entity without an ID");
    if (id) {
      assert(
        id.kind == ValueKind.STRING,
        "Cannot save TokenPriceLineItem entity with non-string ID. " +
          'Considering using .toHex() to convert the "id" to a string.'
      );
      store.set("TokenPriceLineItem", id.toString(), this);
    }
  }

  static load(id: string): TokenPriceLineItem | null {
    return changetype<TokenPriceLineItem | null>(
      store.get("TokenPriceLineItem", id)
    );
  }

  get id(): string {
    let value = this.get("id");
    return value!.toString();
  }

  set id(value: string) {
    this.set("id", Value.fromString(value));
  }

  get timestamp(): BigInt {
    let value = this.get("timestamp");
    return value!.toBigInt();
  }

  set timestamp(value: BigInt) {
    this.set("timestamp", Value.fromBigInt(value));
  }

  get valueUSD(): BigDecimal {
    let value = this.get("valueUSD");
    return value!.toBigDecimal();
  }

  set valueUSD(value: BigDecimal) {
    this.set("valueUSD", Value.fromBigDecimal(value));
  }
}

export class Bundle extends Entity {
  constructor(id: string) {
    super();
    this.set("id", Value.fromString(id));

    this.set("ethPrice", Value.fromBigDecimal(BigDecimal.zero()));
  }

  save(): void {
    let id = this.get("id");
    assert(id != null, "Cannot save Bundle entity without an ID");
    if (id) {
      assert(
        id.kind == ValueKind.STRING,
        "Cannot save Bundle entity with non-string ID. " +
          'Considering using .toHex() to convert the "id" to a string.'
      );
      store.set("Bundle", id.toString(), this);
    }
  }

  static load(id: string): Bundle | null {
    return changetype<Bundle | null>(store.get("Bundle", id));
  }

  get id(): string {
    let value = this.get("id");
    return value!.toString();
  }

  set id(value: string) {
    this.set("id", Value.fromString(value));
  }

  get ethPrice(): BigDecimal {
    let value = this.get("ethPrice");
    return value!.toBigDecimal();
  }

  set ethPrice(value: BigDecimal) {
    this.set("ethPrice", Value.fromBigDecimal(value));
  }
}
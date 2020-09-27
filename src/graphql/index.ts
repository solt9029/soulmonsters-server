
/** ------------------------------------------------------
 * THIS FILE WAS AUTOMATICALLY GENERATED (DO NOT MODIFY)
 * -------------------------------------------------------
 */

/* tslint:disable */
/* eslint-disable */
export enum AttackActionType {
    ATTACK = "ATTACK"
}

export enum Attribute {
    RED = "RED",
    BLUE = "BLUE",
    WHITE = "WHITE",
    GREEN = "GREEN",
    PURPLE = "PURPLE",
    BLACK = "BLACK"
}

export enum BattlePosition {
    ATTACK = "ATTACK",
    DEFENCE = "DEFENCE"
}

export enum ChangeBattlePositionActionType {
    CHANGE_BATTLE_POSITION = "CHANGE_BATTLE_POSITION"
}

export enum FinishEndTimeActionType {
    FINISH_END_TIME = "FINISH_END_TIME"
}

export enum Kind {
    MONSTER = "MONSTER",
    CIRCLE_MONSTER = "CIRCLE_MONSTER",
    QUICK = "QUICK",
    BLOCK = "BLOCK"
}

export enum Phase {
    DRAW = "DRAW",
    ENERGY = "ENERGY",
    PUT = "PUT",
    SOMETHING = "SOMETHING",
    BATTLE = "BATTLE",
    END = "END"
}

export enum PutSoulActionType {
    PUT_SOUL = "PUT_SOUL"
}

export enum StartBattleTimeActionType {
    START_BATTLE_TIME = "START_BATTLE_TIME"
}

export enum StartDrawTimeActionType {
    START_DRAW_TIME = "START_DRAW_TIME"
}

export enum StartEndTimeActionType {
    START_END_TIME = "START_END_TIME"
}

export enum StartEnergyTimeActionType {
    START_ENERGY_TIME = "START_ENERGY_TIME"
}

export enum StartPutTimeActionType {
    START_PUT_TIME = "START_PUT_TIME"
}

export enum StartSomethingTimeActionType {
    START_SOMETHING_TIME = "START_SOMETHING_TIME"
}

export enum StateType {
    ATTACK_COUNT = "ATTACK_COUNT",
    PUT_SOUL_COUNT = "PUT_SOUL_COUNT",
    SELF_POWER_CHANGE = "SELF_POWER_CHANGE"
}

export enum SummonMonsterActionType {
    SUMMON_MONSTER = "SUMMON_MONSTER"
}

export enum Type {
    CIRCLE = "CIRCLE",
    TRIANGLE = "TRIANGLE",
    RECTANGLE = "RECTANGLE",
    WHITE_STAR = "WHITE_STAR",
    BLACK_STA = "BLACK_STA"
}

export enum UseSoulBarrierActionType {
    USE_SOUL_BARRIER = "USE_SOUL_BARRIER"
}

export enum UseSoulCanonActionType {
    USE_SOUL_CANON = "USE_SOUL_CANON"
}

export enum Zone {
    BATTLE = "BATTLE",
    DECK = "DECK",
    SOUL = "SOUL",
    MORGUE = "MORGUE",
    HAND = "HAND"
}

export class AttackActionDispatchInput {
    type: AttackActionType;
    payload: AttackActionPayload;
}

export class ChangeBattlePositionActionDispatchInput {
    type: ChangeBattlePositionActionType;
    payload: ChangeBattlePositionActionPayload;
}

export class DeckCardUpdateInput {
    deckId: number;
    cardId: number;
}

export class DeckCreateInput {
    name: string;
}

export class FinishEndTimeActionDispatchInput {
    type: FinishEndTimeActionType;
}

export class PutSoulActionDispatchInput {
    type: PutSoulActionType;
    payload: PutSoulActionPayload;
}

export class StartBattleTimeActionDispatchInput {
    type: StartBattleTimeActionType;
}

export class StartDrawTimeActionDispatchInput {
    type: StartDrawTimeActionType;
}

export class StartEndTimeActionDispatchInput {
    type: StartEndTimeActionType;
}

export class StartEnergyTimeActionDispatchInput {
    type: StartEnergyTimeActionType;
}

export class StartPutTimeActionDispatchInput {
    type: StartPutTimeActionType;
}

export class StartSomethingTimeActionDispatchInput {
    type: StartSomethingTimeActionType;
}

export class SummonMonsterActionDispatchInput {
    type: SummonMonsterActionType;
    payload: SummonMonsterActionPayload;
}

export class UseSoulBarrierActionDispatchInput {
    type: UseSoulBarrierActionType;
    payload: UseSoulBarrierActionPayload;
}

export class UseSoulCanonActionDispatchInput {
    type: UseSoulCanonActionType;
    payload: UseSoulCanonActionPayload;
}

export interface Node {
    id: number;
}

export class AttackActionPayload {
    gameCardId: number;
    targetGameCardId?: number;
    targetGameUserId?: number;
}

export class AttackActionTypeBox {
    value: AttackActionType;
}

export class Card implements Node {
    id: number;
    name: string;
    kind: Kind;
    type: Type;
    attribute?: Attribute;
    attack?: number;
    defence?: number;
    cost?: number;
    detail?: string;
    picture: string;
}

export class ChangeBattlePositionActionPayload {
    gameCardId: number;
}

export class ChangeBattlePositionActionTypeBox {
    value: ChangeBattlePositionActionType;
}

export class Deck implements Node {
    id: number;
    userId: string;
    name: string;
    createdAt: DateTime;
    updatedAt: DateTime;
}

export class DeckCard implements Node {
    id: number;
    count: number;
    deck: Deck;
    card: Card;
}

export class FinishEndTimeActionTypeBox {
    value: FinishEndTimeActionType;
}

export class Game implements Node {
    id: number;
    turnUserId?: string;
    phase?: Phase;
    winnerUserId?: string;
    startedAt?: DateTime;
    endedAt?: DateTime;
    gameUsers: GameUser[];
    gameCards: GameCard[];
    gameHistories: GameHistory[];
}

export class GameCard implements Node {
    id: number;
    originalUserId: string;
    currentUserId: string;
    zone: Zone;
    position: number;
    battlePosition?: BattlePosition;
    name?: string;
    kind?: Kind;
    type?: Type;
    attribute?: Attribute;
    attack?: number;
    defence?: number;
    cost?: number;
    detail?: string;
    card?: Card;
    actionTypes: ActionType[];
}

export class GameHistory implements Node {
    id: number;
    detail: string;
    createdAt: DateTime;
}

export class GameUser implements Node {
    id: number;
    userId: string;
    user: User;
    energy?: number;
    lifePoint: number;
    lastViewedAt?: DateTime;
    deck: Deck;
    game: Game;
    actionTypes: ActionType[];
}

export abstract class IMutation {
    abstract plusDeckCard(data: DeckCardUpdateInput): DeckCard | Promise<DeckCard>;

    abstract minusDeckCard(data: DeckCardUpdateInput): DeckCard | Promise<DeckCard>;

    abstract createDeck(data: DeckCreateInput): Deck | Promise<Deck>;

    abstract startGame(deckId: number): Game | Promise<Game>;

    abstract dispatchStartDrawTimeAction(id: number, data: StartDrawTimeActionDispatchInput): Game | Promise<Game>;

    abstract dispatchStartEnergyTimeAction(id: number, data: StartEnergyTimeActionDispatchInput): Game | Promise<Game>;

    abstract dispatchStartPutTimeAction(id: number, data: StartPutTimeActionDispatchInput): Game | Promise<Game>;

    abstract dispatchStartSomethingTimeAction(id: number, data: StartSomethingTimeActionDispatchInput): Game | Promise<Game>;

    abstract dispatchStartBattleTimeAction(id: number, data: StartBattleTimeActionDispatchInput): Game | Promise<Game>;

    abstract dispatchStartEndTimeAction(id: number, data: StartEndTimeActionDispatchInput): Game | Promise<Game>;

    abstract dispatchFinishEndTimeAction(id: number, data: FinishEndTimeActionDispatchInput): Game | Promise<Game>;

    abstract dispatchPutSoulAction(id: number, data: PutSoulActionDispatchInput): Game | Promise<Game>;

    abstract dispatchChangeBattlePositionAction(id: number, data: ChangeBattlePositionActionDispatchInput): Game | Promise<Game>;

    abstract dispatchUseSoulCanonAction(id: number, data: UseSoulCanonActionDispatchInput): Game | Promise<Game>;

    abstract dispatchSummonMonsterAction(id: number, data: SummonMonsterActionDispatchInput): Game | Promise<Game>;

    abstract dispatchAttackAction(id: number, data: AttackActionDispatchInput): Game | Promise<Game>;

    abstract dispatchUseSoulBarrierAction(id: number, data: UseSoulBarrierActionDispatchInput): Game | Promise<Game>;
}

export class PutSoulActionPayload {
    gameCardId: number;
}

export class PutSoulActionTypeBox {
    value: PutSoulActionType;
}

export abstract class IQuery {
    abstract cards(): Card[] | Promise<Card[]>;

    abstract deckCards(deckId: number): DeckCard[] | Promise<DeckCard[]>;

    abstract decks(): Deck[] | Promise<Deck[]>;

    abstract game(id: number): Game | Promise<Game>;

    abstract activeGameId(): number | Promise<number>;

    abstract gameHistories(gameId: number): GameHistory[] | Promise<GameHistory[]>;

    abstract userData(userId: string): UserData | Promise<UserData>;
}

export class StartBattleTimeActionTypeBox {
    value: StartBattleTimeActionType;
}

export class StartDrawTimeActionTypeBox {
    value: StartDrawTimeActionType;
}

export class StartEndTimeActionTypeBox {
    value: StartEndTimeActionType;
}

export class StartEnergyTimeActionTypeBox {
    value: StartEnergyTimeActionType;
}

export class StartPutTimeActionTypeBox {
    value: StartPutTimeActionType;
}

export class StartSomethingTimeActionTypeBox {
    value: StartSomethingTimeActionType;
}

export class SummonMonsterActionPayload {
    gameCardId: number;
}

export class SummonMonsterActionTypeBox {
    value: SummonMonsterActionType;
}

export class User {
    id: string;
    displayName?: string;
    photoURL?: string;
}

export class UserData implements Node {
    id: number;
    userId: string;
    winningCount: number;
    losingCount: number;
}

export class UseSoulBarrierActionPayload {
    costGameCardIds: number[];
}

export class UseSoulBarrierActionTypeBox {
    value: UseSoulBarrierActionType;
}

export class UseSoulCanonActionPayload {
    costGameCardIds: number[];
}

export class UseSoulCanonActionTypeBox {
    value: UseSoulCanonActionType;
}

export type DateTime = any;
export type ActionType = StartDrawTimeActionTypeBox | StartEnergyTimeActionTypeBox | StartPutTimeActionTypeBox | StartSomethingTimeActionTypeBox | StartBattleTimeActionTypeBox | StartEndTimeActionTypeBox | FinishEndTimeActionTypeBox | PutSoulActionTypeBox | ChangeBattlePositionActionTypeBox | UseSoulCanonActionTypeBox | SummonMonsterActionTypeBox | AttackActionTypeBox | UseSoulBarrierActionTypeBox;

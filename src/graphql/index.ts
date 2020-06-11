
/** ------------------------------------------------------
 * THIS FILE WAS AUTOMATICALLY GENERATED (DO NOT MODIFY)
 * -------------------------------------------------------
 */

/* tslint:disable */
/* eslint-disable */
export enum Action {
    START_DRAW_TIME = "START_DRAW_TIME",
    START_ENERGY_TIME = "START_ENERGY_TIME",
    START_PUT_TIME = "START_PUT_TIME",
    START_SOMETHING_TIME = "START_SOMETHING_TIME",
    START_BATTLE_TIME = "START_BATTLE_TIME",
    START_END_TIME = "START_END_TIME",
    PUT_SOUL = "PUT_SOUL",
    CHANGE_BATTLE_POSITION = "CHANGE_BATTLE_POSITION",
    USE_SOUL_CANON = "USE_SOUL_CANON",
    SUMMON_MONSTER = "SUMMON_MONSTER",
    ATTACK = "ATTACK",
    USE_SOUL_BARRIER = "USE_SOUL_BARRIER"
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

export enum Type {
    CIRCLE = "CIRCLE",
    TRIANGLE = "TRIANGLE",
    RECTANGLE = "RECTANGLE",
    WHITE_STAR = "WHITE_STAR",
    BLACK_STA = "BLACK_STA"
}

export enum Zone {
    BATTLE = "BATTLE",
    DECK = "DECK",
    SOUL = "SOUL",
    MORGUE = "MORGUE",
    HAND = "HAND"
}

export class DeckCardUpdateInput {
    deckId: number;
    cardId: number;
}

export class DeckCreateInput {
    name: string;
}

export interface Node {
    id: number;
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
    actions: Action[];
}

export class GameHistory implements Node {
    id: number;
    detail: string;
    createdAt: DateTime;
}

export class GameUser implements Node {
    id: number;
    userId: string;
    energy?: number;
    lifePoint: number;
    lastViewedAt?: DateTime;
    deck: Deck;
    game: Game;
    actions: Action[];
}

export abstract class IMutation {
    abstract plusDeckCard(data: DeckCardUpdateInput): DeckCard | Promise<DeckCard>;

    abstract minusDeckCard(data: DeckCardUpdateInput): DeckCard | Promise<DeckCard>;

    abstract createDeck(data: DeckCreateInput): Deck | Promise<Deck>;

    abstract startGame(deckId: number): Game | Promise<Game>;
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

export class UserData implements Node {
    id: number;
    userId: string;
    winningCount: number;
    losingCount: number;
}

export type DateTime = any;

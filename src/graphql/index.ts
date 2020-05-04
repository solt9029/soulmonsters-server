
/** ------------------------------------------------------
 * THIS FILE WAS AUTOMATICALLY GENERATED (DO NOT MODIFY)
 * -------------------------------------------------------
 */

/* tslint:disable */
/* eslint-disable */
export enum Attribute {
    RED = "RED",
    BLUE = "BLUE",
    WHITE = "WHITE",
    GREEN = "GREEN",
    PURPLE = "PURPLE",
    BLACK = "BLACK"
}

export enum Kind {
    MONSTER = "MONSTER",
    CIRCLE_MONSTER = "CIRCLE_MONSTER",
    QUICK = "QUICK",
    BLOCK = "BLOCK"
}

export enum Type {
    CIRCLE = "CIRCLE",
    TRIANGLE = "TRIANGLE",
    RECTANGLE = "RECTANGLE",
    WHITE_STAR = "WHITE_STAR",
    BLACK_STA = "BLACK_STA"
}

export class DeckCardCreateInput {
    deckId: string;
    cardId: string;
}

export class DeckCreateInput {
    name: string;
}

export interface Node {
    id: string;
}

export class Card implements Node {
    id: string;
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
    id: string;
    userId: string;
    name: string;
    createdAt: DateTime;
    updatedAt: DateTime;
}

export class DeckCard implements Node {
    id: string;
    count: number;
    deck: Deck;
    card: Card;
}

export abstract class IMutation {
    abstract upsertDeckCard(data: DeckCardCreateInput): DeckCard | Promise<DeckCard>;

    abstract createDeck(data: DeckCreateInput): Deck | Promise<Deck>;
}

export abstract class IQuery {
    abstract cards(): Card[] | Promise<Card[]>;

    abstract deckCards(deckId?: string): DeckCard[] | Promise<DeckCard[]>;

    abstract decks(): Deck[] | Promise<Deck[]>;
}

export type DateTime = any;

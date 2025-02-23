import type { Player } from "./Player";

export interface Card {
    sourceId: string,
    name: string,
    imageUris: string,
    quantity: number,
    power: number,
    toughness: number,
    allParts: Object[] | null,
    producedMana: Object | null,
    manaValue: number | null,
}

export interface GameCard extends Card {
    id: string,
    isRevealed: boolean,
    isFaceUp: boolean,
    isTapped: boolean,
    posX: number,
    posY: number,
    powerCounter: number,
    toughnessCounter: number,
}

export interface Token extends GameCard {
    referenceCard: GameCard
}
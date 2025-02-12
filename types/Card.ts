import type { Player } from "./Player";

export interface Card {
    id: string,
    name: string,
    imageUris: string,
    quantity: number,
    power: number;
    toughness: number;
}

export interface GameCard extends Card {
    isRevealed: boolean;
    isFaceUp: boolean;
    isTapped: boolean;
    posX: number;
    posY: number;
    powerCounter: number;
    toughnessCounter: number;
}
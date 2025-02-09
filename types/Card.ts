import type { Player } from "./Player";

export interface Card {
    id: string,
    name: string,
    imageUris: string,
    quantity: number,
}

export interface GameCard extends Card {
    isRevealed: boolean;
    isFaceUp: boolean;
    isTapped: boolean;
    posX: number;
    posY: number;
}
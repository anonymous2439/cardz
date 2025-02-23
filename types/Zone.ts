import type { GameCard } from "./Card"

export interface Zone {
    battlefield: GameCard[],
    graveyard: GameCard[],
    library: GameCard[],
    hand: GameCard[],
    exile: GameCard[],
    stack: GameCard[],
}

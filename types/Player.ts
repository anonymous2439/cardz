import type { Card } from "~/types/Card"
import type { Zone } from "./Zone"

export interface Player {
    id: string
    name: string
    cards: Card[]
    zone: Zone
}
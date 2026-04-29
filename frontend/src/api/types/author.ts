import type { Country } from "./country";

export interface Author {
    id: number;
    name: string;
    surname: string;
    country: Country;
}

import type { handleSearchResults } from "./lib/search-helpers";
export type SearchResultDataSet = ReturnType<typeof handleSearchResults>;



export type ExtFilterType = { type: "checkbox", count: number; label: string, value: boolean };

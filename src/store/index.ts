// import { createStore, StoreApi, UseBoundStore } from 'zustand'
// import { combine } from 'zustand/middleware'

// https://docs.pmnd.rs/zustand/guides/typescript#basic-usage
// const bearStore = createStore(
//   combine({ bears: 0 }, (set) => ({
//     increase: (by: number) => set((state) => ({ bears: state.bears + by })),
//   })),
// )

import type { SearchResultDataSet, ExtFilterType } from "../types";

import { create, StateCreator } from "zustand";
// import { createSearchResultSlice } from './searchResultSlice'
// import { createFilterSlice } from './filterSlice'

interface SearchResultSlice {
  searchResult: SearchResultDataSet;
  setSearchResult: (newResult: SearchResultDataSet) => void;
}

const createSearchResultSlice: StateCreator<SearchResultSlice> = (set) => ({
  searchResult: {
    result: [],
    resultByFile: [],
    summary: { paths: [], extensions: {} },
  },
  setSearchResult: (newResult) => set(() => ({ searchResult: newResult })), // replace it all
});

interface FilterSlice {
  filters: { extensions: ExtFilterType[], selectedExtensions: Set<string> };
  updateFilters: (selectedExtensions: Set<string>) => void;
  resetFiltersFromSearchResult: (searchResultExtensions: Record<string, number>) => void;
}

// WTF?
const createFilterSlice: StateCreator<FilterSlice & SearchResultSlice, [], [], FilterSlice> = (
  set,
) => ({
  filters: {
    extensions: [],
    selectedExtensions: new Set()
  },
  // FIXME: I don't love the relationship between summary.extensions and filters.extensions and those data shapes... very strange conversions
  updateFilters: (selectedExtensions) =>
    set((state) => ({
      filters: {
        selectedExtensions: new Set(selectedExtensions),
        extensions: generateExtensionsFilter(
          selectedExtensions,
          state.searchResult.summary.extensions,
        ),
      },
    })),
  resetFiltersFromSearchResult: (
    searchResultExtensions
  ) =>
    set(() => ({
      filters: {
        selectedExtensions: new Set(Object.keys(searchResultExtensions)),
        extensions: generateExtensionsFilter(new Set(Object.keys(searchResultExtensions)), searchResultExtensions),
      },
    })),
});

export const useBoundStore = create<SearchResultSlice & FilterSlice>()(
  (...a) => ({
    ...createSearchResultSlice(...a),
    ...createFilterSlice(...a),
  }),
);

// ------------ HELPERS

// by default just have them all be selected. If empty, assume '*'
function generateExtensionsFilter(
  selectedExtensions: Set<string>,
  extensionsSet: Record<string, number>,
) {

  const output: ExtFilterType[] = [];

  // FIXME: Use the summary so we can show all of them...
  Object.keys(extensionsSet).forEach((ext) => {
    const item: ExtFilterType = {
      type: "checkbox",
      count: extensionsSet[ext] as ExtFilterType["count"],
      label: ext,
      value: selectedExtensions.has(ext) // set to true if selected, to false if not
    };

    output.push(item);
  });

  return output;
}

// export const useBoundStore = create((...a) => ({
//   ...createBearSlice(...a),
//   ...createFishSlice(...a),
// }))

// const defaultSearchResultSet: SearchResultDataSet = {
//   result: [],
//   resultByFile: [],
//   summary: { paths: [], extensions: {} },
// }
//
//
// const searchResultStore = createStore(
//   combine({ ...defaultSearchResultSet }, (set) => ({
//     updateSearchResults: (data: SearchResultDataSet) => set(() => (data)),
//   })),
// )
//
//
// // allows us to use it in this file!!
// const filtersStore = createStore(
//   combine({ extensions: [] }, (set) => ({
//     updateSelectedExtensions: (selectedExtensions: string[]) => set((state) => ({ extensions: generateExtensionsFilter(selectedExtensions) })),
//   })),
// )

// const createSelectors = <S extends UseBoundStore<StoreApi<object>>>(
//   _store: S,
// ) => {
//   let store = _store as WithSelectors<typeof _store>
//   store.use = {}
//   for (let k of Object.keys(store.getState())) {
//     ; (store.use as any)[k] = () => store((s) => s[k as keyof typeof s])
//   }
//
//   return store
// }

// export const useSearchResultStore = createSelectors(searchResultStore);
// export const useFiltersStore = createSelectors(filtersStore);

// type WithSelectors<S> = S extends { getState: () => infer T }
//   ? S & { use: { [K in keyof T]: () => T[K] } }
//   : never
//

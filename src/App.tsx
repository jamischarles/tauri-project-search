


import { Fragment, useState } from "react";
import {
  Dialog,
  DialogPanel,
  Menu,
  MenuButton,
  MenuItem,
  MenuItems,
  Transition,
  TransitionChild,
} from "@headlessui/react";
import {
  Bars3Icon,
  // BellIcon,
  CalendarIcon,
  ChartPieIcon,
  // Cog6ToothIcon,
  DocumentDuplicateIcon,
  FolderIcon,
  HomeIcon,
  UsersIcon,
  // XMarkIcon,
} from "@heroicons/react/24/outline";


// import type { ResultByFileItem } from "./lib/search-helpers"

// tauri integrations
import { invoke } from '@tauri-apps/api/core';
import { readTextFile } from '@tauri-apps/plugin-fs';


// main components blocks to use on this page
import SearchBox from "./Search-box";
import Sidebar from "./Sidebar";
import ResultBlock from "./Result-block";
import Filters from "./Filters";
// helpers search
import { handleSearchResults } from "./lib/search-helpers";

import type { SearchResultDataSet } from "./types"

// store
// import { useFiltersStore, useSearchResultStore } from "./store/store"
import { useBoundStore } from "./store"


// const navigation = [
//   { name: "Dashboard", href: "#", icon: HomeIcon, current: true },
//   { name: "Team", href: "#", icon: UsersIcon, current: false },
//   { name: "Projects", href: "#", icon: FolderIcon, current: false },
//   { name: "Calendar", href: "#", icon: CalendarIcon, current: false },
//   { name: "Documents", href: "#", icon: DocumentDuplicateIcon, current: false },
//   { name: "Reports", href: "#", icon: ChartPieIcon, current: false },
// ];

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}


// FIXME: move this to search helpers?
async function submitSearchToRust(path: string, searchQuery: string) {
  // Invoke the command
  return await invoke('search_with_rg', { path, searchQuery });
}

const fileCache: Record<string, string> = {

}


// File permissions reading with dynamic scope
// https://github.com/tauri-apps/tauri/discussions/7850
async function getFileContent(path: string) {
  // check cache, and fallback to reading from disk if exists
  if (!fileCache[path]) {
    // if (await exists(path)) {
    fileCache[path] = await readTextFile(path);
    // } else {
    // throw new Error("filepath not found: " + path);
    // }
  }

  return fileCache[path];
}

export default function App() {
  // const [sidebarOpen, setSidebarOpen] = useState(false);

  // from zustand
  const searchResult: SearchResultDataSet = useBoundStore((state) => state.searchResult)
  const setSearchResult = useBoundStore((state) => state.setSearchResult)
  const resetFiltersFromSearchResult = useBoundStore((state) => state.resetFiltersFromSearchResult)

  // const [filters, updateFilters] = useState({ extensions: [] });
  const [selectedPath, updateSelectedPath] = useState("");

  // const [searchResult, updateSearchResult] = useState(defaultSearchResultSet)
  // const searchResult = useSearchResultStore.getState();

  async function performSearch(query: string) {
    const listStr: string = await submitSearchToRust(selectedPath, query) as string;

    // TODO: use zustand at this point?
    debugger;
    const data: SearchResultDataSet = handleSearchResults(listStr, selectedPath);
    setSearchResult(data);
    resetFiltersFromSearchResult(data.summary.extensions);
    // useFiltersStore.setState(Object.keys(data.summary.extensions));


    // updateSearchResult(data);


    console.log('data', data);
    // searchResult = data.result;
    // searchSummary = data.summary;

    // build out UI filter set from result set
    // TODO: LATER: try to persist between searches... with signals?
    // FIXME: Pull this out into helpers...
    // changeFilterSelection(data.summary.extensions);
  }



  // function onFilterSelectionChange(newValues) {
  //   const searchResultExtensions = searchResult.summary.extensions
  //
  //   const extensionsFilter = Object.keys(searchResultExtensions).map(extension => {
  //     // filter selected
  //     let isSelected = true;
  //     if (newValues && !newValues.includes(extension)) {
  //       isSelected = false;
  //     }
  //
  //     return {
  //       type: 'checkbox', count: searchResultExtensions[extension], label: extension, value: isSelected
  //     }
  //   })
  //
  //   updateFilters({ extensions: extensionsFilter })
  //
  // }


  function updateFolderSelection(path: string) {
    console.log('##path UPDATED', path)
    updateSelectedPath(path);

    invoke('update_path_scope_permissions', { path });
  }


  // nested structure
  // const results = [];


  // FIXME: extract into fn?
  // ENTER when begin, EXIT on end
  // or just EXIT and ENTER on "enter"
  // searchResult.results.forEach(result=>{
  //
  //     })

  console.log('###searchResult', searchResult)

  // onClick={() => setSidebarOpen(true)}
  return (
    <>
      <div>
        {/* Static sidebar for desktop */}
        <Sidebar paths={searchResult.summary.paths} />
        <div className="lg:pl-72">
          <div className="sticky top-0 z-40 flex h-16 shrink-0 items-center gap-x-4 border-b border-gray-200 bg-white px-4 shadow-sm sm:gap-x-6 sm:px-6 lg:px-8">
            <button
              type="button"
              className="-m-2.5 p-2.5 text-gray-700 lg:hidden"
            >
              <span className="sr-only">Open sidebar</span>
              <Bars3Icon className="h-6 w-6" aria-hidden="true" />
            </button>

            {/* Separator */}
            <div
              className="h-6 w-px bg-gray-900/10 lg:hidden"
              aria-hidden="true"
            />

            <SearchBox selectedPath={selectedPath} searchCb={performSearch} folderSelectedCb={updateFolderSelection} />
          </div>

          <main className="py-10">

            <Filters />


            {searchResult.resultByFile.map(result =>
              <ResultBlock data={result} getFileContent={getFileContent} />
            )}

          </main>
        </div>
      </div>
    </>
  );
}


// import { useState } from 'react'
// import reactLogo from './assets/react.svg'
// import './App.css'
//
//
// import { appDataDir } from '@tauri-apps/api/path';
// import { open } from '@tauri-apps/plugin-dialog';
// import { invoke } from '@tauri-apps/api/core';
//
// import { handleSearchResults, isFilteredOut } from "./lib/search-helpers";
//
// import { Button } from "@/components/ui/button"
//
//
// // FIXME: externalize this better
// async function submitSearchToRust(path: string, searchQuery: string) {
//   // Invoke the command
//   return await invoke('my_custom_command', { path, searchQuery });
// }
//
//
//
//
// // TODO: bind these to the UI controls. This should be state probably. yas
// // signals in react?
//
//
// async function search(folderPathToSearch: string, query: string, filters) {
//   // returns this weird format. One string that's \n delimited json single lines {}
//   const listStr = await submitSearchToRust(folderPathToSearch, query);
//   const data = handleSearchResults(listStr, folderPathToSearch);
//   const searchResult = data.result;
//   const searchSummary = data.summary;
//
//   // build out UI filter set from result set
//   // TODO: LATER: try to persist between searches... with signals?
//   filters.extensions = Object.keys(searchSummary.extensions).map(extension => {
//     return {
//       type: 'checkbox', label: extension, value: true
//     }
//
//
//   })
//
//
//   // debugger;
//   console.log('#filters', filters);
//   console.log('searchResult', data);
//
// }
//
//
// // choose a folder to search
// async function chooseFolder() {
//   const selected = await open({
//     directory: true,
//     multiple: false,
//     defaultPath: await appDataDir(), // TODO: Later can we default to last folder, or project root or something?
//   });
//
//   folderPathToSearch = selected;
//
// }
//
// // run();
//
//
// function App() {
//   const [count, setCount] = useState(0)
//
//
//   const [filters, updateFilters] = useState({ extensions: [] })
//
//   // UI-only filters to narrow down result set
//   // {type, label, value}
//   // let filters = ;
//
//
//   // TODO: create react component for filters
//
//   return (
//     <>
//       <div>
//         <a href="https://react.dev" target="_blank">
//           <img src={reactLogo} className="logo react" alt="React logo" />
//         </a>
//       </div>
//       <h1>Vite + React</h1>
//       <h1 className="text-3xl font-bold underline">
//         Hello world!
//       </h1>
//       <SearchBox />
//       <Filters filters={filters} />
//       <div className="card">
//         <button onClick={() => setCount((count) => count + 1)}>
//           count is {count}
//         </button>
//         <p>
//           Edit <code>src/App.tsx</code> and save to test HMR
//         </p>
//       </div>
//       <p className="read-the-docs">
//         Click on the Vite and React logos to learn more
//       </p>
//
//       <Button>Click me</Button>
//     </>
//   )
// }
//
//
// function Filters({ filters }) {
//
//   const extFilters = filters.extensions.map(ext => {
//
//     return (
//       <div>
//         <h4> Filters</h4>
//         <input type="checkbox" id="{ext.label}" name="{ext.label}" checked={ext.value} />
//         <label htmlFor={ext.label}>{ext.label} ({searchSummary.extensions[ext.label]})</label>
//       </div>
//     )
//
//   })
//
//   // < !--Represent state of filters... -->
//   // {#each filters.extensions as ext}
//   // {/each}
//
//   return (<div>
//     {extFilters}
//   </div>)
//
// }
//
// function SearchBox() {
//
//   return (<form class="row" onsubmit={search} >
//     <input id="greet-input" autocorrect="off" autocomplete="off" placeholder="Search string" value={query} />
//     <button type="submit">Search</button>
//   </form >)
// }



// import Link from "next/link"
import {
  Bell,
  CircleUser,
  Home,
  LineChart,
  Menu,
  Package,
  Package2,
  Search,
  ShoppingCart,
  Users,
} from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"

import Layout from "./Layout"

export function App() {
  return <Layout />
}




function Link() {
  return <a href=""></a>
}

export default App 

import {
  ChevronDownIcon,
  MagnifyingGlassIcon,
} from "@heroicons/react/20/solid";


import {
  FolderIcon,
} from "@heroicons/react/24/outline";


import {
  // Dialog,
  // DialogPanel,
  Menu,
  MenuButton,
  MenuItem,
  MenuItems,
  Transition,
  // TransitionChild,
} from "@headlessui/react";



const userNavigation = [
  { name: "Your profile", href: "#" },
  { name: "Sign out", href: "#" },
];


// FIXME: Move this to util file? or tauri utils? for tauri interop stuff?
import { appDataDir } from '@tauri-apps/api/path';
import { open } from '@tauri-apps/plugin-dialog';


async function chooseFolderWithDialog() {
  const selected = await open({
    directory: true,
    multiple: false,
    defaultPath: await appDataDir(), // TODO: Later can we default to last folder, or project root or something?
  });

  return selected;
}



export default function SearchBox({ searchCb, folderSelectedCb, selectedPath }) {
  function handleSearchFormSubmit(e: React.SyntheticEvent) {
    const form = e.target;
    console.log("submit", form.search.value); // search is a named field

    // make call to backend
    //
    // handle the result
    // pass up to PARENT state...
    searchCb(form.search.value);
    e.preventDefault();
  }

  async function handleFolderIconPress(e: React.SyntheticEvent) {
    const path = await chooseFolderWithDialog();
    folderSelectedCb(path);
    e.preventDefault();
  }

  return (
    <div className="flex flex-1 gap-x-4 self-stretch lg:gap-x-6">
      <form
        className="relative flex flex-1"
        action="#"
        method="GET"
        autoComplete="off"
        autoCorrect="off"
        onSubmit={handleSearchFormSubmit}
      >
        <label htmlFor="search-field" className="sr-only">
          Search
        </label>
        <MagnifyingGlassIcon
          className="pointer-events-none absolute inset-y-0 left-0 h-full w-5 text-gray-400"
          aria-hidden="true"
        />
        <input
          id="search-field"
          className="block h-full w-full border-0 py-0 pl-8 pr-0 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm"
          placeholder="Search..."
          type="search"
          name="search"
        />
      </form>
      <div className="flex items-center gap-x-4 lg:gap-x-6">
        <button
          onClick={handleFolderIconPress}
          type="button"
          className="inline-flex items-center gap-x-1.5 rounded-md bg-white px-2.5 py-1.5 text-sm font-semibold text-gray-400 shadow-sm hover:bg-gray-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-100"
        >
          <FolderIcon className="h-6 w-6" aria-hidden="true" />
          {selectedPath}
        </button>

        {/* Separator */}
        <div
          className="hidden lg:block lg:h-6 lg:w-px lg:bg-gray-900/10"
          aria-hidden="true"
        />

        {/* Profile dropdown */}
      </div>
    </div>
  );
}

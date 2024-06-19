import { Cog6ToothIcon } from "@heroicons/react/24/outline";
import { useBoundStore } from "./store";

// TODO: Clean this up...
function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

// className={classNames(
//   path.current
//     ? "bg-gray-800 text-white"
//     : "text-gray-400 hover:bg-gray-800 hover:text-white",
//   "group flex gap-x-3 rounded-md p-2 text-sm font-semibold leading-6",
// )}

export default function SideBar({ paths = [] }) {
  const extensionsToShow = useBoundStore(
    (state) => state.filters.selectedExtensions,
  );

  const pathList = paths.map((path: string, i) => {
    const ext = path.split('.').pop() ?? "";


    if (!extensionsToShow.has(ext)) {
      return null;
    }

    return (
      <li key={i}>
        <a
          href=""
          className="group flex gap-x-3 rounded-md p-2 text-sm font-semibold leading-6 text-gray-400 hover:bg-gray-800 hover:text-white"
        >
          {" "}
          {path}{" "}
        </a>
      </li>
    );
  });

  return (
    <div className="hidden lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:w-72 lg:flex-col">
      {/* Sidebar component, swap this element with another sidebar if you like */}
      <div className="flex grow flex-col gap-y-5 overflow-y-auto bg-gray-900 px-6 pb-4">
        <nav className="flex flex-1 flex-col mt-4">
          <ul role="list" className="flex flex-1 flex-col gap-y-7">
            <li>
              <ul role="list" className="-mx-2 space-y-1">
                {pathList}
              </ul>
            </li>
            <li className="mt-auto">
              <a
                href="#"
                className="group -mx-2 flex gap-x-3 rounded-md p-2 text-sm font-semibold leading-6 text-gray-400 hover:bg-gray-800 hover:text-white"
              >
                <Cog6ToothIcon
                  className="h-6 w-6 shrink-0"
                  aria-hidden="true"
                />
                Settings
              </a>
            </li>
          </ul>
        </nav>
      </div>
    </div>
  );
}

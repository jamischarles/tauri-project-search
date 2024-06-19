// import { Bold, Italic, Underline } from "lucide-react"

import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import { useBoundStore } from "./store"

export default function Filters({ }) {



  const exts = useBoundStore((state) => state.filters.extensions);
  const selectedExtensions = useBoundStore((state) => state.filters.selectedExtensions);
  const updateSelectedFilters = useBoundStore((state) => state.updateFilters);


  // const exts = useFiltersStore.getState().extensions;
  // const exts = useFiltersStore.use.extensions;
  // const exts = [];
  // console.log('exts', exts);
  // debugger;
  console.log('##exts', exts);
  // const exts = filters.extensions;

  // return array of items that pass the test
  // const selectedExtensions = exts.map(ext => {
  //   if (ext.value) {
  //     return ext.label;
  //   }
  //   return undefined
  // }).filter(item => item) // only return non nullish values


  return (
    <>
      <h3> Filters</h3>
      <ToggleGroup variant="outline" type="multiple"
        value={Array.from(selectedExtensions)}

        onValueChange={(value) => {
          // translate back to proper obj... todo: should this logic live somewhere else? 
          updateSelectedFilters(new Set(value));
        }}
      >
        {exts.map(ext =>
          <ToggleGroupItem value={ext.label} aria-label={`Toggle ${ext.label}`} >
            {ext.label}({ext.count})
          </ToggleGroupItem>
        )}

      </ToggleGroup >
    </>
  )
}






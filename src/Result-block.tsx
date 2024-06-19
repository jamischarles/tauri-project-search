import type { ResultByFileItem } from "./lib/search-helpers"
import { useBoundStore } from "./store"


// FIXME: any
export default function ResultBlock({ data, getFileContent }: { data: ResultByFileItem, getFileContent: (path: string) => Promise<string> }) {
  const path = data.path;


  const extensionsToShow = useBoundStore((state) => state.filters.selectedExtensions)


  async function showMoreContext(path: string) {
    const content = await getFileContent(path);
    console.log('fileContent', content);
  }


  if (!extensionsToShow.has(data.pathExt)) {
    return null;
  }


  return (

    <div className="px-4 sm:px-6 lg:px-8 my-8">
      <div className="rounded-lg border bg-card text-card-foreground shadow-sm" >
        <div className="flex flex-col p-6">
          <p className="text-sm text-muted-foreground">
            {path}
          </p>
        </div>



        {data.matches.map((match, i) => (
          <div key={i}>
            <hr className="h-px my-2 bg-gray-200 border-0 dark:bg-gray-700" />
            <button onClick={showMoreContext.bind(null, path)}>+</button>

            <div className="file-match-row p-2 px-4 font-mono pre-whitespace text-xs">
              <span className="text-gray-400">{match.data.line_number}:</span> <span dangerouslySetInnerHTML={{ __html: match.data.lines.tokenizedText }} />
            </div>
          </div>

        ))}

      </div>
    </div>
  );
}



/*
 *
        <div className="grid gap-6">
          <div className="grid gap-3">eee
            <label
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              htmlFor="name"
            >
              Name
            </label>
            <input
              type="text"
              className="flex h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 w-full"
              id="name"
              value="Gamer Gear Pro Controller"
            />
          </div>
          <div className="grid gap-3">
            <label
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              htmlFor="description"
            >
              Description
            </label>
            <textarea
              className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 min-h-32"
              id="description"
            >
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam
              auctor, nisl nec ultricies ultricies, nunc nisl ultricies nunc,
              nec ultricies nunc nisl nec nunc.
            </textarea>
          </div>
        </div>

        */

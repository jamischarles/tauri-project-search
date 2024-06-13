// FIXME: move this into a TS file for proper hinting
//
type ResultSetItem = ResultStartItem | ResultMatchItem | ResultEndItem;

type ResultStartItem = {
  type: "begin";
  data: {
    path: { text: string };
  };
};
type ResultEndItem = {
  type: "end";
  data: {
    binary_offset: null;
    line_number: number;
    path: { text: string };
    stats: Record<string, string>;
  };
};
type ResultMatchItem = {
  type: "match";
  data: {
    absolute_offset: number;
    line_number: number;
    lines: { text: string; tokenizedText?: string };
    path: { text: string };
    submatches: (
      | { end: number; start: number; match: { text: string } }
      | ""
    )[];
  };
};

type ReturnVal = {
  result: (ResultSetItem | string)[];
  summary: {
    paths: string[];
  };
};

type SearchSummaryType = {
  paths: Set<string>;
  extensions: Record<string, number>;
};

type FiltersObj = {
  extensions: {
    type: "checkbox";
    label: string;
    value: boolean;
  }[];
};

// pass in JSON string of \n rows of single result sets
// -> array of objects
export function handleSearchResults(
  listStr: String,
  searchPath: string,
): ReturnVal {
  const basePath = searchPath;

  const searchSummary: SearchSummaryType = {
    /** files with results */
    paths: new Set(),
    extensions: {},
  };

  console.log("###listStr", listStr);
  // result = JSON.parse(listStr)
  // console.log('###result', result);

  // FIXME: Consider doing this in rust, though TS seems fine place to do it for now...
  const result = listStr.split("\n").map((lineResultStr) => {
    if (lineResultStr) {
      const lineResult: ResultSetItem = JSON.parse(lineResultStr);
      console.log("JSON.parse(lineResult)", lineResult);

      if (lineResult.type === "begin") {
        const relativeFilePath = lineResult.data.path.text.replace(
          basePath,
          ".",
        );
        const ext = getExtension(relativeFilePath) ?? "";

        searchSummary.paths.add(relativeFilePath);

        // incrementExtCounts(ext, searchSummary.extensions)

        const extensionHash = searchSummary.extensions;
        // TS hack
        if (!extensionHash[ext + ""]) {
          extensionHash[ext + ""] = 0;
        }

        extensionHash[ext + ""]++;
      }

      if (lineResult.type === "match") {
        // turn text into array and inject the tokenized part in the middle
        const tokenizedText = [];
        const lineText = lineResult.data.lines.text;
        let pointerPos = 0;

        // debugger;
        // add <span class="inline-match"> on the match within the line
        lineResult.data.submatches.forEach((inlineResult) => {
          if (inlineResult === "") return;

          const start = inlineResult.start;
          const end = inlineResult.end;
          // const matchText = inlineResult.match.text;

          // pre-match text
          tokenizedText.push(lineText.substring(pointerPos, start));
          //match text
          // todo: use inline, or mark as global so the unused style doesn't get purged'
          tokenizedText.push(
            `<span class="inline-match">${lineText.substring(start, end)}</span>`,
          );
          // advance pointer
          pointerPos = end;
        });

        //remainder of non-matched text
        tokenizedText.push(lineText.substring(pointerPos));
        lineResult.data.lines.tokenizedText = tokenizedText.join("");
      }

      return lineResult;
    }

    return lineResultStr;
  }); // split str by newlines, then parse the json string

  //massage data a little

  return {
    result,
    summary: {
      ...searchSummary,
      paths: Array.from(searchSummary.paths),
    },
  };
}

export function isFilteredOut(path: string, filters: FiltersObj): boolean {
  // path of file in result set
  if (!path) return false;

  const ext = path.split('.').pop(); // last segment after `.`

  if (!ext) return false;


  // turn array to map.
  // FIXME: should this be offered by default?
  const extensionsAllowMap: Record<string, boolean> = {}

  // build up a hashmap
  filters?.extensions?.forEach(filter => {
    extensionsAllowMap[filter.label] = filter.value
  })


  // get extension from file (later use `.endsWith()?`)
  // negate, because the value reflects whether it's present or not.
  // FIXME: confusing?
  return !extensionsAllowMap[ext];


  // compare path against the applied filters

  // if (data.path.text)
  // return true;
}

// function incrementExtCounts(key: string, extensionHash) {
//   if (!extensionHash[key]) {
//     extensionHash[key] = 0;
//   }
//
//   extensionHash[key]++;
// }

// FIXME: get this from another library?
function getExtension(path: string): string | unknown {
  const filename = path.split("/").at(-1); // get last part of path

  return filename?.split(".").at(-1); // can we get last 2?
}

<script lang="ts">
  // import Greet from './lib/Greet.svelte'
  import { appDataDir } from '@tauri-apps/api/path';
  import { open } from '@tauri-apps/plugin-dialog';
  import { invoke } from '@tauri-apps/api/core';
  import {handleSearchResults} from "./lib/search-helpers";



  let folderPathToSearch = "";
    let query = "";
      let searchResult = "";
      let searchSummary = {
        paths: [],
        extensions: []
      };




 async function submitSearchToRust(path: string, searchQuery: string) {
   // Invoke the command
   return await invoke('my_custom_command', {path, searchQuery});
 }

export async function search() {
  // returns this weird format. One string that's \n delimited json single lines {}
  const listStr = await submitSearchToRust(folderPathToSearch, query);
  const data = handleSearchResults(listStr, folderPathToSearch);
  searchResult = data.result;
  searchSummary = data.summary;
  console.log('searchResult', data);

}


     // choose a folder to search
     async function selectFolder() {
       const selected = await open({
         directory: true,
         multiple: false,
         defaultPath: await appDataDir(), // TODO: Later can we default to last folder, or project root or something?
       });

       folderPathToSearch = selected;

     }

     // run();

</script>

<main class="container">
    <h1>Project Search</h1>

    <!-- TODO: fill with icon, then with selected folder, -->
    <div class='row' style="margin-bottom: 30px;">
      <button on:click={selectFolder}>Choose a folder</button>
      <label>Selected folder:</label>
      <p>{folderPathToSearch}</p>
    </div>


<div>
       <form class="row" on:submit|preventDefault={search}>
        <input id="greet-input" autocorrect="off" autocomplete="off" placeholder="Search string" bind:value={query} />
      <button type="submit">Search</button>
    </form>
    <p class="b"> Results for <code>{folderPathToSearch}</code></p>

    <h4>Summary</h4>
    {JSON.stringify(searchSummary)}

    <h4>Extensions</h4>
    {#each Object.keys(searchSummary.extensions) as ext}
        <div>
            <input type="checkbox" id="{ext}" name="{ext}" checked />
            <label for={ext}>{ext} ({searchSummary.extensions[ext]})</label>
        </div>
    {/each}

{#each searchResult as {type, data}}
  {#if type === "begin"}
    <h3 class="filename-title">{data.path.text.replace(folderPathToSearch, ".")}</h3>
    <hr class="start-file-match-block">
  {:else if type === "match"}
  <div class="match">
    <div class="left-col"></div>
    <div class="right-col">
        <strong>{data.line_number}:</strong>
        <code>{@html data.lines.tokenizedText}</code>
    </div>
  </div>
  {:else if type === "end"}

  {/if}


{/each}

</div>



</main>

<style>
  div {
  text-align: left;
  }


  .match {
    margin-bottom: 15px;
  }

  /* Mark this one as global*/
  :global(.inline-match) {
      /* background-color: #e8e8e8; */
      /* padding: 3px; */
      font-weight: bold;
  }

  .b {
    font-weight: bold;
  }

  .logo.vite:hover {
    filter: drop-shadow(0 0 2em #747bff);
  }

  .logo.svelte:hover {
    filter: drop-shadow(0 0 2em #ff3e00);
  }

  h3, .filename-title {
      margin-bottom: 0;
      margin-top: 30px;
  }

  h4 {
      margin-bottom: 0;
  }
</style>

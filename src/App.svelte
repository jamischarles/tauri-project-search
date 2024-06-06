  <script lang="ts">
    // import Greet from './lib/Greet.svelte'
    import { appDataDir } from '@tauri-apps/api/path';
    import { open } from '@tauri-apps/plugin-dialog';
    import { invoke } from '@tauri-apps/api/core';
    import {handleSearchResults, isFilteredOut } from "./lib/search-helpers";



    let folderPathToSearch = "";
    let query = "";
    let searchResult = "";
    // unfiltered result from rust
    let searchSummary = {
      paths: [],
      extensions: []
    };


    // UI-only filters to narrow down result set
    // {type, label, value}
    // ?: Use signals for this?
    // https://svelte.dev/blog/runes#signal-boost
    let filters = {extensions: []};



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

    // build out UI filter set from result set
    // TODO: LATER: try to persist between searches... with signals?
    filters.extensions = Object.keys(searchSummary.extensions).map(extension=> {
      return {
        type: 'checkbox', label:extension, value: true
      }

      
    })


    // debugger;
    console.log('#filters', filters);
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


      <h4>Filters</h4>
      <!-- Represent state of filters... -->
      {#each filters.extensions as ext}
          <div>
              <!-- <input type="{ext.type}" id="{ext.label}" name="{ext.label}" bind:checked={ext.value} /> -->
              <input type="checkbox" id="{ext.label}" name="{ext.label}" bind:checked={ext.value} />
              <label for={ext.label}>{ext.label} ({searchSummary.extensions[ext.label]})</label>
          </div>
      {/each}

<hr/>


      <h4>Summary</h4>
      <ul>
  {#each searchSummary.paths as path}

    {#if !isFilteredOut(path, filters) }
      <li>{path}</li>
    {/if}

  {/each}

    </ul>


{#each searchResult as {type, data}}

  {#if !isFilteredOut(data?.path?.text, filters) }
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

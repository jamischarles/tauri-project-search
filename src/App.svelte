<script lang="ts">
  // import Greet from './lib/Greet.svelte'
  import { appDataDir } from '@tauri-apps/api/path';
  import { open } from '@tauri-apps/plugin-dialog';
  import { invoke } from '@tauri-apps/api/core';



  let folderPathToSearch = "";
    let query = "";
      let result = "";



 async function submitSearchToRust(path: string, searchQuery: string) {
   // Invoke the command
   return await invoke('my_custom_command', {path, searchQuery});
 }

  async function search() {
    // returns this weird format. One string that's \n delimited json single lines {}
    const listStr = await submitSearchToRust(folderPathToSearch, query);
    console.log('###listStr', listStr);
    result = listStr.split('\n').map(JSON.parse); // split str by newlines, then parse the json string
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
        <input id="greet-input" placeholder="Search string" bind:value={query} />
      <button type="submit">Search</button>
    </form>
    <p class="b"> Results for <code>{folderPathToSearch}</code></p>

{#each result as {type, data}}
  {#if type === "begin"}
    <h3>{data.path.text}</h3>
    <hr class="start-file-match-block">
  {:else if type === "match"}
  <div class="match">
    <div class="left-col"></div>
    <div class="right-col"><strong>{data.line_number}:</strong> <code>{data.lines.text}</code></div>
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

  .b {
    font-weight: bold;
  }

  .logo.vite:hover {
    filter: drop-shadow(0 0 2em #747bff);
  }

  .logo.svelte:hover {
    filter: drop-shadow(0 0 2em #ff3e00);
  }
</style>

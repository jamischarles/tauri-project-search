import { Command } from '@tauri-apps/api/shell';

// Change to run ripgrep
export async function run(basePathToSearch, query = '') {


  // TODO: move this to an external file... 
  // https://tauri.app/v1/guides/building/sidecar
  // https://tauri.app/v1/guides/building/sidecar#running-it-from-javascript

  // alternatively, use `window.__TAURI__.shell.Command`
  // `binaries/my-sidecar` is the EXACT value specified on `tauri.conf.json > tauri > bundle > externalBin`

  const command = Command.sidecar('../binaries/ripgrep-13.0.0-x86_64-apple-darwin/rg', [
    "--json",
    query,
    basePathToSearch
  ]);
  const output = await command.execute();

  console.log('##output', output);
  console.log('output:out', output.stdout);
  console.log('output:err', output.stderr);

  // ripgrep result format:
  // https://docs.rs/grep-printer/0.1.0/grep_printer/struct.JSON.html
  return output.stderr || output.stdout;
}

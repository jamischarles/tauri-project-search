import { Command } from '@tauri-apps/api/shell';

// Change to run ripgrep
export async function run(query = '') {


  // TODO: move this to an external file... 
  // https://tauri.app/v1/guides/building/sidecar
  // https://tauri.app/v1/guides/building/sidecar#running-it-from-javascript

  // alternatively, use `window.__TAURI__.shell.Command`
  // `binaries/my-sidecar` is the EXACT value specified on `tauri.conf.json > tauri > bundle > externalBin`

  const command = Command.sidecar('../binaries/ripgrep-13.0.0-x86_64-apple-darwin/rg', [
    query,
    '.'
  ]);
  const output = await command.execute();

  console.log('##output', output);
  console.log('output:out', output.stdout);
  console.log('output:err', output.stderr);

  return output.stderr || output.stdout;
}

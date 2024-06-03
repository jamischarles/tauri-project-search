// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

// use git2::{
//     Diff, DiffBinary, DiffDelta, DiffHunk, DiffLine, Error, ErrorCode, Repository, StatusOptions,
//     SubmoduleIgnore,
// };
use std::env;
// use std::path::Path;
use std::str;

// new stuff
use std::{error::Error, ffi::OsString, io::IsTerminal};
// ripgrep crate
use {
    grep::{
        cli,                                    // not needed for us?
        printer::{ColorSpecs, StandardBuilder}, // not needed for us? or we can adjust?
        regex::RegexMatcher,
        searcher::{BinaryDetection, SearcherBuilder},
    },
    termcolor::ColorChoice, // not needed for us?
    walkdir::WalkDir,
};

// Learn more about Tauri commands at https://tauri.app/v1/guides/features/command
#[tauri::command]
fn greet(name: &str) -> String {
    format!("Hello, {}! You've been greeted from Rust!", name)
}

fn main() {
    let path = env::current_dir().unwrap(); // cwd is of THIS file
    println!("The current directory is {}", path.display());
    let project_root_path = &path.parent().unwrap();
    println!("project root:  {}", project_root_path.display());

    // open the repo in the current folder
    // FIXME: Better way to get the current git folder?
    // let repo = match Repository::open(project_root_path) {
    //     Ok(repo) => repo,
    //     Err(e) => panic!("failed to open: {}", e),
    // };

    // show_diff(&repo);

    // TODO: Allow us to specify and pass in
    // 1) search string
    // 2) starting path
    // 3) ignore pattern / options (maybe just options object) that we parse here...
    let result = match search("path", &["../".into()]) {
        Ok(result) => result,
        Err(e) => panic!("failed to search: {}", e),
    };

    println!("result:{:?}", result);

    tauri::Builder::default()
        .plugin(tauri_plugin_shell::init())
        .invoke_handler(tauri::generate_handler![greet])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}

// TODO: Move these into MODELs?
// fn show_diff(repo: &Repository) -> Result<(), Error> {
//     // this tells you the stats, and what files have changed...
//     let diff: Diff = repo.diff_index_to_workdir(None, None).unwrap();

//     // output stats for the diff
//     //  WORKS!!
//     println!("diff stats: {:?}", diff.stats());

//     println!("diff[0]: {:?}", diff.get_delta(0));

//     // println!("diff[0] print: {:?}", diff.print(git2::DiffFormat::Patch));

//     let delta: DiffDelta = diff.deltas().next().unwrap();
//     let delta1: DiffDelta = diff.deltas().next().unwrap();
//     // let delta: DiffDelta = diff.get_delta(0).unwrap();

//     // println!("delta0: {:?}", delta);
//     // println!("delta1: {:?}", delta1);

//     // println!("delta: {:?}", delta.old_file());

//     println!("\n-------FOR EACH ---------------->\n");

//     struct Delta_obj {
//         value: String,
//         val_type: String,
//     }

//     let mut output: Vec<(String, String)> = Vec::new();

//     let mut file_cb = |delta: DiffDelta, num: f32| {
//         println!("*forach-file_cb-delta: {:?}\n", delta); // stats with ID?
//         println!("*forach-file_cb-num: {:?}\n", delta); // stats with ID?

//         true
//     };

//     let binary_cb = |delta: DiffDelta, diff_bin: DiffBinary| {
//         println!("*forach-binary1: {:?}\n", delta); // stats with ID?
//                                                     // println!("*forach-binary2: {:?}", diffBin); // stats with ID?
//     };

//     let mut hunk_cb = |delta: DiffDelta, diff: DiffHunk| {
//         println!("*forach-hunk1: {:?}\n", delta);
//         println!("*forach-hunk2: {:?}\n", diff);
//         true
//     };

//     let mut line_cb = |delta: DiffDelta, diff_hunk: Option<DiffHunk>, diff_line: DiffLine| {
//         println!("*forach-line1: {:?}\n", delta);
//         println!("*forach-line2: {:?}\n", diff_hunk);
//         println!("*forach-line3: {:?}\n", diff_line);

//         let s = match str::from_utf8(diff_line.content()) {
//             Ok(v) => v,
//             Err(e) => panic!("Invalid UTF-8 sequence: {}", e),
//         };

//         let h = match str::from_utf8(diff_hunk.unwrap().header()) {
//             Ok(v) => v,
//             Err(e) => panic!("Invalid UTF-8 sequence: {}", e),
//         };

//         // println!("*line.content: {:?}", s);
//         output.push((String::from(s), String::from("addition")));

//         println!("*forach-line.content: {:?}\n", s);

//         println!("*forach-line.header: {:?}\n", h);
//         true
//     };

//     // file_cb: &mut (dyn FnMut(DiffDelta<'_>, f32) -> bool + '_),
//     //     binary_cb: Option<&mut (dyn FnMut(DiffDelta<'_>, DiffBinary<'_>) -> bool + '_)>,
//     //     hunk_cb: Option<&mut (dyn FnMut(DiffDelta<'_>, DiffHunk<'_>) -> bool + '_)>,
//     //     line_cb: Option<&mut (dyn FnMut(DiffDelta<'_>, Option<DiffHunk<'_>>, DiffLine<'_>) -> bool + '_)>

//     diff.foreach(&mut file_cb, None, Some(&mut hunk_cb), Some(&mut line_cb));
//     // diff.foreach(file_cb, binary_cb, hunk_cb, line_cb);

//     println!("####OUTPUT {:?}", output);

//     println!("\n----------------------->\n");

//     // let mut output = "";

//     // TODO: Fetch the iterator and iterate thorugh each diff changes...
//     // inline function fnMut
//     let cb = |delta: DiffDelta, hunk: Option<DiffHunk>, line: DiffLine| {
//         println!("*delta: {:?}", delta); // stats with ID?
//         println!("*hunk: {:?}", hunk);
//         println!("*line: {:?}", line);
//         println!("*line-offset: {:?}", line.content_offset());
//         println!("*line-num_lines: {:?}", line.num_lines());
//         println!("*line-num_origin: {:?}", line.origin());
//         println!("*line-num_origin_value: {:?}", line.origin_value());

//         println!("*diffOldFile: {:?}", delta.old_file());
//         println!("*diffNewFile: {:?}", delta.new_file());

//         let oid = delta.new_file().id();
//         let tree = repo.find_tree(oid);

//         // Q: Can I use this to create my own 2 blobs (not from files?). Just from in-memory stuff?!?
//         // repo.blob(data)

//         // println!("tree: {:?}", tree);

//         // Rust how to convert bytes to utf8
//         let s = match str::from_utf8(line.content()) {
//             Ok(v) => v,
//             Err(e) => panic!("Invalid UTF-8 sequence: {}", e),
//         };

//         println!("*line.content: {:?}", s);

//         return true;
//     };

//     // let printed = diff.print(git2::DiffFormat::Raw, print_diff_line);
//     // println!("PRINTED: {:?}", printed);

//     // diff.

//     // let printed = diff.print(git2::DiffFormat::Raw, cb);
//     // println!("PRINTED: {:?}", printed);

//     // io::stdout().write_all(blob.content()).unwrap();
//     //
//     // now lets get the diff between a file and workdir
//     // ?: Would this be a nice way to generate a diff between two buffers / lines w/o any other info?
//     // repo.diff_blobs(old_blob, old_as_path, new_blob, new_as_path, opts, file_cb, binary_cb, hunk_cb, line_cb)
//     //
//     // repo.diff

//     // ?: Is this kind of like resolving a promise?
//     Ok(())
// }

// TODO: don't spend longer than ONE day on this path. Don't get distracted. If CLI is simpler, go with that approach.
// path of least resistance!!!
fn search(pattern: &str, paths: &[OsString]) -> Result<(), Box<dyn Error>> {
    let matcher = RegexMatcher::new_line_matcher(&pattern)?;
    let mut searcher = SearcherBuilder::new()
        .binary_detection(BinaryDetection::quit(b'\x00'))
        .line_number(false)
        .build();
    let mut printer = StandardBuilder::new()
        .color_specs(ColorSpecs::default_with_color())
        .build(cli::stdout(if std::io::stdout().is_terminal() {
            ColorChoice::Auto
        } else {
            ColorChoice::Never
        }));

    for path in paths {
        for result in WalkDir::new(path) {
            let dent = match result {
                Ok(dent) => dent,
                Err(err) => {
                    eprintln!("{}", err);
                    continue;
                }
            };
            if !dent.file_type().is_file() {
                continue;
            }
            let result = searcher.search_path(
                &matcher,
                dent.path(),
                printer.sink_with_path(&matcher, dent.path()),
            );
            if let Err(err) = result {
                eprintln!("{}: {}", dent.path().display(), err);
            }
        }
    }
    Ok(())
}

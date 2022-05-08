//---IMPORT---//
import { watch } from 'node:fs';

import { paths } from "../config.js";
import compileStyles from "./compiler/styles.js";
import compileScripts from "./compiler/scripts.js";


//---VARIABLE---//
const DEVELOPMENT_MODE = process.argv.indexOf('--dev') >= 0;

//---MAIN---//
compileScripts(DEVELOPMENT_MODE);
compileStyles(DEVELOPMENT_MODE);

if(DEVELOPMENT_MODE)
    watch(paths.styles.src, {
        recursive: true,
    },
    (eventType, filename) => {
        compileStyles(DEVELOPMENT_MODE);
    });
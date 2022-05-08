import { basename, dirname } from 'node:path';
import { writeFile, existsSync, mkdirSync } from 'node:fs';
import sass from 'sass';

import { styles as stylesEntries } from "../../config.js";

const defaultSassOptions = {}
const developmentSassOptions = {
    ...defaultSassOptions,
    sourceMap: true,
    outputStyle: 'expanded',
};
const productionSassOptions = {
    ...defaultSassOptions,
    outputStyle: 'compressed',
};

/**
 * Compiles style files
 * @param {boolean} developmentMode 
 */
export default async function compileStyles(developmentMode){

    let sassOptions;
    if(developmentMode){
        sassOptions = { ...developmentSassOptions };
    }else{
        sassOptions = { ...productionSassOptions };
    }

    stylesEntries.forEach(async ({
        entry,
        outfile
    }) => {
        const filename = basename((outfile || 'undefined'), '.css');
        const foldername = dirname(outfile || 'undefined');

        if (!existsSync(foldername)){
            mkdirSync(foldername, { recursive: true });
        }
    
        const fileTimeLabel = `${filename}.css compiled in`;
        console.time(fileTimeLabel);
    
        try{
            const result = sass.renderSync({
                ...sassOptions,
                file: entry,
                outFile: outfile,
            });
    
            await writeFile(outfile, result.css, { flag: 'w+' }, (err) => {
                if (err) throw err;
            });

            if (result.map) {
                await writeFile(outfile + '.map', result.map.toString(), (err) => {
                    if (err) throw err;
                });
            }
    
            console.timeEnd(fileTimeLabel);
        } catch (err) {
            console.error(`ERROR: ${filename} compilation failed`);
            console.error(err);
        }
    });
}
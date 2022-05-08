import { basename } from 'node:path';
import esbuild from 'esbuild';

import { scripts as scriptsEntries } from "../../config.js";

const defaultESBuildOptions = {
    bundle: true,
    color: true,
    target: [
        'es2015',
    ],
};
const developmentESBuildOptions = {
    ...defaultESBuildOptions,
    sourcemap: true,
    watch: {
        onRebuild(error, result) {
          if (error) console.error('watch build failed:', error)
          else console.log('watch build succeeded:', result)
        },
    },
};
const productionESBuildOptions = {
    ...defaultESBuildOptions,
    minify: true,
    logLevel: 'warning',
};


/**
 * Compiles script files
 * @param {boolean} developmentMode 
 */
export default async function compileScripts(developmentMode){

    let esBuildOptions;
    if(developmentMode)
        esBuildOptions = { ...developmentESBuildOptions };
    else
        esBuildOptions = { ...productionESBuildOptions };

    scriptsEntries.forEach(async ({
        entries,
        outdir = '',
        outfile = ''
    }) => {
        const filename = basename(outdir || outfile || 'undefined');

        const timeLabel = `${filename} compiled in`;
        console.time(timeLabel);

        try {
            if (!outdir && !outfile) {
                throw new TypeError(
                    'Expected \'outdir\' or \'outfile\''
                );
            }

            await esbuild.build({
                ...esBuildOptions,
                entryPoints: entries,
                outdir,
                outfile,
            }).then(result => {
                if(developmentMode)
                    console.log('watching...');
            });

            console.log(`SUCCESS: ${filename} compiled`);
            console.timeEnd(timeLabel);

        } catch (err) {
            console.error(`ERROR: ${filename} compilation failed`);
            console.error(err);
        }
    });
}
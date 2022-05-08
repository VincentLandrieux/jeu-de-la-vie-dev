
const src = "./src";
const dest = "./assets";

export const paths = {
    src: src,
    dest: dest,
    styles: {
        src: `${src}/styles`,
        dest: `${dest}/styles`
    },
    scripts: {
        src: `${src}/scripts`,
        dest: `${dest}/scripts`
    },
};

export const scripts = [
    {
        entries: [
            `${paths.scripts.src}/app.js`,
        ],
        outfile: `${paths.scripts.dest}/app.js`,
    },
];

export const styles = [
    {
        entry: `${paths.styles.src}/main.scss`,
        outfile: `${paths.styles.dest}/main.css`,
    },
];
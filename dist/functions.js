export function regPars(search) {
    if (typeof search === "string") {
        let re = '';
        const arr = search.split(' ').filter(i => i !== '');
        arr.forEach((i, ind) => {
            re += '\(\\s\|\^\|\\.\|\\,\)' + i + '\(\\s\|\$\|\\.\|\\,\)';
            if (ind !== arr.length - 1) {
                re += '\|';
            }
        });
        return new RegExp(re);
    }
}

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
import { fileURLToPath } from 'url';
import { dirname } from 'path';
const __filename = fileURLToPath(import.meta.url);
export const __dirname = dirname(__filename);
export function dateFormat() {
    const date = new Date();
    const n = date.getDate();
    const g = date.getFullYear();
    const m = date.getMonth();
    const monthString = (d) => {
        switch (d) {
            case 0: {
                return 'Января';
            }
            case 1: {
                return 'Февраля';
            }
            case 2: {
                return 'Марта';
            }
            case 3: {
                return 'Апреля';
            }
            case 4: {
                return 'Мая';
            }
            case 5: {
                return 'Июня';
            }
            case 6: {
                return 'Июля';
            }
            case 7: {
                return 'Августа';
            }
            case 8: {
                return 'Сентября';
            }
            case 9: {
                return 'Октября';
            }
            case 10: {
                return 'Ноября';
            }
            case 11: {
                return 'Декабря';
            }
            default:
                return '';
        }
    };
    return `${n}  ${monthString(m)}  ${g}}`;
}

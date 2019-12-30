// convert ms to sec
export function toSec(ms) {
    return Math.floor(ms / 1000);
}

// convert ms to min
export function toMin(ms) {
    return Math.floor(ms / (60 * 1000));
}

// convert sec to ms
export function fromSec(s) {
    return s * 1000;
}

// convert min to ms
export function fromMin(m) {
    return m * 60 * 1000; 
}

// format ms as minutes:seconds
export function clockify(ms) {
    let minutes = toMin(ms);
    let seconds = toSec(ms) - minutes * 60;
    seconds = seconds < 10 ? '0' + seconds : seconds;
    minutes = minutes < 10 ? '0' + minutes : minutes;
    return minutes + ':' + seconds;
}

// format percent
export function toPercent(n, d) {
    return Math.floor(n / d * 100) + '%';
}

// format date
export function toDate(ms) {
    const date = new Date(ms);
    return date.toLocaleTimeString();
}
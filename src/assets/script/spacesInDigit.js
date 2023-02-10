export default function spacesInDigit(value) {
    let val = value.toString();
    if (+val) {
        return val.replace(/(\d{1,3}(?=(?:\d\d\d)+(?!\d)))/g, "$1" + ' ');;
    }
    else return value
}

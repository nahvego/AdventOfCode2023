function gcd(a, b) {
    if (b > a) {
        let temp = a;
        a = b;
        b = temp;
    }

    let r;
    do {
        r = a % b;
        a = b;
        b = r;
    } while (r !== 0);
    return a;
}
function lcm(a, b) {
    return a / gcd(a, b) * b;
}
function lcmMulti(...args) {
    let pLcm = 1;
    for (let i = 0; i < args.length; i++) {
        pLcm = lcm(pLcm, args[i]);
    }
    return pLcm;
}

function setCharAt(str, idx, char) {
    return str.substring(0, idx) + char + str.substring(idx + 1);
}

module.exports.gcd = gcd;
module.exports.lcm = lcm;
module.exports.lcmMulti = lcmMulti;
module.exports.setCharAt = setCharAt;
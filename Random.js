function RandomNumber(arr) {
    let num = Math.floor(Math.random() * arr.length)
    return num
}
module.exports = { RandomNumber };
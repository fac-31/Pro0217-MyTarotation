function RandomIndex(arr) {
    let num = Math.floor(Math.random() * arr.length)
    return arr[num]
}
module.exports = { RandomIndex };
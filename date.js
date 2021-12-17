exports.getdate = () => {
    const options =
    {
        weekday: 'long',
        day: 'numeric',
        month: 'long'
    }
    const today = new Date();

    const current = today.toLocaleDateString("en-US", options)
    return current;
}

exports.getday = () => {
    var options =
    {
        weekday: 'long',
    }
    var today = new Date();

    var current = today.toLocaleDateString("en-US", options)
    return current;
}

console.log(module.exports)
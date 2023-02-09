module.exports = function (days) {
    const dayMilliseconds = days * 24 * 60 * 60 * 1000;

    let currentDate = new Date();
    currentDate.setTime(currentDate.getTime() - dayMilliseconds);
    return currentDate;
};

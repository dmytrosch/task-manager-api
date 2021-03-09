function dateDiff(startDate, finishDate) {
  const date1 = new Date(startDate);
  const date2 = new Date(finishDate);
  const diff = Math.ceil(
    Math.abs(date2.getTime() - date1.getTime()) / (1000 * 3600 * 24),
  );

  return diff + 1;
}

module.exports = dateDiff;

function time(val) {
  let hours = Math.floor(val / 60);
  let mins = val - (hours * 60);
  return `${!hours ? '' : hours + ' hrs'} ${mins} min`;
}

module.exports = {
  time
};

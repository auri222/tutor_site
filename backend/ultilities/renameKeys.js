
const renameKeys = (keysMap, Obj) => Object.keys(Obj).reduce((acc, key) => ({
  ...acc,
  ...{[keysMap[key] || key] : Obj[key] }
}),
{}
);

module.exports = { renameKeys};
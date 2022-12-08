
const getPublicId = (url) => {
  const urlArray = url.split("/");
  const preset = urlArray[urlArray.length - 2];
  const id = urlArray[urlArray.length - 1].split(".")[0];
  const result = "" + preset + "/" + id;
  return result;
};

module.exports = {getPublicId}
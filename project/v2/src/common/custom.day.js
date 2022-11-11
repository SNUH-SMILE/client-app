export default (option, dayjsClass, dayjsFactory) => {
  // e.g. extend dayjs().format()
  const oldFormat = dayjsClass.prototype.format;
  dayjsClass.prototype.format = function (args = 'YYYYMMDD HHmmss') {
    // original format result
    const result = oldFormat.bind(this)(args);
    // return modified result
    return result;
  };
};

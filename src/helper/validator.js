exports.isEmptyStringOrUndefined = (input) => {
  if (!input || (typeof input === "string" && input === "")) return true;
  return false;
};

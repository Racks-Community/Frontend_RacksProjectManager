export const ObjectIsNotEmpty = (obj) => {
  if (obj !== null && obj !== undefined) return Object.keys(obj).length > 0;
};

export default ObjectIsNotEmpty;

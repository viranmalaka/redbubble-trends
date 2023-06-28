export const twoDigi = (a) => (a < 10 ? "0" + a : a);
export const getDate = (ms) => {
  const d = new Date(ms);
  return `${d.getFullYear()}-${twoDigi(d.getMonth() + 1)}-${twoDigi(
    d.getDate()
  )}`;
};

export const cleanLogText = (log) => {
  return log.replace(/\x1b\[[0-9;]*m/g, "||");
};

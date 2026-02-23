// Build dynamic title and subtitle
const getDynamicTitle = () => {
  const parts = [];

  if (practice && practice !== "all") {
    parts.push(practice);
  }

  if (region && region !== "all") {
    parts.push(region);
  }

  if (county && county !== "all") {
    parts.push(county);
  }

  if (parts.length === 0) {
    return defaultTitle;
  }

  return `${parts.join(" ")} ${defaultTitle}`;
};

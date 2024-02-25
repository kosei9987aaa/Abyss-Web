export const getSrcById = (idToGet: number) => {
  const iframeElement = document.getElementById(
    "sidetab" + idToGet
  ) as HTMLIFrameElement;

  if (iframeElement) {
    const documentUrl = iframeElement.contentDocument?.URL || "";
    return documentUrl;
  } else {
    return "";
  }
};

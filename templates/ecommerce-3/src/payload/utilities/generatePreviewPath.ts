export const generatePreviewPath = ({ path }: { path: string }) =>
  `/next/preview?path=${encodeURIComponent(path)}`

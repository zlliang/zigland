export const siteTitle = "Zigland"

export function getTitle(title?: string) {
  return title ? `${title} - ${siteTitle}` : siteTitle
}

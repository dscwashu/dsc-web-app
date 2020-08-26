import { BreadcrumbsItem } from "../types";

const isEqualBreadcrumbs = (
  a: BreadcrumbsItem[],
  b: BreadcrumbsItem[]
): boolean => {
  if (a.length !== b.length) return false;
  let match = true;
  for (let i = 0; i < a.length; i++) {
    if (a[i].text !== b[i].text || a[i].link !== b[i].link) {
      match = false;
    }
  }
  return match;
};
export default isEqualBreadcrumbs;

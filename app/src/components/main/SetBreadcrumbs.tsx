import React, { useEffect, useRef, useContext } from "react";
import isEqualBreadcrumbs from "../../utils/breadcrumbs";
import { MainLayoutContext } from "./MainLayout";
import { BreadcrumbsItem } from "../../types";

interface SetBreadcrumbsProps {
  items: BreadcrumbsItem[];
}

const SetBreadcrumbs: React.FC<SetBreadcrumbsProps> = ({ items, children }) => {
  const { setBreadcrumbs } = useContext(MainLayoutContext);
  const itemsRef = useRef<BreadcrumbsItem[]>([]);
  useEffect(() => {
    if (!isEqualBreadcrumbs(items, itemsRef.current)) {
      itemsRef.current = items;
      setBreadcrumbs(items);
    }
  }, [setBreadcrumbs, items]);
  return <React.Fragment>{children}</React.Fragment>;
};

export default SetBreadcrumbs;

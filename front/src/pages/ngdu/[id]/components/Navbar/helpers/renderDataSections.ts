import type { IGetNgduListTablesResponse } from "@/shared/api";

import { renderList } from "./renderList";

export const renderDataSections = (
  data: IGetNgduListTablesResponse["message"],
  onClick: (newItem: number) => void
) => {
  const sections = [];

  if (data.obj && data.obj.length > 0) {
    sections.push(renderList(data.obj, "ОБЪЕКТЫ", onClick));
  }

  if (data.plast && data.plast.length > 0) {
    sections.push(renderList(data.plast, "ПЛАСТЫ", onClick));
  }

  if (data.kust && data.kust.length > 0) {
    sections.push(renderList(data.kust, "КУСТЫ", onClick));
  }

  if (data.well && data.well.length > 0) {
    sections.push(renderList(data.well, "СКВАЖИНЫ", onClick));
  }

  if (data.ngdu && data.ngdu.length > 0) {
    sections.push(renderList(data.ngdu, "НГДУ", onClick));
  }

  if (data.mest && data.mest.length > 0) {
    sections.push(renderList(data.mest, "МЕСТОРОЖДЕНИЯ", onClick));
  }

  if (data.cdng && data.cdng.length > 0) {
    sections.push(renderList(data.cdng, "ЦДНГ", onClick));
  }

  return sections;
};

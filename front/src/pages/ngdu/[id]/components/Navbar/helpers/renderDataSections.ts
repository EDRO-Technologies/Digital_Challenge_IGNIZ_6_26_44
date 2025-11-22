import type { IGetNgduListTablesResponse } from "@/shared/api";

import { renderList } from "./renderList";

export const renderDataSections = (
  data: IGetNgduListTablesResponse["message"],
  onClick: (newItem: IObject) => void,
  topology: string
) => {
  const sections = [];

  if (data.obj && topology !== "organizational" && data.obj.length > 0) {
    sections.push(renderList(data.obj, "ОБЪЕКТЫ", onClick));
  }

  if (data.plast && topology !== "organizational" && data.plast.length > 0) {
    sections.push(renderList(data.plast, "ПЛАСТЫ", onClick));
  }

  if (data.kust && topology !== "geological" && data.kust.length > 0) {
    sections.push(renderList(data.kust, "КУСТЫ", onClick));
  }

  if (data.well && data.well.length > 0) {
    sections.push(renderList(data.well, "СКВАЖИНЫ", onClick));
  }

  if (data.ngdu && data.ngdu.length > 0) {
    sections.push(renderList(data.ngdu, "НГДУ", onClick));
  }

  if (data.mest && topology !== "organizational" && data.mest.length > 0) {
    sections.push(renderList(data.mest, "МЕСТОРОЖДЕНИЯ", onClick));
  }

  if (data.cdng && topology !== "geological" && data.cdng.length > 0) {
    sections.push(renderList(data.cdng, "ЦДНГ", onClick));
  }

  return sections;
};

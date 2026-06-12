export type CsvValue = string | number | boolean | null | undefined;

export function escapeCsvField(value: CsvValue): string {
  if (value === null || value === undefined) return "";
  const str = String(value);
  if (/[",\n\r]/.test(str)) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
}

export function toCsv(
  rows: Record<string, CsvValue>[],
  columns: { key: string; label: string }[],
): string {
  const header = columns.map((c) => escapeCsvField(c.label)).join(",");
  const body = rows
    .map((row) => columns.map((c) => escapeCsvField(row[c.key])).join(","))
    .join("\r\n");
  return `${header}\r\n${body}`;
}

export function downloadCsv(filename: string, csvString: string): void {
  const blob = new Blob(["﻿" + csvString], {
    type: "text/csv;charset=utf-8;",
  });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

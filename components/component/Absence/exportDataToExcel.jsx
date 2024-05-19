import * as XLSX from "xlsx";

export function exportDataToExcel(data, fileName) {
  data.unshift([
    "Last Name",
    "First Name",
    "Type d'absence",
    "Remarque",
    "Justification Url",
  ]);

  const wb = XLSX.utils.book_new();
  const ws = XLSX.utils.aoa_to_sheet(data);
  XLSX.utils.book_append_sheet(wb, ws, "Sheet1");
  XLSX.writeFile(wb, fileName);
}

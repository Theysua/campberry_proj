const xlsx = require('xlsx');

const workbook = xlsx.readFile('Copy of Copy of Campberry_Requirements.xlsx');
const sheetNameList = workbook.SheetNames;

for (const sheetName of sheetNameList) {
  console.log(`\n--- Sheet: ${sheetName} ---`);
  const jsonData = xlsx.utils.sheet_to_json(workbook.Sheets[sheetName], { defval: "" });
  for (const row of jsonData) {
    if (Object.keys(row).length > 0) {
      console.log(JSON.stringify(row));
    }
  }
}

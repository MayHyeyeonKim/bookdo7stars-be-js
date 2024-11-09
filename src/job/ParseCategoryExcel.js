import xlsx from 'xlsx';
import fs from 'fs';

// Read the Excel file
// const workbook = xlsx.readFile('aladin_Category_CID_20210927.xls');
const workbook = xlsx.readFile('./src/job/aladin_Category_CID_20210927.xls');

// Get the first sheet
const sheetName = workbook.SheetNames[0];
const worksheet = workbook.Sheets[sheetName];
const categoryMap = new Map();
categoryMap.set('국내도서', 0);
fs.appendFileSync('example.txt', `insert into categories (id,name) values ('0','국내도서');\n`);

// Extract the value
//1. insert query 만들기 Insert into category (id, name, parentid) values(id, name, parentid)
for (let i = 4; i <= 19589; i++) {
  const id = getCellValue('A' + i);
  let name = getCellValue('B' + i);
  if (typeof name === 'string' && name !== null) {
    name = name.replace("'", "'");
  } else {
    continue;
  }

  categoryMap.set(name, id);

  const parentId = findParentId(i); //
  if (parentId == null) continue;
  const content = `insert into categories (id,name,parent_id) values ('${id}','${name}','${parentId}');\n`;
  console.log(content);
  try {
    fs.appendFileSync('example.txt', content);
    console.log(`${i}가 파일에 추가되었습니다.`);
  } catch (err) {
    console.error('파일에 내용을 추가하는데 오류 발생:', err);
  }
}

function getCellValue(address) {
  const cell = worksheet[address];
  return cell ? cell.v : undefined;
}

function findParentId(row) {
  //h row부터 d row까지 찾아서 부모 이름 찾기
  const hValue = getCellValue('H' + row);
  const gValue = getCellValue('G' + row);
  const fValue = getCellValue('F' + row);
  const eValue = getCellValue('E' + row);
  const dValue = getCellValue('D' + row);
  const cValue = getCellValue('C' + row);
  if (hValue) return categoryMap.get(gValue);
  if (gValue) return categoryMap.get(fValue);
  if (fValue) return categoryMap.get(eValue);
  if (eValue) return categoryMap.get(dValue);
  if (dValue) return categoryMap.get(cValue);
  return null;
}

import * as XLSX from 'xlsx';
import { appendFileSync } from 'fs';

// Read the Excel file
const workbook = XLSX.default.readFile('C:\\Users\\hwang\\OneDrive\\Desktop\\aladin_Category_CID_20210927.xls');

// Get the first sheet
const sheetName = workbook.SheetNames[0];
const worksheet = workbook.Sheets[sheetName];
const categoryMap = new Map();
categoryMap.set('국내도서', [{ id: 0, currentPath: '국내도서' }]);
appendFileSync('example.txt', `insert into categories (id,name) values ('0','국내도서');\n`);

// Extract the value
//1. insert query 만들기 Insert into category (id, name, parentid) values(id, name, parentid)
const depth = ['D', 'E', 'F', 'G', 'H', 'I'];
//상위 카테고리부터 작업. 엑셀 파일들 행 순서가 뒤죽박죽이러다구 글쎄?
for (let idxDepth = 1; idxDepth < depth.length; idxDepth++) {
  for (let i = 4; i <= 4872; i++) {
    const depthPreviousCell = getCellValue(depth[idxDepth - 1] + i); //D
    const depthCell = getCellValue(depth[idxDepth] + i); //E

    //바로 이전 셀에 값이 있고 지금 셀이 빈셀이면 작업한다.
    if (!(depthPreviousCell != undefined && depthCell === undefined)) continue;

    const id = getCellValue('A' + i);
    let name = getCellValue('B' + i);

    if (typeof name === 'string' && name !== null) {
      name = name.replace("'", "''");
    } else {
      continue;
    }

    //만약 마더텅처럼 같은 name인데 id가 여러개일 경우 id와 각 경로 정보를 배열로 넣는다.
    if (categoryMap.has(name)) {
      categoryMap.get(name).push({ id: id, currentPath: getCurrentPathFromExcel(i) });
    } else {
      categoryMap.set(name, [{ id: id, currentPath: getCurrentPathFromExcel(i) }]);
    }

    const parentId = findParentId(i); //
    if (parentId == null) continue;
    const content = `insert into categories (id,name,parent_id) values ('${id}','${name}','${parentId}');\n`;
    console.log(content);
    try {
      appendFileSync('example.txt', content);
      console.log(`${i}가 파일에 추가되었습니다.`);
    } catch (err) {
      console.error('파일에 내용을 추가하는데 오류 발생:', err);
    }
  } //for
} //for

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

  let names = '';
  if (hValue) names = categoryMap.get(gValue);
  else if (gValue) names = categoryMap.get(fValue);
  else if (fValue) names = categoryMap.get(eValue);
  else if (eValue) names = categoryMap.get(dValue);
  else if (dValue) names = categoryMap.get(cValue);
  else;

  /*  마더텅,[
        {id:77048, currentPath: 국내도서고등학교참고서고등학교출판사별마더텅}
        ,{id:76753, currentPath: 국내도서중학교참고서중학교출판사별마더텅
        }
     ];
     */

  if (names.length == 1) return names[0].id;

  //부모가 마더텅처럼 id가 여러개인 경우.
  //현재 카테고리의 부모 경로를 구하고
  //마더텅들을 순회하면서 경로를 비교하여 일치하면 리턴
  const parentPath = getParentPathFromExcel(row);
  //영문법 3800제(중등):  국내도서중학교참고서중학교출판사별마더텅

  for (let name of names) {
    if (name.currentPath === parentPath) return name.id;
  }

  return null;
}

function getParentPathFromExcel(i) {
  let c = getCellValue('C' + i);
  if (!c) return '';
  let d = getCellValue('D' + i);
  if (!d) return '';
  let e = getCellValue('E' + i);
  if (!e) return c;
  let f = getCellValue('F' + i);
  if (!f) return c + d;
  let g = getCellValue('G' + i);
  if (!g) return c + d + e;
  let h = getCellValue('H' + i);
  if (!h) return c + d + e + f;
  return c + d + e + f + g;
}

function getCurrentPathFromExcel(i) {
  let c = getCellValue('C' + i);
  if (!c) return '';
  let d = getCellValue('D' + i);
  if (!d) return c;
  let e = getCellValue('E' + i);
  if (!e) return c + d;
  let f = getCellValue('F' + i);
  if (!f) return c + d + e;
  let g = getCellValue('G' + i);
  if (!g) return c + d + e + f;
  let h = getCellValue('H' + i);
  if (!h) return c + d + e + f + g;
  return c + d + e + f + g + h;
}

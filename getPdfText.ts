import { PdfReader } from "pdfreader";

let rows = {}; // indexed by y-position
let result = '';

function flushRows() {
  Object.keys(rows) // => array of y-positions (type: float)
    .sort((y1, y2) => parseFloat(y1) - parseFloat(y2)) // sort float positions
    .forEach((y) => result += (rows[y] || []).join(""));
  rows = {}; // clear rows for next page
}

interface dataEntryClone {
  [Property: string]: any
}

function returnPdfText(): Promise<string> {
  return new Promise((resolve, reject)=> {
    new PdfReader(null).parseFileItems("./1.pdf", (err, item: dataEntryClone) => {
      if (err) {
        console.error({ err });
      } else if (!item) {
        flushRows();
        resolve(result);
        // console.log("END OF FILE");
      } else if (item.page) {
        flushRows(); // print the rows of the previous page
        // console.log("PAGE:", item.page);
      } else if (item.text) {
        // accumulate text items into rows object, per line
        (rows[item.y] = rows[item.y] || []).push(item.text);
      }
    });
  })
}

export {
  returnPdfText
}

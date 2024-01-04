import field from "/src/field/consts.js"
export default class Chunk {
    cellCount = field.CELLCOUNT;
    cells = Array(field.CELLCOUNT).fill().map(() => Array(field.CELLCOUNT).fill(0));
    getCellCount() {
      return cellCount;
    }
}
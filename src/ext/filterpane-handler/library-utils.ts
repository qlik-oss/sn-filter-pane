import expandFieldList from './expand-field-list';

const copyArr = (arr) => arr.slice();

function getField(expression) {
  expression = expression.trim();
  if (expression.charAt(0) === '=') {
    expression = expression.substring(1);
    expression = expression.trim();
  }
  const lastIndex = expression.length - 1;
  if (expression.charAt(0) === '[' && expression.charAt(lastIndex) === ']') {
    expression = expression.substring(1, lastIndex);
    expression = expression.trim();
  }
  return expression;
}

function findField(name, fieldList) {
  const expandedList = expandFieldList(copyArr(fieldList));
  let i;
  let item;
  name = getField(name);
  if (expandedList) {
    for (i = 0; i < expandedList.length; i++) {
      item = expandedList[i];
      if (item.qName === name) {
        return item;
      }
    }
  }
  return null;
}

function findLibraryItem(id, masterItemList) {
  let i;
  let item;
  if (masterItemList) {
    for (i = 0; i < masterItemList.length; i++) {
      item = masterItemList[i];
      if (item.qInfo.qId === id) {
        return item;
      }
    }
  }
  return null;
}


export default {
  findField,
  findLibraryDimension: findLibraryItem,
};

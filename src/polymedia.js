const isDecimalNumber = (value) => {
  if (typeof(value) === "number") return true;

  return /^\d+$/.test(value);
};

const addSpacesEveryThreeDigits = (number) => {
  const parts = number.toString().split(".");
  parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, " ");

  return parts.join(".");
};

const beautifyNumber = (number) => {
  return addSpacesEveryThreeDigits(number);
};

/**
 * "Улучшает" табличные данные, а именно:
 * - Разбивает числа пробелами на каждые 3 цифры (`1234` → `1 234`)
 *
 * Примечания:
 * - *ВАЖНО* Ломает сортировку, для сохранения возможности сортировки следует воспользоваться `beautifyTable`
 * - Работает только с обычными таблицами, т.к. только они получают данные напрямую через переменную `w`
 * - Вызывать неоходимо до отрисовки таблицы, т.е. до вызова `TableRender`
 *
 * Пример использования:
 * ```
 * Polymedia.beautifyTableData(w);
 *
 * TableRender(
 *   ...
 * );
 * ```
 *
 * @param {object} w Переменная `w` (глобальная переменная виджета)
 * @return {undefined}
 */
export const beautifyTableData = (w) => {
  w.data.records.forEach(record => {
    Object.keys(record).forEach(key => {
      if (!key.startsWith("column ")) return;

      if (isDecimalNumber(record[key])) {
        record[key] = beautifyNumber(record[key]);
      }
    });
  });
};

/**
 * Раскрашивает строки таблицы в зависимости от значения в одном из столбцов
 *
 * Примечания:
 * - Вызывать неоходимо после отрисовки таблицы, т.е. после вызова `TableRender`
 *
 * Пример использования:
 * ```
 * TableRender(
 *   ...
 * );
 *
 * Polymedia.colorizeTableByValue(w, 1, function(value) {
 *   if (value >= 100) return "red";
 *   if (value >= 50) return "yellow";
 * });
 * ```
 *
 * @param {object} w Переменная `w` (глобальная переменная виджета)
 * @param {number} columnId идентификатор столбца, значения которого будут влиять на раскраску. Начинается с 0 для первого столбца таблицы
 * @param {function} valueToColor функция, возвращающая цвет для строки, принимающая значение в столбце с идентификатором `columnId`
 * @return {undefined}
 */
export const colorizeTableByValue = (w, columnId, valueToColor) => {
  $(`#table-${w.general.renderTo} tr`).each((_, tr) => {
    const value = $(tr).children(`td:nth-child(${columnId + 1})`).text();
    const color = valueToColor(value);

    if (color !== undefined) {
      $(tr).css("background-color", color);
    }
  });
};

/**
 * Заменяет значения в ячейках таблицы преобразуя их функцией `update`
 *
 * Примечания:
 * - Вызывать неоходимо после отрисовки таблицы, т.е. после вызова `TableRender`
 *
 * Пример использования:
 * ```
 * TableRender(
 *   ...
 * );
 *
 * Polymedia.updateTableValues(w, [1, 2], function(value) {
 *   return value * 2;
 * });
 * ```
 *
 * @param {object} w Переменная `w` (глобальная переменная виджета)
 * @param {number[]} columnIds идентификаторы столбцов, значения в которых будут преобразовываться. Начинается с 0 для первого столбца таблицы
 * @param {function} update функция, принимающая значение ячейки и возвращающая новое
 * @return {undefined}
 */
export const updateTableValues = (w, columnIds, update) => {
  // TODO: write tests
  $(`#table-${w.general.renderTo} tr`).each((_, tr) => {
    columnIds.forEach(columnId => {
      const cell = $(tr).children(`tr:nth-child(${columnId + 1})`);
      const value = cell.text();
      const newValue = update(value);

      if (newValue !== undefined) cell.text(newValue);
    });
  });
};

window.Polymedia = {
  beautifyTableData: beautifyTableData,
};

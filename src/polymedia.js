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
 * - Разбивает числа пробелами на каждые 3 цифры (`1234` -> `1 234`)
 *
 * Примечания:
 * - *ВАЖНО* Ломает сортировку
 * - Работает только с обычными таблицами, т.к. только они получают данные напрямую через переменную `w`
 * - Вызывать неоходимо до отрисовки таблицы, т.е. до вызова `TableRender`
 *
 * Пример использования:
 * ```
 * beautifyTableData(w);
 *
 * TableRender(
 *    ...
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
  $("#table-" + w.general.renderTo + " tr").each((_, tr) => {
    const value = $(tr).children("td:nth-child(" + (columnId + 1) + ")").text();
    const color = valueToColor(value);

    if (color !== undefined) {
      $(tr).css("background-color", color);
    }
  });
};

window.Polymedia = {
  beautifyTableData: beautifyTableData,
};

const isDecimalNumber = (value) => {
  if (typeof(value) === "number") return true;

  return /^\d+$/.test(value);
};

const addSpacesEvery3Digits = (number) => {
  var parts = number.toString().split(".");
  parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, " ");

  return parts.join(".");
};

const beautifyNumber = (number) => {
  return addSpacesEvery3Digits(number);
};

/**
 * "Улучшает" табличные данные:
 * - Разбивает числа пробелами на каждые 3 цифры (`1234` -> `1 234`)
 *
 * Работает только с обычными таблицами, т.к. только они получают данные напрямую через переменную `w`
 *
 * @param {object} w Переменная `w` (глобальная переменная виджета)
 * @return {undefined}
 */
const beautifyTableData = (w) => {
  w.data.records.forEach(record => {
    Object.keys(record).forEach(key => {
      if (!key.startsWith("column ")) return;

      if (isDecimalNumber(record[key])) {
        record[key] = beautifyNumber(record[key]);
      }
    });
  });
};

module.exports = {
  beautifyTableData: beautifyTableData,
};
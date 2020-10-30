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

const getRelativeDate = (date) => {
  const result = new Date();

  if (date === "today") {
    // pass
  } else if (date === "yesterday") {
    result.setDate(result.getDate() - 1);
  } else if (date === "tomorrow") {
    result.setDate(result.getDate() + 1);
  } else {
    console.error("Неизвестная относительная дата: " + date);
  }

  return result;
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
 * TableRender({
 *   ...
 * });
 * ```
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
 * TableRender({
 *   ...
 * });
 *
 * Polymedia.colorizeTableByValue(w, 1, function(value) {
 *   if (value >= 100) return "red";
 *   if (value >= 50) return "yellow";
 * });
 * ```
 *
 * @param {number} columnId Идентификатор столбца, значения которого будут влиять на раскраску. Начинается с 0 для первого столбца таблицы
 * @param {function} valueToColor Функция, возвращающая цвет для строки, принимающая значение в столбце с идентификатором `columnId`
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
 * TableRender({
 *   ...
 * });
 *
 * Polymedia.updateTableValues(w, [1, 2], function(value) {
 *   return value * 2;
 * });
 * ```
 *
 * @param {number[]} columnIds Идентификаторы столбцов, значения в которых будут преобразовываться. Начинается с 0 для первого столбца таблицы
 * @param {function} update Функция, принимающая значение ячейки и возвращающая новое
 */
export const updateTableValues = (w, columnIds, update) => {
  // TODO: write tests
  $(`#table-${w.general.renderTo} tr`).each((_, tr) => {
    columnIds.forEach(columnId => {
      const cell = $(tr).children(`td:nth-child(${columnId + 1})`);
      const value = cell.text();
      const newValue = update(value);

      if (newValue !== undefined) cell.text(newValue);
    });
  });
};

/*
 * "Улучшает" таблицу, а именно:
 * - Разбивает числа пробелами на каждые 3 цифры (`1234` → `1 234`)
 *
 * Примечания:
 * - Работает только с обычными таблицами, т.к. только они получают данные напрямую через переменную `w`
 * - Вызывать неоходимо после отрисовки таблицы, т.е. после вызова `TableRender`
 *
 * Пример использования:
 * ```
 * TableRender({
 *   ...
 * });
 *
 * Polymedia.beautifyTable(w, [0, 2, 3]);
 * ```
 *
 * @param {number[]} columnIds Список идентификаторов столбцов для улучшения. Нумерация начинается с 0
 */
export const beautifyTable = (w, columnIds) => {
  // TODO: write tests
  // TODO: determine columnIds automaticaly
  updateTableValues(w, columnIds, value => {
    if (isDecimalNumber(value)) {
      return addSpacesEveryThreeDigits(value);
    }
  });
};

/*
 * Переводит дату в строку. В качестве даты может принимать относительные строковые значения (`yesterday`, `today` и `tomorrow`)
 *
 * Пример использования:
 * ```
 * var today = Polymedia.formatDate("today", "DD-MM-YYYY")
 * ```
 *
 * @param {Date | string} date Дата. Абсолютная, объект класса `Date`, или относительная в виде строки (`yesterday`, `today` или `tomorrow`)
 * @param {string} format Строка формата, может содержать плейсхолдеры `DD`, `MM` и `YYYY`, которые будут заменены на день, месяц и год соответственно
 * @return {string} Исходная дата в виде строки в заданном формате
 */
export const formatDate = (date, format) => {
  // TODO: write tests
  if (typeof date === "string") {
    date = getRelativeDate(date);
  }

  const year = Intl.DateTimeFormat("en", { year: "numeric" }).format(date);
  const month = Intl.DateTimeFormat("en", { month: "2-digit" }).format(date);
  const day = Intl.DateTimeFormat("en", { day: "2-digit" }).format(date);

  return format
    .replace("YYYY", year)
    .replace("MM", month)
    .replace("DD", day);
};

/*
 * Устанавливает значение фильтра в зависимости от текста. В основном используется, чтобы установить значение фильтра при инициализации
 *
 * Примечания:
 * - Использовать можно только для установки значения самого фильтра
 * - Не работает на фильтре по датам (из-за ограничения платформы)
 * - Вызывать стоит до вызова `FilterRender`
 * - В случае, если необходимого значения в фильтре нет, он сбрасывается
 *
 * Пример использования:
 * ```
 * // Для установки определённого значения
 * Polymedia.setFilterValueByText(w, Polymedia.formatDate("yesterday", "YYYY-MM-DD"));
 * Polymedia.setFilterValueByText(w, Polymedia.formatDate("yesterday", "YYYY-MM-DD"));
 *
 * FilterRender({
 *   ...
 * });
 * ```
 *
 * @param {string} text Текст, в соответствии с которым нужно установить значение фильтра
 */
export const setFilterValueByText = (w, text) => {
  // TODO: write tests
  // TODO: check for correct usage (if widget is FilterRender)
  w.data.selected = [];
  w.data.data.forEach(row => {
    if (row.text === text) {
      w.data.selected.push(row);
    }
  });

  if (w.data.selected.length === 0) {
    console.error(`Не удалось найти значение с текстом "${text}" в фильтре. Фильтр будет сброшен`);
  }

  const ids = w.data.selected.map(row => [row.id]);
  visApi().setFilterSelectedValues(w.general.renderTo, ids);
};

/*
 * Связывает фильтр с мастер-фильтром. Если значение мастер-фильтра изменяется, то изменится также и значение этого фильтра.
 *
 * Примечания:
 * - Устанавливает значения из мастер-фильтра, даже если их нет в подчиненном фильтре
 * - Вызывать стоит после вызова `FilterRender`
 *
 * Пример использования:
 * ```
 * FilterRender({
 *   ...
 * });
 *
 * Polymedia.setMasterFilter(w, "263a817c471743fbb34dbcb589f92bd5");
 * ```
 *
 * @param {string} masterGuid GUID мастер-фильтра
 */
export const setMasterFilter = (w, masterGuid) => {
  // TODO: test
  const masterValues = visApi().getSelectedValues(masterGuid);
  visApi().setFilterSelectedValues(w.general.renderTo, masterValues);

  visApi().onSelectedValuesChangedListener(
    {
      widgetGuid: masterGuid,
      guid: `${w.general.renderTo}_slave_listener`,
    },
    ({selectedValues}) => {
      visApi().setFilterSelectedValues(w.general.renderTo, selectedValues);
    },
  );
};

/**
 * Удаляет стрелки сортировки в заголовке обычной таблицы.
 * Должна вызываться *до* вызова TableRender.
 * *ВАЖНО* Это не отключит саму сортировку при клике на заголовок, для этого нужно использовать метод `disableTableSorting`.
 */
export const removeTableSortingArrows = w => {
  w.data.columns.forEach(value => {
    value.sortable = false;
  });
};

/**
 * Отключает сортировку при клике на заголовки колонок в обычной таблице.
 * Должна вызываться *после* вызова TableRender.
 * *ВАЖНО* Это не уберёт стрелки из заголовков, для этого нужно использовать метод `removeTableSortingArrows`.
 */
export const disableTableSorting = w => {
  const table = $(`#table-{w.general.renderTo}`);
  const ths = table.find("thead > tr > th");

  ths.off("mouseup");
  ths.off("mousedown");
};

/**
 * Возвращает API-токен для ViQube API
 * Берёт используемый на дэшборде токен из глобальной переменной
 * или извлекает его из Session Storage (для новых версий).
 * 
 * @return {string} API-Токен ViQube
 */
export const getAccessToken = () => {
  // TODO: check if expired
  // TODO: write function to detect version instead
  // TODO: emit new token if can't get it from global variable or session storage
  // TODO: write tests
  // Для платформы младше 2.18
  if (typeof _accessToken !== "undefined") return _accessToken;
  
  // Для платформы старше 2.18
  let schema = document.location.protocol;
  let host = document.location.host;
  let key = `oidc.user:${schema}//${host}/idsrv:dashboard_viewer`;
  let userData = JSON.parse(sessionStorage.getItem(key));
  return userData.access_token;
};

window.Polymedia = {
  beautifyTableData,
  colorizeTableByValue,
  updateTableValues,
  beautifyTable,
  removeTableSortingArrows,
  disableTableSorting,
  
  setFilterValueByText,
  setMasterFilter,

  formatDate,
  getAccessToken,
};

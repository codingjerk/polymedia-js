import { beautifyTableData } from "../../src/polymedia.js";

describe("beautifyTable", () => {
  test("splits numeric values", () => {
    const fakeW = {
      data: {
        records: [
          {"recid": "0", "rowNames": ["Москва"], "column 0": 1200, "column 1": 2300400},
          {"recid": "1", "rowNames": ["Владивосток"], "column 0": 2300, "column 1": 3400500},
        ],
      },
    };

    beautifyTableData(fakeW);

    expect(fakeW.data.records[0]["column 0"]).toBe("1 200");
    expect(fakeW.data.records[0]["column 1"]).toBe("2 300 400");

    expect(fakeW.data.records[1]["column 0"]).toBe("2 300");
    expect(fakeW.data.records[1]["column 1"]).toBe("3 400 500");
  });
});

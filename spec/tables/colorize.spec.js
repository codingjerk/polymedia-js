import { colorizeTableByValue } from "../../src/polymedia.js";

describe("colorizeTableByValue", () => {
  test("sets background-color to valueToColor result", () => {
    const fakeW = {
      general: {
        renderTo: "anyid",
      },
    };

    const each = jest.fn(callback => {
      callback(0, "tr");
      callback(1, "tr");
    });
    const css = jest.fn();
    const text = jest.fn();
    const children = jest.fn(selector => ({
      text: text,
    }));
    const $ = jest.fn(selector => ({
      each: each,
      children: children,
      css: css,
    }));

    window.$ = $;
    colorizeTableByValue(fakeW, 1, value => "some color");

    expect(window.$.mock.calls.length).toBeGreaterThan(1);
    expect(each.mock.calls.length).toBe(1);
    expect(children.mock.calls.length).toBe(2);
    expect(css.mock.calls).toEqual([
      ["background-color", "some color"],
      ["background-color", "some color"],
    ]);
  });
});

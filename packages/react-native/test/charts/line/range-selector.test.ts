import { beforeEach, describe, expect, it, vi } from "vitest";
import type { GestureResponderEvent } from "react-native";
import type { ReactElement } from "react";
import { resolveChartViewportWindow } from "@chart-kit/core";

// Keep hook refs across controlled renders, while inspecting native responder props.
const hooks = vi.hoisted(() => ({
  refs: [] as { current: unknown }[],
  index: 0
}));
vi.mock("react", async () => ({
  ...(await vi.importActual<typeof import("react")>("react")),
  useRef: (value: unknown) =>
    (hooks.refs[hooks.index++] ??= { current: value }),
  useCallback: (fn: unknown) => fn
}));
vi.mock("react-native", () => ({ View: "View" }));
vi.mock("../../../src/charts/line/renderer", () => ({
  getLineChartRenderer: () =>
    Object.fromEntries(
      ["Group", "Path", "Rect", "Surface"].map((name) => [name, name])
    )
}));

import { LineChartRangeSelector } from "../../../src/charts/line/rangeSelector";
import { getRangeSelectorConfig } from "../../../src/charts/line/rangeSelectorConfig";
import type { LineChartModel } from "../../../src/charts/line/useChartModel";

type Handlers = {
  onResponderGrant: (event: GestureResponderEvent) => void;
  onResponderMove: (event: GestureResponderEvent) => void;
  onResponderRelease: () => void;
  onResponderTerminate: () => void;
};
const event = (locationX: number, pageX: number, identifier = 1) =>
  ({
    nativeEvent: { locationX, pageX, identifier: String(identifier) }
  }) as GestureResponderEvent;
const initial = resolveChartViewportWindow({
  itemCount: 120,
  startIndex: 20,
  endIndex: 60
});
const model = {
  interactionPoints: Array.from({ length: 120 }, (_, dataIndex) => ({
    dataIndex,
    x: dataIndex * 3
  })),
  boxes: { plot: { x: 0, y: 0, width: 357, height: 40 } },
  resolvedTheme: { axis: "black" },
  geometries: []
} as unknown as LineChartModel<Record<string, unknown>>;

function render(
  onViewportChange = vi.fn(),
  viewportWindow = initial,
  onGestureEnd = vi.fn()
) {
  hooks.index = 0;
  const tree = LineChartRangeSelector({
    config: getRangeSelectorConfig({
      visible: true,
      interactive: true,
      onGestureEnd
    }),
    dataLength: 120,
    isVisible: true,
    model,
    onViewportChange,
    preventBrowserSelection: vi.fn(),
    viewportWindow,
    width: 360
  }) as ReactElement<{ children: ReactElement<Handlers>[] }>;
  return tree.props.children[1]!.props;
}

beforeEach(() => {
  hooks.refs = [];
  hooks.index = 0;
});
describe("range selector native drag (#780)", () => {
  it("keeps movement monotonic when Android locationX jumps between touch targets", () => {
    const change = vi.fn();
    let handlers = render(change);
    handlers.onResponderGrant(event(120, 220));
    for (const [local, page] of [
      [15, 235],
      [270, 250],
      [30, 265],
      [8, 280]
    ]) {
      handlers.onResponderMove(event(local!, page!));
      const next = change.mock.lastCall![0];
      handlers = render(
        change,
        resolveChartViewportWindow({ itemCount: 120, ...next.viewport })
      );
    }
    expect(change.mock.calls.map(([e]) => e.startIndex)).toEqual([
      25, 30, 35, 40
    ]);
  });
  it("emits a return to the start even before controlled props catch up", () => {
    const change = vi.fn();
    const handlers = render(change);
    handlers.onResponderGrant(event(120, 220));
    handlers.onResponderMove(event(135, 235));
    handlers.onResponderMove(event(120, 220));
    expect(change.mock.calls.map(([e]) => e.startIndex)).toEqual([25, 20]);
  });
  it.each(["start", "end"])(
    "resizes the %s handle with a fixed opposite edge",
    (side) => {
      const change = vi.fn();
      const handlers = render(change);
      const x = side === "start" ? 60 : 177;
      handlers.onResponderGrant(event(x, x + 100));
      handlers.onResponderMove(event(2, x + 115));
      expect(change.mock.lastCall![0]).toMatchObject(
        side === "start"
          ? { startIndex: 25, endIndex: 60, interaction: "resizeStart" }
          : { startIndex: 20, endIndex: 65, interaction: "resizeEnd" }
      );
    }
  );
  it.each(["onResponderRelease", "onResponderTerminate"] as const)(
    "ends the drag on %s",
    (end) => {
      const change = vi.fn();
      const gestureEnd = vi.fn();
      const handlers = render(change, initial, gestureEnd);
      handlers.onResponderGrant(event(120, 220));
      handlers[end]();
      handlers.onResponderMove(event(160, 260));
      handlers[end]();
      expect(change).not.toHaveBeenCalled();
      expect(gestureEnd).toHaveBeenCalledTimes(1);
    }
  );
  it("ignores a second finger and invalid coordinates", () => {
    const change = vi.fn();
    const handlers = render(change);
    handlers.onResponderGrant(event(120, 220));
    handlers.onResponderMove(event(160, 260, 2));
    handlers.onResponderMove(event(160, Number.NaN));
    expect(change).not.toHaveBeenCalled();
  });
  it("clamps at both ends and ignores repeated points", () => {
    const change = vi.fn();
    const handlers = render(change);
    handlers.onResponderGrant(event(120, 220));
    handlers.onResponderMove(event(0, 2000));
    handlers.onResponderMove(event(20, 2000));
    handlers.onResponderMove(event(10, -2000));
    expect(change.mock.calls.map(([e]) => e.startIndex)).toEqual([80, 0]);
  });
});

import { create } from "zustand";
import type { TablebaseState, TablebaseActions } from "./tablebase/types";
import { initialTablebaseState } from "./tablebase/initial";
import { createTablebaseSlice } from "./tablebase/actions";
import { selectedKindOf, typedCardsOf, humanColorOf } from "./tablebase/selectors";

export type { TablebaseState };

export const useTablebaseStore = create<TablebaseState & TablebaseActions>()(
  (set, get) => ({
    ...initialTablebaseState,
    ...createTablebaseSlice(set, get),
  })
);

export { selectedKindOf, typedCardsOf, humanColorOf };

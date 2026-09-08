import { isLegalChessFen } from "./fen-legal";
import { pieceCount } from "./pieces";
import { fetchTablebase } from "./tablebase";
import { useTablebaseStore } from "@/stores/tablebase-store";

export async function lookupTablebase(queryFen: string) {
  const store = useTablebaseStore.getState();
  if (!isLegalChessFen(queryFen)) {
    store.setResult(null);
    store.setError("Illegal FEN: opponent is in check on the side to move");
    return;
  }
  if (pieceCount(queryFen) > 7) {
    store.setResult(null);
    store.setError("Tablebase supports at most 7 pieces — using local search");
    return;
  }
  store.setLoading(true);
  store.setError(null);
  try {
    const data = await fetchTablebase(queryFen);
    if (useTablebaseStore.getState().fen !== queryFen) return;
    useTablebaseStore.getState().setResult(data, queryFen);
  } catch (err: unknown) {
    if (useTablebaseStore.getState().fen !== queryFen) return;
    useTablebaseStore.setState({
      result: null,
      resultFen: null,
      error: err instanceof Error ? err.message : "Tablebase error",
    });
  } finally {
    if (useTablebaseStore.getState().fen === queryFen) {
      useTablebaseStore.getState().setLoading(false);
    }
  }
}

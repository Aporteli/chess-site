
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  collectRoutePathsFromTree,
  installPreviewHostBridge,
} from "@/lib/tablebase/preview-host-bridge";

export function PreviewHostBridge() {
  const router = useRouter();

  useEffect(() => {
    return installPreviewHostBridge({
      navigate: (path) => {
        router.push(path as string);
      },
      getRoutePaths: () => {
        return [];
      },
    });
  }, [router]);

  return null;
}

import { ResultsGrid } from "@/components/ResultsGrid";
import { SearchResult, TabKey } from "@/lib/types";

export function ResultsSection({
  tab,
  isLoading,
  result,
}: {
  tab: TabKey;
  isLoading: boolean;
  result?: SearchResult;
}) {
  // сам ResultsGrid уже показывает Skeleton/EmptyState и правильные карточки
  return <ResultsGrid result={result} isLoading={isLoading} />;
}
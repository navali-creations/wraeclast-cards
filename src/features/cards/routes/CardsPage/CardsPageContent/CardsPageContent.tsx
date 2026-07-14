import { PageHeader } from "../../../../../components/page-header/PageHeader/PageHeader";
import { CardsGrid } from "../../../components/CardsGrid/CardsGrid";
import { CardsPageActions } from "../CardsPageActions/CardsPageActions";
import { useCardsPageControlsContext } from "../CardsPageControlsContext";
import { CardsPageSubtitle } from "../CardsPageSubtitle/CardsPageSubtitle";

export function CardsPageContent() {
  const { filteredCards, hasError, isLoading } = useCardsPageControlsContext();

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <PageHeader
        title="Divination Cards"
        subtitle={<CardsPageSubtitle />}
        actions={<CardsPageActions />}
      />

      <div className="mt-3 flex min-h-0 flex-1 flex-col bg-primary-content">
        <div className="mx-auto flex min-h-0 w-full max-w-300 flex-1 flex-col px-4 py-6">
          <CardsGrid
            data={filteredCards}
            hasError={hasError}
            isLoading={isLoading}
          />
        </div>
      </div>
    </div>
  );
}

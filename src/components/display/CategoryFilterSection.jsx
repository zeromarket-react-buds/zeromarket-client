import CategorySelector from "@/components/product/create/CategorySelector";

const CategoryFilterSection = ({
  categoryFocusRef,
  selectedLevel1Id,
  selectedLevel2Id,
  selectedLevel3Id,
  setSelectedLevel1Id,
  setSelectedLevel2Id,
  setSelectedLevel3Id,
  setTempCategoryName,
}) => {
  return (
    <div className="flex flex-col gap-4">
      <div className="text-base font-semibold border-b border-brand-mediumgray py-2">
        카테고리
      </div>

      <div ref={categoryFocusRef} tabIndex={0} className="-mt-4">
        <CategorySelector
          showTitle={false}
          value={{
            depth1: selectedLevel1Id,
            depth2: selectedLevel2Id,
            depth3: selectedLevel3Id,
          }}
          onChange={(c1, c2, c3, labels) => {
            setSelectedLevel1Id(c1);
            setSelectedLevel2Id(c2);
            setSelectedLevel3Id(c3);

            // UI용 이름
            const name = labels?.level3Name;
            setTempCategoryName(name || null);
          }}
        />
      </div>
    </div>
  );
};

export default CategoryFilterSection;

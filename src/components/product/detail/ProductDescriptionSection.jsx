const ProductDescriptionSection = ({ description }) => {
  return (
    <div className="mb-4">
      <div className=" font-semibold mb-2">설명</div>
      <p className="whitespace-pre-line">{description}</p>
    </div>
  );
};

export default ProductDescriptionSection;

const ProductStatusSection = ({ status }) => {
  return (
    <div className="flex justify-between items-center my-5 w-full border rounded-lg px-3 py-2 text-sm">
      <span>상품상태</span>
      <span>{status?.description}</span>
    </div>
  );
};

export default ProductStatusSection;

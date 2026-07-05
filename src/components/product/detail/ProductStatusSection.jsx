const ProductStatusSection = ({ status }) => {
  return (
    <div className=" my-5 text-sm  ">
      <div className="flex justify-between mb-4">
        <span className="font-semibold">상품상태</span>
        <div>{status?.description}</div>
      </div>
    </div>
  );
};

export default ProductStatusSection;

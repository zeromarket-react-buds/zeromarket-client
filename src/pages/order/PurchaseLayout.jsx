import { Outlet, useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { getProductDetailApi } from "@/common/api/product.api";

export default function PurchaseLayout() {
  const { productId } = useParams(); // purchase/:productId
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;

    const fetchProduct = async () => {
      try {
        setLoading(true);
        const data = await getProductDetailApi(productId);
        if (cancelled) return;

        // 상품 상태 1차 검증
        const status = data.salesStatus.name;
        const BLOCKED_STATUS = ["RESERVED", "SOLD_OUT"];
        const isForSale = status === "FOR_SALE";

        if (!isForSale || BLOCKED_STATUS.includes(status)) {
          navigate(`/products/${productId}`, { replace: true });
          return;
        }

        setProduct(data);
      } catch (err) {
        if (!cancelled) {
          setError(err.message);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    fetchProduct();

    return () => {
      cancelled = true;
    };
  }, [productId, navigate]);

  if (loading) {
    return (
      <div className="max-w-md mx-auto p-4">
        <p className="text-sm text-gray-500">
          상품 정보를 불러오는 중입니다...
        </p>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="max-w-md mx-auto p-4 space-y-4">
        <p className="text-sm text-red-500">상품 정보를 불러오지 못했습니다.</p>
        <button className="text-sm underline" onClick={() => navigate(-1)}>
          뒤로 가기
        </button>
      </div>
    );
  }

  return (
    <Outlet
      context={{
        product,
      }}
    />
  );
}

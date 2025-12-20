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
    // canceled(또는 abort 플래그)는 “이 요청이 더 이상 유효하지 않음”을 나타냅니다.
    let cancelled = false;

    const fetchProduct = async () => {
      try {
        setLoading(true);
        const data = await getProductDetailApi(productId);
        if (!cancelled) {
          setProduct(data);
        }
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
  }, [productId]);

  if (loading) {
    return (
      <div className="max-w-md mx-auto p-4">
        <p className="text-sm text-gray-500">상품 정보를 불러오는 중...</p>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="max-w-md mx-auto p-4 space-y-4">
        <p className="text-sm text-red-500">상품 정보를 불러오지 못했어요.</p>
        <button className="text-sm underline" onClick={() => navigate(-1)}>
          이전 페이지로
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

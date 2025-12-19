import { Outlet, useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { getProductDetailApi } from "@/common/api/product.api";

/**
 * PurchaseLayout
 * - 구매 흐름 전용 layout
 * - product 단 1회 조회
 * - 하위 페이지에서 useOutletContext()로 사용
 */
export default function PurchaseLayout() {
  const { productId } = useParams();
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

        // console.log(data);

        if (!cancelled) {
          setProduct(data);
        }
      } catch (err) {
        if (!cancelled) {
          setError(err.message);

          console.log(err);
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

  /* ---------- 상태별 처리 ---------- */

  if (loading) {
    return (
      <div className="max-w-md mx-auto p-4">
        <p className="text-sm text-gray-500">상품 정보를 불러오는 중…</p>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="max-w-md mx-auto p-4 space-y-4">
        <p className="text-sm text-red-500">상품 정보를 불러올 수 없습니다.</p>
        <button className="text-sm underline" onClick={() => navigate(-1)}>
          이전 페이지로
        </button>
      </div>
    );
  }

  /* ---------- 정상 ---------- */
  return (
    <Outlet
      context={{
        product,
      }}
    />
  );
}

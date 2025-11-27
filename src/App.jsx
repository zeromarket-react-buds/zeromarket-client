import { GlobalToast } from "@/components/GlobalToast";
import LoginPage from "@/pages/auth/LoginPage";
import SignupPage from "@/pages/auth/SignupPage";
import MyPage from "@/pages/me/MyPage";
import { AuthProvider } from "@/hooks/AuthContext";
import MySalesPage from "@/pages/me/MySalesPage";
import MyPurchasesPage from "@/pages/me/MyPurchasesPage";
import SellerShopPage from "./pages/sellershop/SellerShop";
import { MoreVertical } from "lucide-react"; //SellerShop 상단 선택창
import MyPageLayout from "./layouts/MyPageLayout";

const router = createBrowserRouter([
  {
    path: "/",
    element: <GlobalLayout />,
    children: [
      { index: true, element: <Home /> },
      {
        path: "search",
        element: <SearchPage />,
      },
      {
        path: "search",
        element: <SearchPage />,
      },
      {
        path: "search",
        element: <SearchPage />,
      },
      {
        path: "boards",
        children: [
          {
            index: true,
            element: <Boards />,
          },
          {
            path: ":id",
            element: <Board />,
          },
          {
            path: "edit",
            children: [
              { index: true, element: <BoardEdit /> },
              {
                path: ":id",
                element: <BoardEdit />,
              },
            ],
          },
        ],
      },

      {
        path: "products",
        children: [
          {
            index: true,
            element: <ProductDetailPage />,
          },
          {
            path: ":id",
            element: <ProductDetailPage />,
          },
          {
            path: "edit",
            children: [
              { index: true, element: <ProductDetailPage /> },
              {
                path: ":id",
                element: <ProductDetailPage />,
              },
            ],
          },
        ],
      },

      {
        path: "me",

        element: <MyPageLayout />,
        children: [
          {
            index: true,
            element: <MyPage />,
            handle: {
              layout: {
                header: {
                  component: "TitleHeader",
                  props: {
                    title: "마이페이지",
                  },
                },
                footer: {
                  component: "DefaultFooter",
                },
              },
            },
          },
          {
            path: "selling",
            element: <MySalesPage />,
            handle: {
              layout: {
                header: {
                  component: "TitleHeader",
                  props: {
                    title: "나의 판매내역",
                    hideRight: true,
                  },
                },
                footer: {
                  component: "DefaultFooter",
                },
              },
            },
          },
          {
            path: "purchases",
            element: <MyPurchasesPage />,
            handle: {
              layout: {
                header: {
                  component: "TitleHeader",
                  props: {
                    title: "나의 구매내역",
                    hideRight: true,
                  },
                },
                footer: {
                  component: "DefaultFooter",
                },
              },
            },
          },
        ],
      },
    ],
  },
]);

const App = function () {
  const [count, setCount] = useState(0);

  return (
    <Suspense fallback={<div className="p-6">로딩중…</div>}>
      <RouterProvider router={router} />
    </Suspense>
  );
};

export default App;

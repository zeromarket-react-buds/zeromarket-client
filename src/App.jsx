import React, { Suspense, lazy } from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import RootLayout from "@/layouts/RootLayout";
import { useState } from "react";
import Boards from "@/pages/Boards";
import Board from "@/pages/Board";
import BoardEdit from "@/pages/BoardEdit";
import Home from "./pages/Home";
import SearchPage from "@/pages/search/SearchPage";
import ProductCreatePage from "@/pages/products/ProductCreatePage";
import ProductDetailPage from "@/pages/products/ProductDetailPage";
import ProductEditPage from "@/pages/products/ProductEditPage";
import { GlobalToast } from "@/components/GlobalToast";
import LoginPage from "@/pages/auth/LoginPage";
import SignupPage from "@/pages/auth/SignupPage";
import MyPage from "@/pages/me/MyPage";
import { AuthProvider } from "@/hooks/AuthContext";
import MySalesPage from "@/pages/order/MySalesPage";
import MyPurchasesPage from "@/pages/order/MyPurchasesPage";
import SellerShopPage from "./pages/sellershop/SellerShop";
import { MoreVertical } from "lucide-react"; //SellerShop 상단 선택창
import MyPageLayout from "@/layouts/MyPageLayout";
import MyProfile from "./pages/me/MyProfile";
import TradeDetailPage from "@/pages/order/TradeDetailPage";

const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    handle: {
      layout: {
        header: {
          component: "DefaultHeader",
        },
        footer: {
          component: "DefaultFooter",
        },
      },
    },
    children: [
      { index: true, element: <Home /> },
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
            element: <ProductCreatePage />,
            handle: {
              layout: {
                header: {
                  component: "ProductHeader",
                  props: { type: "register" },
                },
                footer: {
                  component: null,
                },
              },
            },
          },
          {
            path: ":id",
            element: <ProductDetailPage />,
            handle: {
              layout: {
                header: {
                  component: "ProductHeader",
                  props: { type: "detail" },
                },
                footer: {
                  component: "DefaultFooter",
                },
              },
            },
          },
          {
            path: "edit/:id",
            element: <ProductEditPage />,
            handle: {
              layout: {
                header: {
                  component: "ProductHeader",
                  props: { type: "edit" },
                },
                footer: {
                  component: null,
                },
              },
            },
          },
        ],
      },

      // auth (로그인)
      {
        path: "auth",
        children: [
          {
            path: "login",
            element: <LoginPage />,
          },
        ],
      },

      // 회원가입 (/join)
      {
        path: "join",
        element: <SignupPage />,
        handle: {
          layout: {
            header: {
              component: "TitleHeader",
              props: { type: "detail", title: "회원가입" },
            },
            footer: {
              component: "DefaultFooter",
            },
          },
        },
      },

      // 마이페이지 라우트
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
          {
            path: "profile",
            element: <MyProfile />,
            handle: {
              layout: {
                header: {
                  component: "TitleHeader",
                  props: {
                    title: "프로필 설정",
                    showBack: true, // 뒤로가기 버튼 표시
                    rightButtonText: "완료",
                    rightButtonEvent: "save-profile", // 이벤트 키 전달
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

      // 마이페이지 - 거래내역
      {
        path: ":tradeid",
        element: <MyPageLayout />,
        children: [
          {
            index: true,
            element: <TradeDetailPage />,
            handle: {
              layout: {
                header: {
                  component: "TitleHeader",
                  props: {
                    title: "거래내역 상세",
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

      // 셀러샵 페이지 라우터
      {
        path: "sellershop",
        element: <SellerShopPage />,
        handle: {
          layout: {
            header: {
              component: "TitleHeader",
              props: {
                title: "셀러 샵",
                rightSlot: (
                  <MoreVertical
                    size={24}
                    className="cursor-pointer"
                    onClick={() => {
                      // 셀러샵에서 커스텀 이벤트 발생
                      window.dispatchEvent(new CustomEvent("seller-menu-open"));
                    }}
                  />
                ),
              },
            },
            footer: {
              component: "DefaultFooter",
            },
          },
        },
      }, //
    ],
  },
]);

const App = function () {
  const [count, setCount] = useState(0);

  return (
    <Suspense fallback={<div className="p-6">로딩중…</div>}>
      <AuthProvider>
        <GlobalToast />
        <RouterProvider router={router} />
      </AuthProvider>
    </Suspense>
  );
};

export default App;

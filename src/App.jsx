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
import { GlobalToast } from "@/components/GlobalToast";
import LoginPage from "@/pages/auth/LoginPage";
import SignupPage from "@/pages/auth/SignupPage";
import MyPage from "@/pages/me/MyPage";
import { AuthProvider } from "@/hooks/AuthContext";
import MySalesPage from "@/pages/me/MySalesPage";
import MyPurchasesPage from "@/pages/me/MyPurchasesPage";
import SellerShopPage from "./pages/sellershop/SellerShop";

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
                  component: "DefaultFooter",
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
            path: "edit",
            // ProductEditPage
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
        element: <MyPage />,
        handle: {
          layout: {
            header: {
              component: "TitleHeader",
              props: { title: "마이페이지" },
            },
            footer: {
              component: "DefaultFooter",
            },
          },
        },
        children: [
          {
            path: "selling",
            element: <MySalesPage />,
            handle: {
              layout: {
                header: {
                  component: "TitleHeader",
                  props: { title: "나의 판매내역" },
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
                  props: { title: "나의 구매내역" },
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
              props: { title: "셀러 샵" },
            },
            footer: {
              component: "DefaultFooter",
            },
          },
        },
      },
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

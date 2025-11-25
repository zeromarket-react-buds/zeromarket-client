import React, { Suspense, lazy } from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import GlobalLayout from "@/layouts/GlobalLayout";
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
import MyPage from "./pages/me/MyPage";
import MySalesPage from "./pages/me/MySalesPage";
import MyPurchasesPage from "./pages/me/MyPurchasesPage";
import { AuthProvider } from "@/hooks/AuthContext";

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
          },
          {
            path: ":id",
            element: <ProductDetailPage />,
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
      {
        path: "auth",
        children: [
          {
            path: "login",
            element: <LoginPage />,
          },
          {
            path: "signup",
            element: <SignupPage />,
          },
        ],
      },
      // 마이페이지 라우트
      {
        path: "me",
        children: [
          { index: true, element: <MyPage /> },
          {
            path: "selling",
            element: <MySalesPage />,
          },
          {
            path: "purchases",
            element: <MyPurchasesPage />,
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
      <AuthProvider>
        <GlobalToast />
        <RouterProvider router={router} />
      </AuthProvider>
    </Suspense>
  );
};

export default App;

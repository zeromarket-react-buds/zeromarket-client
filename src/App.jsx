import React, { Suspense, lazy } from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import GlobalLayout from "@/layouts/GlobalLayout";
import { useState } from "react";
import Boards from "@/pages/Boards";
import Board from "@/pages/Board";
import BoardEdit from "@/pages/BoardEdit";
import Home from "./pages/Home";

const router = createBrowserRouter([
  {
    path: "/",
    element: <GlobalLayout />,
    children: [
      { index: true, element: <Home /> },
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

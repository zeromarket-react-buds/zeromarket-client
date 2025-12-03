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
import { MoreVertical } from "lucide-react"; //SellerShop 상단 선택창 //확인필요
import MyPageLayout from "@/layouts/MyPageLayout";
import MyProfile from "./pages/me/MyProfile";
import TradeDetailPage from "@/pages/order/TradeDetailPage";
import MyProfileEditPage from "./pages/me/MyProfileEditPage";
import MyNotificationsPage from "@/pages/me/MyNotificationsPage";
import MyWishListPage from "./pages/me/MyWishListPage";
import ChatListPage from "./pages/chat/ChatListPage";
import ChatRoomPage from "./pages/chat/ChatRoomPage";
import ReviewCreatePage from "@/pages/review/ReviewCreatePage";
import ReviewDetailPage from "@/pages/review/ReviewDetailPage";

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

      // chats(채팅)
      {
        path: "chats",
        children: [
          {
            index: true,
            element: <ChatListPage />,
            // API: GET /api/chats
            handle: {
              layout: {
                header: {
                  component: "TitleHeader",
                  props: { type: "detail", title: "채팅 목록" },
                },
                footer: {
                  component: "DefaultFooter",
                },
              },
            },
          },
          {
            path: ":chatRoomId",
            element: <ChatRoomPage />,
            handle: {
              layout: {
                header: {
                  component: "TitleHeader",
                  props: { type: "detail", title: "채팅방" },
                },
                footer: {
                  component: "DefaultFooter",
                },
              },
            },
            // API: GET /api/chats/:roomId
            //      GET /api/chats/:roomId/messages
            //      POST /api/chats/:roomId/messages
          },
        ],
      },

      // 로그인
      {
        path: "login",
        element: <LoginPage />,
        handle: {
          layout: {
            header: {
              component: "TitleHeader",
              props: { type: "detail", title: "로그인" },
            },
            footer: {
              component: "DefaultFooter",
            },
          },
        },
      },
      // 회원가입
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
      // 리뷰
      {
        path: "reviews",
        children: [
          {
            path: "create/:tradeId", // /trades/:tradeId/review (후기 작성 페이지)
            element: <ReviewCreatePage />,
            handle: {
              layout: {
                header: {
                  component: "TitleHeader",
                  props: { type: "detail", title: "후기 작성" },
                },
                footer: {
                  component: "DefaultFooter",
                },
              },
            },
          },
          {
            path: ":reviewId",
            element: <ReviewDetailPage />,
            handle: {
              layout: {
                header: {
                  component: "TitleHeader",
                  props: { type: "detail", title: "후기 보기" },
                },
                footer: {
                  component: "DefaultFooter",
                },
              },
            },
          },
          // {
          //   index: true, // /users/:userId/reviews (후기 조회 페이지)
          //   delement: <ReviewListPage />
          // }
        ],
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

          // 회원정보 설정
          {
            path: "profile-edit",
            element: <MyProfileEditPage />,
            handle: {
              layout: {
                header: {
                  component: "TitleHeader",
                  props: {
                    title: "회원 정보 설정",
                    showBack: true,
                    hideRight: true, //오른쪽 벨 제거
                  },
                },
                footer: { component: "DefaultFooter" },
              },
            },
          }, //

          // 알림 설정
          {
            path: "notifications",
            element: <MyNotificationsPage />,
            handle: {
              layout: {
                header: {
                  component: "TitleHeader",
                  props: {
                    title: "알림 설정",
                    showBack: true,
                    hideRight: true,
                  },
                },
                footer: { component: "DefaultFooter" },
              },
            },
          },

          // 찜 목록 페이지
          {
            path: "wishlist",
            element: <MyWishListPage />,
            handle: {
              layout: {
                header: {
                  component: "TitleHeader",
                  props: {
                    title: "찜 목록",
                    showBack: true,
                    hideRight: true,
                  },
                },
                footer: { component: "DefaultFooter" },
              },
            },
          },
        ],
      },

      // 마이페이지 - 거래내역
      {
        path: "trades",
        element: <MyPageLayout />,
        children: [
          {
            path: ":tradeId",
            element: <TradeDetailPage />,
            handle: {
              layout: {
                header: {
                  component: "TitleHeader",
                  props: {
                    title: "거래내역 상세",
                    hideLeft: true,
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

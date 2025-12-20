import React, { Suspense, lazy } from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import RootLayout from "@/layouts/RootLayout";
import { useState } from "react";
import Boards from "@/pages/Boards";
import Board from "@/pages/Board";
import BoardEdit from "@/pages/BoardEdit";
import Home from "@/pages/Home";
import SearchPage from "@/pages/search/SearchPage";
import NearbyProductsMapPage from "@/pages/products/NearbyProductsMapPage";
import ProductCreatePage from "@/pages/products/ProductCreatePage";
import ProductLocationSelectPage from "@/pages/products/ProductLocationSelectPage";
import ProductDetailPage from "@/pages/products/ProductDetailPage";
import ProductEditPage from "@/pages/products/ProductEditPage";
import { GlobalToast } from "@/components/GlobalToast";
import LoginPage from "@/pages/auth/LoginPage";
import SignupPage from "@/pages/auth/SignupPage";
import MyPage from "@/pages/me/MyPage";
import { AuthProvider } from "@/hooks/AuthContext";
import MySalesPage from "@/pages/trade/MySalesPage";
import MyPurchasesPage from "@/pages/trade/MyPurchasesPage";
import SellerShopPage from "@/pages/sellershop/SellerShop";
import { MoreVertical } from "lucide-react"; //SellerShop 상단 선택창 //확인필요
import MyPageLayout from "@/layouts/MyPageLayout";
import TradeDetailPage from "@/pages/trade/TradeDetailPage";
import SettingPage from "@/pages/me/SettingPage";
import MyWishListPage from "@/pages/me/MyWishListPage";
import ChatListPage from "@/pages/chat/ChatListPage";
import ChatRoomPage from "@/pages/chat/ChatRoomPage";
import ReviewCreatePage from "@/pages/review/ReviewCreatePage";
import ReviewDetailPage from "@/pages/review/ReviewDetailPage";
import ReceivedReviewSummaryPage from "@/pages/review/ReceivedReviewSummaryPage";
import ReceivedReviewListPage from "@/pages/review/ReceivedReviewListPage";
import AuthStatusIcon from "@/components/AuthStatusIcon";
import EnvGradeGuidePage from "@/pages/me/EnvGradeGuidePage";
import KakaoCallback from "@/pages/auth/KakaoCallback";
import MemberEditPage from "@/pages/me/MemberEditPage";
import MyProfileEditPage from "@/pages/me/MyProfileEditPage";
import MyWishSellerListPage from "@/pages/me/MyWishSellerListPage";
import PurchasePanelPage from "@/pages/order/PurchasePanelPage";
import PurchasePage from "@/pages/order/PurchasePage";
import { ModalProvider } from "@/hooks/useModal";
import AddressFormPage from "@/pages/order/AddressFormPage";
import AddressListPage from "@/pages/order/AddressListPage";
import BlockUserLIstPage from "@/pages/me/BlockUserLIstPage";
import PurchaseLayout from "@/pages/order/PurchaseLayout";
import OrderCompletePage from "@/pages/order/OrderCompletePage";
import { NotificationProvider } from "@/hooks/NotificationContext";
import NotificationsPage from "@/pages/me/NotificationsPages";

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
        path: "nearby",
        element: <NearbyProductsMapPage />,
        handle: {
          layout: {
            header: {
              component: "TitleHeader",
              props: {
                title: "주변에서 상품 찾기",
                showBack: true,
                hideRight: true,
              },
            },
            footer: { component: null },
          },
        },
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
                  component: "TitleHeader",
                  props: {
                    title: "상품 등록",
                  },
                },
                footer: {
                  component: null,
                },
              },
            },
          },
          {
            path: "location",
            element: <ProductLocationSelectPage />,
            handle: {
              layout: {
                header: {
                  component: "TitleHeader",
                  props: {
                    title: "만날 장소 선택",
                    showBack: true,
                    hideRight: true,
                  },
                },
                footer: { component: null },
              },
            },
          },
          {
            path: ":id",
            element: <ProductDetailPage />,
            handle: {
              layout: {
                header: {
                  component: "TitleHeader",
                  props: {
                    title: "",
                  },
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
                  component: "TitleHeader",
                  props: {
                    title: "상품 수정",
                  },
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
        path: "chats/:chatRoomId",
        element: <ChatRoomPage />,
        handle: {
          layout: {
            header: {
              component: "TitleHeader",
              props: {
                title: "채팅방",
                rightSlot: (
                  <MoreVertical
                    size={24}
                    className="cursor-pointer"
                    onClick={() => {
                      // 채팅에서 커스텀 이벤트 발생
                      window.dispatchEvent(new CustomEvent("seller-menu-open"));
                    }}
                  />
                ),
              },
            },
            footer: {
              component: null,
            },
          },
        },
        // API: GET /api/chats/:roomId
        //      GET /api/chats/:roomId/messages
        //      POST /api/chats/:roomId/messages
      },

      // 로그인
      {
        path: "login",
        element: <LoginPage />,
        handle: {
          layout: {
            header: {
              component: "TitleHeader",
              props: { title: "로그인" },
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
              props: { title: "회원가입" },
            },
            footer: {
              component: "DefaultFooter",
            },
          },
        },
      },
      // OAuth 카카오
      {
        path: "oauth/kakao/callback",
        element: <KakaoCallback />,
      },
      // 결제
      {
        path: "orders/:orderId/complete",
        element: <OrderCompletePage />,
      },
      {
        path: "purchase/:productId",
        element: <PurchaseLayout />,
        children: [
          { index: true, element: <PurchasePanelPage /> },
          { path: "payment", element: <PurchasePage /> },
          {
            path: "addresses",
            children: [
              {
                index: true,
                element: <AddressListPage />,
                handle: {
                  layout: {
                    header: {
                      component: "TitleHeader",
                      props: {
                        title: "배송지 관리",
                      },
                    },
                    footer: {
                      component: "DefaultFooter",
                    },
                  },
                },
              },
              {
                path: "new",
                element: <AddressFormPage />,
                handle: {
                  layout: {
                    header: {
                      component: "TitleHeader",
                      props: { title: "배송지 추가" },
                    },
                    footer: {
                      component: "DefaultFooter",
                    },
                  },
                },
              },
              {
                path: ":addressId/edit",
                element: <AddressFormPage />,
                handle: {
                  layout: {
                    header: {
                      component: "TitleHeader",
                      props: { title: "배송지 편집" },
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
      // 리뷰
      {
        path: "trades/:tradeId/review",
        element: <ReviewCreatePage />,
        handle: {
          layout: {
            header: {
              component: "TitleHeader",
              props: { title: "후기 작성" },
            },
            footer: {
              component: "DefaultFooter",
            },
          },
        },
      },
      // /reviews/:reviewId (후기 상세 페이지)
      {
        path: "reviews/:reviewId",
        element: <ReviewDetailPage />,
        handle: {
          layout: {
            header: {
              component: "TitleHeader",
              props: { title: "후기 보기" },
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

          // 알림 설정
          {
            path: "settings",
            element: <SettingPage />,
            handle: {
              layout: {
                header: {
                  component: "TitleHeader",
                  props: {
                    title: "알림 설정",
                    showBack: true,
                  },
                },
                footer: { component: "DefaultFooter" },
              },
            },
          },

          // 알림 목록
          {
            path: "notifications",
            element: <NotificationsPage />,
            handle: {
              layout: {
                header: {
                  component: "TitleHeader",
                  props: {
                    title: "알림 목록",
                    showBack: true,
                  },
                },
                footer: { component: "DefaultFooter" },
              },
            },
          },

          // 환경 점수 안내 페이지
          {
            path: "envgradeguide",
            element: <EnvGradeGuidePage />,
            handle: {
              layout: {
                header: {
                  component: "TitleHeader",
                  props: {
                    title: "환경점수",
                    hideRight: true,
                  },
                },
                footer: {
                  component: "DefaultFooter",
                },
              },
            },
          },

          // 프로필 설정
          {
            path: "profile",
            element: <MyProfileEditPage />,
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
            path: "member",
            element: <MemberEditPage />,
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
          },

          // 판매 내역
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

          // 구매 내역
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

          // 채팅 목록 페이지
          {
            path: "chats",
            index: true,
            element: <ChatListPage />,
            // API: GET /api/chats
            handle: {
              layout: {
                header: {
                  component: "TitleHeader",
                  props: { title: "채팅 목록" },
                },
                footer: {
                  component: "DefaultFooter",
                },
              },
            },
          },

          // 차단 유저 목록
          {
            path: "blocklist",
            element: <BlockUserLIstPage />,
            handle: {
              layout: {
                header: {
                  component: "TitleHeader",
                  props: {
                    title: "차단 유저 목록",
                    hideRight: true,
                  },
                },
                footer: {
                  component: "DefaultFooter",
                },
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

          //셀러샵 찜목록 페이지
          {
            path: "wishlist/sellers",
            element: <MyWishSellerListPage />, //셀러샵 찜페이지 컴포분리
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

          // /me/reviews/summary (후기 요약 페이지, 3건씩)
          {
            path: "reviews/summary",
            element: <ReceivedReviewSummaryPage />,
            handle: {
              layout: {
                header: {
                  component: "TitleHeader",
                  props: { title: "내가 받은 후기" },
                },
                footer: {
                  component: "DefaultFooter",
                },
              },
            },
          },
          // /me/reviews (후기 목록 조회, 점수별)
          {
            path: "reviews",
            element: <ReceivedReviewListPage />,
            handle: {
              layout: {
                header: {
                  component: "TitleHeader",
                  props: { title: "후기" },
                },
                footer: {
                  component: "DefaultFooter",
                },
              },
            },
          },
        ],
      },
      // 셀러샵 후기 조회 페이지(점수별)
      {
        path: "/sellershop/:sellerId/reviews",
        element: <ReceivedReviewListPage />,
        handle: {
          layout: {
            header: {
              component: "TitleHeader",
              props: { title: "후기" },
            },
            footer: {
              component: "DefaultFooter",
            },
          },
        },
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
                    showBack: true,
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

      // 셀러샵 페이지 라우터
      {
        path: "sellershop/:sellerId",
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
        <NotificationProvider>
          <ModalProvider>
            <GlobalToast />
            <RouterProvider router={router} />
          </ModalProvider>
        </NotificationProvider>
      </AuthProvider>
    </Suspense>
  );
};

export default App;

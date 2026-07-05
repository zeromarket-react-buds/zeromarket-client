import { Outlet, useMatches, useLocation } from "react-router-dom";
import Container from "@/components/Container";
import ScrollToTop from "@/components/ScrollToTop";
import clsx from "clsx";
import { useState, useEffect } from "react";
import {
  HeaderProvider,
  useHeader,
  defaultHeaderState,
} from "@/hooks/HeaderContext";

import DefaultHeader from "@/layouts/header/DefaultHeader";
import TitleHeader from "@/layouts/header/TitleHeader";
import ProductHeader from "@/layouts/header/ProductHeader";
import DefaultFooter from "@/layouts/footer/DefaultFooter";

const useShowWhenScrolled = (threshold = 120) => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    let ticking = false;

    const onScroll = () => {
      const y = window.scrollY || document.documentElement.scrollTop;
      if (!ticking) {
        window.requestAnimationFrame(() => {
          setVisible(y > threshold);
          ticking = false;
        });
        ticking = true;
      }
    };

    onScroll(); // 초기 상태 반영
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [threshold]);

  return visible;
};

const ToTheTop = () => {
  const visible = useShowWhenScrolled(120);
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };
  return (
    <button
      onClick={scrollToTop}
      aria-label="맨 위로 이동"
      className={clsx(
        `cursor-pointer border-white border-2 rounded-full h-[60px] w-[60px] 
        flex flex-col items-center justify-center
        bg-brand-ivory hover:bg-[#F4E2CAFF]/80 text-brand-green 
        transition-colors duration-200 
      `,
        visible
          ? "opacity-100 translate-y-0"
          : "opacity-0 translate-y-3 pointer-events-none",
      )}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={2}
        stroke="currentColor"
        className="size-4"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="m4.5 15.75 7.5-7.5 7.5 7.5"
        />
      </svg>
      <div className="text-xs font-bold">TOP</div>
    </button>
  );
};

const headerMap = {
  DefaultHeader,
  TitleHeader,
  ProductHeader,
};

const footerMap = {
  DefaultFooter,
};

const HeaderWrapper = ({ HeaderComponent, headerConfig }) => {
  const { headerState } = useHeader();

  const baseProps = headerConfig?.props || {};

  const headerProps = {
    ...defaultHeaderState,
    ...baseProps,
    ...headerState,
  };

  if (!HeaderComponent) return null;

  return <HeaderComponent {...headerProps} />;
};

const RootLayout = function () {
  const matches = useMatches();
  const location = useLocation();

  const layoutFromMatches =
    [...matches].reverse().find((m) => m.handle?.layout)?.handle.layout || null;

  const layout = layoutFromMatches || {
    header: { component: "DefaultHeader" },
    footer: { component: "DefaultFooter" },
  };

  const headerConfig = layout.header || null;
  const footerConfig = layout.footer || null;

  const HeaderComponent = headerConfig?.component
    ? headerMap[headerConfig.component]
    : null;

  const FooterComponent = footerConfig?.component
    ? footerMap[footerConfig.component]
    : null;

  // 등록 버튼이 있는 페이지
  const hasFloatingWriteButton =
    location.pathname === "/" || location.pathname.startsWith("/search");

  // 상품 상세처럼 하단 ActionButtonBar가 있는 페이지인지 확인
  const hasBottomActionBar = location.pathname.startsWith("/products/");

  // 푸터가 현재 화면에 보이는지 여부
  const [isFooterVisible, setIsFooterVisible] = useState(false);

  useEffect(() => {
    // 페이지의 footer 요소 가져오기
    const footer = document.querySelector("footer");

    // footer가 없으면 푸터가 보이지 않는 상태로 처리
    if (!footer) {
      setIsFooterVisible(false);
      return;
    }

    // 푸터가 화면에 보이는지 감지
    const observer = new IntersectionObserver(
      ([entry]) => {
        // 푸터가 화면에 들어오면 true, 아니면 false
        setIsFooterVisible(entry.isIntersecting);
      },
      {
        // 푸터가 약 30% 이상 보이면 보이는 것으로 판단
        threshold: 0.3,
      },
    );

    // footer 감지 시작
    observer.observe(footer);

    // 페이지 이동 시 observer 해제
    return () => observer.disconnect();
  }, [location.pathname]);

  /* tothetop 버튼 위치 결정
  1. 등록 버튼이 있는 페이지 -> 등록 버튼과 겹치지 않게 위로 이동
  2. 푸터가 보일때 위치
  3. 상품 상세 페이지 -> 하단 ActionButtonBar 위로 이동
  4. 그 외 -> 기본 위치*/
  const bottomClass = hasFloatingWriteButton
    ? "bottom-24"
    : isFooterVisible
      ? "bottom-6"
      : hasBottomActionBar
        ? "bottom-32"
        : "bottom-6";

  return (
    <HeaderProvider key={location.pathname}>
      <div className="flex flex-col w-full min-h-screen">
        {HeaderComponent && (
          <HeaderWrapper
            HeaderComponent={HeaderComponent}
            headerConfig={headerConfig}
          />
        )}

        <main className="flex-grow">
          <ScrollToTop />
          <Outlet />
        </main>

        {FooterComponent && <FooterComponent {...(footerConfig.props || {})} />}

        <div
          className={clsx(
            "fixed right-6 z-45 transition-all duration-300 ease-in-out",
            bottomClass,
          )}
        >
          <ToTheTop />
        </div>
      </div>
    </HeaderProvider>
  );
};

export default RootLayout;

import { Outlet, useMatches, useLocation } from "react-router-dom";
import Container from "@/components/Container";
import ScrollToTop from "@/components/ScrollToTop";
import clsx from "clsx";
import { useState, useEffect } from "react";
import { HeaderProvider, useHeader } from "@/hooks/HeaderContext";

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
        bg-[#0063ba] hover:bg-[#203864] text-white 
        transition-colors duration-200 
      `,
        visible
          ? "opacity-100 translate-y-0"
          : "opacity-0 translate-y-3 pointer-events-none"
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

        <div className="fixed bottom-24 right-6 z-50">
          <ToTheTop />
        </div>
      </div>
    </HeaderProvider>
  );
};

export default RootLayout;

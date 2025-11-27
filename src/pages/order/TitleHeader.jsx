import { useLocation } from "react-router-dom";

const TitleHeader = (props) => {
  const { title: defaultTitle, ...rest } = props;
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const role = searchParams.get("role");

  let title = defaultTitle;

  if (role === "seller") {
    title = "판매내역 상세";
  } else if (role === "buyer") {
    title = "구매내역 상세";
  }

  // 실제 렌더 부분은 기존 코드에 맞게
  return (
    <header className="...">
      <h1>{title}</h1>
    </header>
  );
};

export default TitleHeader;

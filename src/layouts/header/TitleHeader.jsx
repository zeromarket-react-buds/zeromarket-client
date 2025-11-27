import { ChevronLeft, Bell } from "lucide-react";
import Container from "@/components/Container";
//rightSlot추가
const TitleHeader = ({ title, rightSlot }) => {
  return (
    <Container>
      <header className="flex items-center justify-between mb-6">
        <button>
          <ChevronLeft size={24} />
        </button>
        <h1 className="text-xl font-bold">{title}</h1>
        {/* 오른쪽 아이콘: 기본 Bell, 커스텀(rightSlot) 있으면 대체 {rightSlot ? rightSlot :}추가 */}
        <button>{rightSlot ? rightSlot : <Bell size={24} />}</button>
      </header>
    </Container>
  );
};

export default TitleHeader;

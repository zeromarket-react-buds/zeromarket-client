import { ChevronLeft, Bell } from "lucide-react";
import Container from "@/components/Container";

const TitleHeader = ({ title }) => {
  return (
    <Container>
      <header className="flex items-center justify-between mb-6">
        <button>
          <ChevronLeft size={24} />
        </button>
        <h1 className="text-xl font-bold">{title}</h1>
        <button>
          <Bell size={24} />
        </button>
      </header>
    </Container>
  );
};

export default TitleHeader;

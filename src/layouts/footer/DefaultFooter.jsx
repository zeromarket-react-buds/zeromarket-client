import Container from "@/components/Container";
import { Link } from "react-router-dom";
import logo from "@/assets/zm_logo.svg";

const DefaultFooter = () => {
  return (
    <footer className="mt-16 border-t border-gray-200 bg-gray-50">
      <Container>
        <div className="px-4 py-8">
          <div className="flex flex-col gap-8 md:grid md:grid-cols-3 md:gap-12">
            <div className="flex flex-col gap-3">
              <Link to="/" className="h-[50px] w-fit">
                <img src={logo} alt="ZEROMARKET logo" className="h-full" />
              </Link>

              <p className="text-[8pt] text-gray-400">Team Project · 2025</p>

              <p className="text-[9pt] text-gray-500 max-w-[260px] leading-relaxed">
                배우며 함께 성장하는, React Buds의 첫 프로젝트
              </p>
            </div>

            {/* 가운데: LINKS */}
            <div className="flex flex-col gap-2 md:justify-self-center">
              <div className="flex flex-col gap-3 text-[10pt] text-gray-500">
                <a
                  href="https://github.com/zeromarket-react-buds"
                  target="_blank"
                  rel="noreferrer"
                  className="group flex items-center gap-2 transition-colors hover:text-blue-600"
                >
                  {/* GitHub icon */}
                  <svg
                    className="h-5 w-5"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      fillRule="evenodd"
                      d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span>GitHub</span>
                  <span className="opacity-0 transition-opacity group-hover:opacity-100">
                    →
                  </span>
                </a>

                <a
                  href="https://notion.so"
                  target="_blank"
                  rel="noreferrer"
                  className="group flex items-center gap-2  hover:text-gray-900 transition-colors"
                >
                  <svg
                    className="w-5 h-5"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M4.459 4.208c.746.606 1.026.56 2.428.466l13.215-.793c.28 0 .047-.28-.046-.326L17.86 1.968c-.42-.326-.981-.7-2.055-.607L3.01 2.295c-.466.046-.56.28-.374.466zm.793 3.08v13.904c0 .747.373 1.027 1.214.98l14.523-.84c.841-.046.935-.56.935-1.167V6.354c0-.606-.233-.933-.748-.887l-15.177.887c-.56.047-.747.327-.747.933zm14.337.745c.093.42 0 .84-.42.888l-.7.14v10.264c-.608.327-1.168.514-1.635.514-.748 0-.935-.234-1.495-.933l-4.577-7.186v6.952L12.21 19s0 .84-1.168.84l-3.222.186c-.093-.186 0-.653.327-.746l.84-.233V9.854L7.822 9.76c-.094-.42.14-1.026.793-1.073l3.456-.233 4.764 7.279v-6.44l-1.215-.139c-.093-.514.28-.888.747-.933zM1.936 1.035l13.31-.98c1.634-.14 2.055-.047 3.082.7l4.249 2.986c.7.513.934.653.934 1.213v16.378c0 1.026-.373 1.634-1.68 1.726l-15.458.934c-.98.047-1.448-.093-1.962-.747l-3.129-4.06c-.56-.747-.793-1.306-.793-1.96V2.667c0-.839.374-1.54 1.447-1.632z" />
                  </svg>
                  <span>Notion</span>
                  <span className="opacity-0 group-hover:opacity-100 transition-opacity">
                    →
                  </span>
                </a>
              </div>

              <div className="mt-1">
                <span className="text-[8pt] text-gray-400">TECH STACK</span>
                <div className="mt-2 text-[8pt] text-gray-500 space-y-[2px]">
                  <div>
                    <span className="text-gray-400">Frontend</span> · React
                  </div>
                  <div>
                    <span className="text-gray-400">Backend</span> · Spring Boot
                  </div>
                  <div>
                    <span className="text-gray-400">Infra</span> · Azure
                  </div>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-2 min-w-[120px] max-w-[260px] md:justify-self-end">
              <div className="flex items-baseline gap-2">
                <span className="text-xs text-gray-700">TEAM</span>
                <span className="text-sm font-bold">React Buds</span>
              </div>

              <span className="text-[8pt] text-gray-500">
                리액트 새싹 동아리🌱
              </span>

              <span
                className="text-[8pt] text-gray-500 truncate"
                title="김은지 · 김보경 · 나미연 · 정혜승 · 황희원"
              >
                김은지 · 김보경 · 나미연
                <br />
                정혜승 · 황희원
              </span>
              <div className="mt-1 flex flex-wrap gap-1">
                <span className="rounded bg-gray-100 px-2 py-[2px] text-[8pt] text-gray-500">
                  #팀프로젝트
                </span>
                <span className="rounded bg-gray-100 px-2 py-[2px] text-[8pt] text-gray-500">
                  #지속가능성
                </span>
                <span className="rounded bg-gray-100 px-2 py-[2px] text-[8pt] text-gray-500">
                  #성장중
                </span>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </footer>
  );
};

export default DefaultFooter;

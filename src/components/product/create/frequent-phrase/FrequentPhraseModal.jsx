import { Plus, Pencil, X, Check } from "lucide-react";
import { useState } from "react"; // 문구카드 클릭시 상태전환 위해

const FrequentPhraseModal = ({ open, onClose }) => {
  if (!open) return null;

  //mock 데이터
  //문구 목록 state
  const [phrases, setPhrases] = useState([
    { id: 1, text: "자주 쓰는 문구 1" },
    { id: 2, text: "자주 쓰는 문구 1" },
    { id: 3, text: "자주 쓰는 문구 1" },
  ]);

  //문구등록 인풋창
  //상태 관리
  const [newText, setNewText] = useState("");

  //UI 상태 전환(state toggle): 카드 편집모드, 일반모드
  const [editingId, setEditingId] = useState(null);
  const [editText, setEditText] = useState("");

  //선택된 문구 ID 상태: 카드선택시 연두색으로
  const [selectedId, setSelectedId] = useState(null);

  // 문구 등록 클릭 핸들러
  const handleRegister = () => {
    if (!newText.trim()) return; //빈값 방지

    setPhrases((prev) => [
      ...prev,
      {
        id: Date.now(), // 임시 ID
        text: newText.trim(),
      },
    ]);

    setNewText(""); // 입력창 초기화
  };

  // 하단 자주 쓰는 문구 추가하기 클릭 핸들러
  const handleAdd = () => {
    console.log("추가하기 클릭");
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* 배경 */}
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />

      {/* 모달 박스 */}
      <div className="relative bg-white rounded-xl w-[90%] max-w-sm p-4 z-10">
        {/* 헤더 */}
        <div className="relative px-4 py-1 border-b">
          {/* 중앙 제목 */}
          <span className="block text-center font-semibold">
            자주 쓰는 문구
          </span>
          <button
            onClick={onClose}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-sm"
          >
            닫기
          </button>
        </div>

        {/* 문구 등록 input 영역 */}
        <div className="px-4 pt-4 flex gap-2">
          <input
            type="text"
            value={newText}
            onChange={(e) => setNewText(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault(); // 엔터로 form submit 방지
                handleRegister();
              }
            }}
            placeholder="자주 쓰는 문구를 등록해주세요"
            className="flex-1 border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-[#1B6439]"
          />

          <button
            onClick={handleRegister}
            disabled={!newText.trim()}
            className="w-9 h-9 flex items-center justify-center bg-[#1B6439] text-white rounded-lg disabled:opacity-40"
          >
            <Plus size={18} />
          </button>
        </div>

        {/* 바디 (리스트 영역) */}
        {/* <div className="p-4 text-sm text-gray-500 min-h-[120px]">
          (다음 단계에서 문구 리스트 들어감)
        </div> */}
        {/* 문구 카드 리스트 */}
        <div className="p-5 space-y-2">
          {phrases.map((phrase) => {
            const isEditing = editingId === phrase.id; //편집모드 여부
            return (
              <div
                key={phrase.id}
                onClick={() => setSelectedId(phrase.id)} // 연두색:선택된 문구 ID 설정
                className={`flex items-center justify-between px-3 py-2 rounded-lg border
                    ${
                      //isEditing // 편집모드일때 배경색
                      selectedId === phrase.id //selectedId기준 색칠
                        ? "bg-[#E6EFEA] border-[#1B6439]" //선택 시 연두색
                        : "bg-white border-gray-300"
                    }
                    `}
              >
                {/* 왼쪽 영역 */}
                {isEditing ? (
                  <input
                    value={editText}
                    onChange={(e) => setEditText(e.target.value)}
                    className="flex-1 bg-transparent outline-none text-sm"
                    placeholder="수정 중..."
                    autoFocus
                  />
                ) : (
                  <span className="text-sm">{phrase.text}</span>
                )}

                {/* 오른쪽 버튼 영역 */}
                <div className="flex gap-2 ml-2">
                  {isEditing ? (
                    <button
                      onClick={(e) => {
                        e.stopPropagation(); //카드선택시 역두색칠 작업: 버블링 방지 (e) => e.stopPropagation();
                        if (!editText.trim()) return; //빈값 방지

                        setPhrases((prev) =>
                          prev.map((p) =>
                            p.id === phrase.id
                              ? { ...p, text: editText.trim() } //수정된 문구 반영
                              : p
                          )
                        );
                        setEditingId(null); //편집모드 종료
                      }}
                      className="p-1 rounded hover:bg-white"
                    >
                      <Check size={16} />
                    </button>
                  ) : (
                    <>
                      <button
                        onClick={(e) => {
                          e.stopPropagation(); //버블링방지
                          setEditingId(phrase.id);
                          setEditText(phrase.text);
                        }}
                        className="p-1 hover:bg-gray-100 rounded"
                      >
                        <Pencil size={16} />
                      </button>
                      {/* 삭제 버튼 */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation(); //연두색 버블링 방지
                          setPhrases(
                            (prev) => prev.filter((p) => p.id !== phrase.id) //prev에서 해당 id제외
                          );
                          // 선택된 문구가 삭제된 경우 selectedId 초기화
                          if (selectedId === phrase.id) {
                            setSelectedId(null);
                          }
                        }}
                        className="p-1 hover:bg-gray-100 rounded"
                      >
                        <X size={16} />
                      </button>
                    </>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* 하단 추가하기 버튼 */}
        <div className="px-4 py-3 border-t">
          <button
            onClick={handleAdd}
            className="w-full bg-[#1B6439] text-white py-2 rounded-lg font-semibold hover:opacity-90"
          >
            추가하기
          </button>
        </div>
      </div>
    </div>
  );
};

export default FrequentPhraseModal;

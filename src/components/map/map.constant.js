export const CATEGORY_EMOJI_MAP = {
  "가구/인테리어": "🛋️",
  도서: "📖",
  "디지털/가전": "💻",
  "생활/건강": "🍵",
  식품: "🍎",
  "스포츠/레저": "⚽",
  "여가/생활편의": "🎬",
  "출산/육아": "🍼",
  패션의류: "👕",
  패션잡화: "👜",
  "화장품/미용": "💄",
  ETC: "📦",
};

export const getCategoryEmoji = (categoryName) => {
  return CATEGORY_EMOJI_MAP[categoryName] || CATEGORY_EMOJI_MAP["ETC"];
};

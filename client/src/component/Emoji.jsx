import React from "react";
import styledComponents from "styled-components";

const EmojiModal = styledComponents.div`
  width: 100px;
  border-radius: 20px;
  background-color: aliceblue;
  margin-top:20px;
  z-index: 1;
  position: absolute;
`;

const Emojis = styledComponents.span`
  padding: 10px;
  cursor: pointer;
  font-size:20px
`;

export default function Emoji({ onSelectEmoji }) {
  const handleEmojiClick = (selectedEmoji) => {
    onSelectEmoji(selectedEmoji); // 선택한 이모지를 부모 컴포넌트로 전달
  };

  return (
    <>
      <EmojiModal>
        <Emojis onClick={() => handleEmojiClick("😊")}>😊</Emojis>
        <Emojis onClick={() => handleEmojiClick("🙂")}>🙂</Emojis>
        <Emojis onClick={() => handleEmojiClick("😶")}>😶</Emojis>
        <Emojis onClick={() => handleEmojiClick("😕")}>😕</Emojis>
        <Emojis onClick={() => handleEmojiClick("😢")}>😢</Emojis>
      </EmojiModal>
    </>
  );
}

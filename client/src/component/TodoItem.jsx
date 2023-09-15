import Emoji from "./Emoji";
import styles from "./TodoItem.module.css";
import { useState, useRef } from "react";

const TodoItem = ({
  _id,
  content,
  is_checked,
  date,
  emoji,
  onCheck,
  onDelete,
  onEdit,
  onReview,
}) => {
  const onChangeCheckbox = () => {
    onCheck(_id);
  };

  const onClickDelete = () => {
    onDelete(_id);
  };

  let style1 = { color: "black" };
  let style2 = { color: "gray", textDecorationLine: "line-through" };

  const [isEdit, setIsEdit] = useState(false); // isEdit ? 수정중 : 수정중 X
  const [feel, setFeel] = useState(false);
  const [emojiSelection, setEmojiSelection] = useState(emoji);

  const onSelectEmoji = (selectedEmoji) => {
    setEmojiSelection(selectedEmoji); // 선택한 이모지를 상태로 관리
    onReview(_id, selectedEmoji);
    setFeel(false); // 이모지 목록 숨기기
  };

  const toggleIsEdit = () => setIsEdit(!isEdit);

  // 수정 입력창에 적은 데이터
  // 수정버튼 클릭 -> 일기 본문에 적혀져있던 content값이 나오도록 초기값 설정
  const [localContent, setLocalContent] = useState(content);

  const localContentInput = useRef();

  // 수정 취소 버튼을 눌렀을 때 실행되는 함수
  // 수정 -> 수정취소 -> 수정 : 원래 content값이 나오도록 하는 함수(초기화)
  const handleQuitEdit = () => {
    setIsEdit(false);
    setLocalContent(content); // 수정입력창에 적은 데이터를 원래 일기 본문 데이터로 초기화
  };

  // 수정 완료 버튼을 눌렀을 떄 실행되는 함수
  const handleEdit = () => {
    // 수정한 데이터의 길이가 1글자 미만시 수정입력창 focus
    if (localContent.length < 1) {
      localContentInput.current.focus();
      return;
    }
    onEdit(_id, localContent); // _id(타겟아이디), localContent(새로 바뀌는 컨텐츠)를 onEdit 함수에 인자로 전달
    toggleIsEdit(); // isEdit를 true에서 false로 반환시켜서 수정폼을 닫기.
  };

  // enter 키를 눌러 수정 완료하기
  const onKeyDown = (e) => {
    if (e.keyCode === 13) {
      handleEdit();
    }
  };

  return (
    <div className={styles.TodoItem}>
      <div className={styles.checkbox_col}>
        <input
          onChange={onChangeCheckbox}
          checked={is_checked}
          type="checkbox"
        />
      </div>
      <div className={styles.title_col}>
        <span style={is_checked ? style2 : style1}>
          {/* isEdit ? 수정 입력창 : 원래 content값 */}
          {isEdit ? (
            <>
              <textarea
                ref={localContentInput}
                value={localContent}
                onChange={(e) => {
                  setLocalContent(e.target.value);
                }}
                onKeyDown={onKeyDown}
              />
            </>
          ) : (
            <>{content}</>
          )}
        </span>
      </div>

      <div className={styles.btn_col}>
        {isEdit ? (
          <>
            {/* 수정버튼을 눌렀을 때(isEdit === true)의 버튼들 */}
            <button onClick={handleQuitEdit}>취소</button>
            <button onClick={handleEdit}>완료</button>
          </>
        ) : (
          <>
            {/* 수정중이 아닐떄의 버튼들 */}
            <button onClick={() => setFeel(!feel)}>
              {emojiSelection === "" ? "감정" : emojiSelection}
              {feel && <Emoji onSelectEmoji={onSelectEmoji} />}
            </button>
            <button onClick={toggleIsEdit}>수정</button>
            <button onClick={onClickDelete}>삭제</button>
          </>
        )}
      </div>
    </div>
  );
};
export default TodoItem;

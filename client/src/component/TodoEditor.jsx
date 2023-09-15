import styles from "./TodoEditor.module.css";
import { useState, useRef } from "react";

const TodoEditor = ({ onCreate }) => {
  const [content, setContent] = useState("");
  const inputRef = useRef();
  const onChangeContent = (e) => {
    setContent(e.target.value);
  };
  const onSubmit = () => {
    // 빈 입력 방지하기
    if (!content) {
      inputRef.current.focus();
      return;
    }
    onCreate(content);
    setContent(""); // 아이템 추가 후 입력 폼 초기화하기
  };

  // enter 키를 눌러 아이템 추가하기
  const onKeyDown = (e) => {
    if (e.keyCode === 13) {
      onSubmit();
    }
  };

  return (
    <div className={styles.TodoEditor}>
      <h4>새로운 Todo 작성하기 ✏️</h4>
      <div className={styles.editor_wrapper}>
        <input
          ref={inputRef}
          value={content}
          onChange={onChangeContent}
          onKeyDown={onKeyDown}
          placeholder="새로운 Todo..."
        />
        <button onClick={onSubmit}>추가</button>
      </div>
    </div>
  );
};

export default TodoEditor;

import styles from "./TodoList.module.css";
import TodoItem from "./TodoItem";
import { useState } from "react";

const TodoList = ({ todo, onCheck, onDelete, onEdit, onReview }) => {
  const [search, setSearch] = useState("");
  const onChangeSearch = (e) => {
    setSearch(e.target.value);
  };

  // 검색어에 따라 필터링하기 & 대소 문자 구별 X (전부 소문자로)
  const getSearchResults = () => {
    return search === ""
      ? todo
      : todo.filter((it) =>
          it.content.toLowerCase().includes(search.toLowerCase())
        );
  };

  return (
    <div className={styles.TodoList}>
      <h4>Todo List 📘</h4>
      <input
        value={search}
        onChange={onChangeSearch}
        className={styles.searchbar}
        placeholder="검색어를 입력하세요"
      />
      <div className={styles.list_wrapper}>
        {getSearchResults().map((it) => (
          <TodoItem
            key={it._id}
            {...it}
            onCheck={onCheck}
            onDelete={onDelete}
            onEdit={onEdit}
            onReview={onReview}
          />
          // {...it} : 컴포넌트에 it 객체 각각의 프로퍼티 전달
        ))}
      </div>
    </div>
  );
};
export default TodoList;

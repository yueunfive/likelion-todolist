import Header from "../component/Header";
import TodoEditor from "../component/TodoEditor";
import TodoList from "../component/TodoList";
import styles from "./TodoPage.module.css";
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

function TodoPage() {
  const { dateId } = useParams(); // url의 ":dateId" 부분에서 날짜 따옴
  const [todo, setTodo] = useState([]); // 일정 데이터
  const userId = localStorage.getItem("userId");

  // 일정 받아오기
  const resTodo = async () => {
    const month = parseInt(localStorage.getItem("month")); // parseInt : 문자열 -> 숫자
    const day = parseInt(localStorage.getItem("day"));
    axios
      .get(`/api/plans/${userId}?month=${month}&day=${day}`)
      .then((response) => {
        console.log(response.data);
        setTodo(response.data);
      })
      .catch((error) => {
        console.error("에러 발생:", error);
      });
  };

  useEffect(() => {
    resTodo();
  }, []); // 마운트 될 때 한 번만 실행해서 초기값 넣기

  // 아이템 추가 함수(일정 작성)
  const onCreate = async (content) => {
    try {
      const response = await axios.post(`/api/plans/${userId}`, {
        date: dateId,
        content: content,
      });
      setTodo([response.data, ...todo]);
    } catch (error) {
      console.error("POST 요청 실패:", error);
    }
  };

  // 아이템 체크 함수(일정 완료)
  // 현재 체크 상태의 반대 상태를 요청하면 그렇게 바꿔주도록 하자
  const onCheck = async (targetId) => {
    const targetIndex = todo.findIndex((it) => it._id === targetId);

    try {
      const response = await axios.patch(
        `/api/plans/${userId}/${targetId}/check`,
        { is_checked: !todo[targetIndex].is_checked }
      );

      const updatedTodo = [...todo];
      updatedTodo[targetIndex].is_checked = response.data.is_checked;

      setTodo(updatedTodo); // 클라이언트 데이터 업데이트
    } catch (error) {
      console.error("에러 발생:", error);
    }
  };

  // 아이템 삭제 함수(일정 삭제)
  const onDelete = async (targetId) => {
    try {
      await axios.delete(`/api/plans/${userId}/${targetId}`);
      setTodo(todo.filter((it) => it._id !== targetId));
    } catch (error) {
      console.error("에러 발생:", error);
    }
  };

  // 아이템 수정 함수(일정 수정)
  const onEdit = async (targetId, newContent) => {
    try {
      await axios.patch(`/api/plans/${userId}/${targetId}`, {
        content: newContent,
      });
      setTodo(
        todo.map((it) =>
          it._id === targetId ? { ...it, content: newContent } : it
        )
      );
    } catch (error) {
      console.error("에러 발생:", error);
    }
  };

  // 일정 후기(이모지)
  const onReview = async (targetId, newEmoji) => {
    try {
      await axios.patch(`/api/plans/${userId}/${targetId}/reviews`, {
        emoji: newEmoji,
      });
      setTodo(
        todo.map((it) =>
          it._id === targetId ? { ...it, emoji: newEmoji } : it
        )
      );
    } catch (error) {
      console.error("에러 발생:", error);
    }
  };

  return (
    <div className={styles.TodoPage}>
      <Header dateId={dateId} />
      <TodoEditor onCreate={onCreate} />
      <TodoList
        todo={todo}
        onCheck={onCheck}
        onDelete={onDelete}
        onEdit={onEdit}
        onReview={onReview}
      />
    </div>
  );
}

export default TodoPage;

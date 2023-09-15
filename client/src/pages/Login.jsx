import React, { useState } from "react";
import loginImg from "../img/lion.jpeg";
import { useNavigate } from "react-router-dom";
import styles from "./Login.module.css";
import axios from "axios";

export default function Login() {
  let navigate = useNavigate();
  const [id, setId] = useState("");
  const [pw, setPw] = useState("");

  const goHome = () => {
    navigate("/Home");
  };

  const goSignUp = () => {
    navigate("/SignUp");
  };

  // 아이디, 비밀번호 4자 미만 삽입시 경고
  const wordCondition = () => {
    if (id.length < 4 || pw.length < 4) {
      alert("4자 이상 입력하세요!");
      return false;
    }
    return true;
  };

  // 인풋에 적용할 Enter 키 입력 함수
  // Enter 입력이 되면 클릭 이벤트 실행
  const handleOnKeyPress = (e) => {
    if (e.key === "Enter") {
      if (wordCondition()) {
        handleLogin();
      }
    }
  };

  const handleLogin = () => {
    if (!wordCondition()) {
      return; // 조건(4자 이상) 충족하지 않으면 함수 종료
    }

    const url = `/api/users/log-in`;
    const requestData = {
      username: id,
      password: pw,
    };

    axios
      .post(url, requestData)
      .then((response) => {
        localStorage.setItem("userId", response.data.userId); // userId를 localStorage에 저장해서 두고두고 쓰기
        goHome();
      })
      .catch((error) => {
        if (error.response && error.response.status === 401) {
          // 401 에러가 발생한 경우
          alert("로그인에 실패했습니다. 아이디 또는 비밀번호를 확인해주세요.");
        } else {
          // 다른 에러인 경우
          console.error("에러 발생:", error);
        }
      });
  };

  return (
    <div className={styles.Login}>
      <div className={styles.loginPage}>
        <img src={loginImg} alt="" width="500px" />
        <div className={styles.loginBox}>
          <div className={styles.phrase}>
            <p>멋사</p>
            <p>일정관리</p>
          </div>
          <div className={styles.login}>
            <input
              className={styles.ID}
              type="email"
              placeholder="아이디를 입력하세요"
              value={id} // id 값 업데이트
              onChange={(e) => setId(e.target.value)} // id 값을 변경할 때마다 업데이트
            />
            <br />
            <input
              className={styles.PW}
              type="password"
              placeholder="비밀번호를 입력하세요"
              onKeyPress={handleOnKeyPress}
              value={pw} // pw 값 업데이트
              onChange={(e) => setPw(e.target.value)} // pw 값을 변경할 때마다 업데이트
            />
            <br />
            <button onClick={handleLogin}>로그인</button>
            <p className={styles.sign_up} onClick={goSignUp}>
              아직 회원이 아니라고요?
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

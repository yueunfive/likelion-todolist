import styles from "./SignUp.module.css";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import axios from "axios";

const SignUp = () => {
  const navigate = useNavigate();
  const [id, setId] = useState("");
  const [pw, setPw] = useState("");
  const [responseData, setResponseData] = useState(null);

  // 아이디, 비밀번호 4자 미만 삽입시 경고
  const wordCondition = () => {
    if (id.length < 4 || pw.length < 4) {
      alert("4자 이상 입력하세요!");
      return false;
    }
    return true;
  };

  const handlePostRequest = () => {
    const url = "/api/users/sign-up";
    const data = {
      username: id,
      password: pw,
    };

    axios
      .post(url, data)
      .then((response) => {
        console.log("회원가입 성공:", response.data); // 서버 응답 확인
        setResponseData(response.data);
        // 성공한 경우에만 회원가입 메시지와 리다이렉트 호출
        alert("회원가입 완료! 다시 로그인해주세요🙂");
        navigate("/");
      })
      .catch((error) => {
        console.error("에러 발생:", error);
      });
  };

  return (
    <div className={styles.SignUp}>
      <h2 className={styles.title}>회원가입</h2>
      <div className={styles.input_box}>
        <div className={styles.id_box}>
          <h4>아이디</h4>
          <input
            className={styles.ID}
            type="email"
            placeholder="4자 이상 입력하세요"
            value={id} // id 값 업데이트
            onChange={(e) => setId(e.target.value)} // id 값을 변경할 때마다 업데이트
          />
        </div>
        <div className={styles.pw_box}>
          <h4>비밀번호</h4>
          <input
            className={styles.PW}
            type="password"
            placeholder="4자 이상 입력하세요"
            value={pw} // pw 값 업데이트
            onChange={(e) => setPw(e.target.value)} // pw 값을 변경할 때마다 업데이트
          />
        </div>
        <button onClick={() => wordCondition() && handlePostRequest()}>
          가입하기
        </button>
      </div>
    </div>
  );
};

export default SignUp;

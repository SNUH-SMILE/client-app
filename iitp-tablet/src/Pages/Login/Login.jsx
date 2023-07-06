import React, { useEffect, useRef } from "react";
import "../../Assets/Styles/Login/login.css";
import logo from "../../Assets/Images/Login/login_logo.png";
import background from "../../Assets/Images/Login/login_img.png";
import UserLoginInfo from "./UserLoginInfo";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import TokenMethod from "../../Apis/Token";
import PropTypes from "prop-types";
import useAlert from "../../Utils/UseAlert";

function Login({ setTokenInterval }) {
  const { alert } = useAlert();
  // 로그인 성공시 또는 RememberYn 이 Y 일때 MainPage 로 이동하게 하기 위해 선언
  const navigate = useNavigate();

  //Id 입력시 Validation 이 없기 때문에 UseState 를 사용하지 않고 UseRef 사용
  const idInput = useRef(); //ID
  const passInput = useRef(); //Pass
  const rememberYnChecked = useRef(); //Remember Me
  const loginBtn = useRef(); //Remember Me

  const handledLoginWithEnter = (e) => {
    if (e.keyCode === 13) {
      handledLogin();
    }
  };

  // 로그인 요청
  const handledLogin = () => {
    // 아이디가 공백일때
    if (!idInput.current.value) {
      alert("아이디가 공백입니다.");
      idInput.current.focus();
    }
    // 비밀번호가 공백일때
    else if (!passInput.current.value) {
      alert("비밀번호가 공백입니다.");
      passInput.current.focus();
    }
    // 아이디와 비밀번호가 공백이 아닐때
    else {
      axios
        .post(
          process.env.REACT_APP_BASE_URL + "/api/userLogin",
          JSON.stringify({
            ...new UserLoginInfo(
              idInput.current.value,
              passInput.current.value,
              rememberYnChecked.current.checked ? "Y" : "N"
            ),
          }),

          { headers: { "Content-Type": "application/json" } }
        )
        //통신 성공시
        .then(({ data }) => {
          const { code, message, lvl, result } = data;
          // 로그인 성공시
          if (code === "00") {
            localStorage.setItem("Authorization", result);
            localStorage.setItem("lvl", lvl);
            // 로그인 성공시 Token 재발급 Interval
            setTokenInterval(
              setInterval(() => {
                TokenMethod.Reissue();
              }, parseInt(process.env.REACT_APP_AUTHORIZATION_REISSUE_TIME))
            );
            // 메인 페이지로 이동
            navigate("/stretcher/list");
          }
          // 비밀번호 불일치
          else if (code === "10") {
            passInput.current.focus();
            alert(message);
          }
          // 사용자 정보 없을시
          else if (code === "15") {
            idInput.current.focus();
            alert(message);
          }
        })
        //통신 실패시
        .catch((e) => console.error(e));
    }
  };

  return (
    <div className="loginBody">
      <div className="container login">
        <div className="row">
          <div className="col-lg-12 col-xl-12 card flex-row mx-auto px-0">
            <div className="card-body">
              <h4 className="title logo">
                <img src={logo} alt="login" />
              </h4>
              <form action="" className="form-box">
                <label htmlFor="inputEmail" className="form-label mt-4">
                  아이디
                </label>
                <div className="form-input email">
                  <input
                    type="text"
                    className="form-control"
                    placeholder="ID"
                    ref={idInput}
                  />
                </div>
                <label htmlFor="inputPassword" className="form-label mt-3">
                  비밀번호
                </label>
                <div className="form-input pass">
                  <input
                    type="password"
                    className="form-control"
                    placeholder="Password"
                    onKeyDown={(e) => handledLoginWithEnter(e)}
                    ref={passInput}
                  />
                </div>
                <div className="form-check mt-2">
                  <input
                    type="checkbox"
                    className="form-check-input"
                    ref={rememberYnChecked}
                  />
                  <label className="form-check-label">로그인상태 유지</label>
                </div>
                <div className="mt-5 mb-5">
                  <button
                    type="button"
                    className="btn btn-block"
                    ref={loginBtn}
                    onClick={handledLogin}
                  >
                    로그인
                  </button>
                </div>
              </form>
            </div>
            <div className="img-right">
              <div className="img2">
                <img src={background} className="img-fluid" alt="" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
Login.propTypes = {
  setTokenInterval: PropTypes.func.isRequired,
};
export default Login;

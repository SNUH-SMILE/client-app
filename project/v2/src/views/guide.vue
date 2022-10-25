<template>
  <div class="guide-warpper">
    <!-- <blood-chart /> -->
    <h1 style="font-size: 30px; margin-bottom: 25px">가이드 페이지</h1>
    <nav>
      <ul>
        <li><router-link to="/intro">인트로</router-link></li>
        <li><router-link to="/intro/permission">인트로 / 접근 권한 팝업</router-link></li>
        <li><router-link to="/intro/push">인트로 / 푸시 권한 팝업</router-link></li>
        <li><router-link to="/intro/push/agree">인트로 / 푸시승인 팝업</router-link></li>
        <li><router-link to="/intro/push/reject">인트로 / 푸시거부 팝업</router-link></li>
        <li><router-link to="/login">로그인</router-link></li>
        <li><router-link to="/agree/userCheck">대상자확인</router-link></li>
        <li><router-link to="/login">로그인</router-link></li>
        <li><router-link to="/join">회원가입</router-link></li>
        <li><router-link to="/join/address">회원가입 / 주소검색팝업</router-link></li>
        <li><router-link to="/agree/terms">약관동의 / 약관 상세 팝업</router-link></li>
        <li><router-link to="/deviceConnect">디바이스 연결</router-link></li>
        <li><router-link to="/deviceList">디바이스 목록</router-link></li>
        <li><router-link to="/deviceHelp">디바이스 도움말</router-link></li>
        <li><router-link to="/find">아이디 / 패스워드 찾기</router-link></li>
        <li><router-link to="/findId">아이디 확인</router-link></li>
        <li><router-link to="/findPw">비밀번호 확인</router-link></li>

        <li><router-link to="/main">메인</router-link></li>
        <li><router-link to="/main/writeCheck">메인 / 문진작성알림 팝업</router-link></li>
        <li><router-link to="/check">문진 내역</router-link></li>
        <li><router-link to="/checkCase">문진하기</router-link></li>
        <li><router-link to="/blood">혈압</router-link></li>
        <li><router-link to="/oxygen">산소포화도</router-link></li>
        <li><router-link to="/heart">심박수</router-link></li>
        <li><router-link to="/step">걸음수</router-link></li>
        <li><router-link to="/sleep">수면</router-link></li>
        <li><router-link to="/doctor">비대면진료</router-link></li>
        <li><router-link to="/medicine">복약관리</router-link></li>
        <li><router-link to="/medicine/medicineSet">복약관리 / 복약 알림 설정</router-link></li>
        <li><router-link to="/medicineCheck">복약관리 / 복약 체크하기</router-link></li>
        <li><router-link to="/medicineCheck/medicineSetNoAlarm">복약관리 / 알림없이 체크하기</router-link></li>
        <li><router-link to="/exerciseBefore">운동하기 / 문진 전</router-link></li>
        <li><router-link to="/exercise">운동하기 / 문진 후</router-link></li>
        <li><router-link to="/exerciseDetail">운동하기 / 상세</router-link></li>
        <li><router-link to="/exerciseDetail/mobileData">운동하기 / 상세 / 모바일 데이터 팝업</router-link></li>
        <li><router-link to="/exerciseDetail/exerciseSet">운동하기 / 운동 알림 설정</router-link></li>
        <li><router-link to="/exerciseDetail/exerciseVideo">운동하기 / 운동 영상 시청</router-link></li>
        <li><router-link to="/customer">고객지원</router-link></li>
        <li><router-link to="/customerModify">고객지원 / 개인정보 수정</router-link></li>
        <li><router-link to="/notice">고객지원 / 공지사항</router-link></li>
        <li><router-link to="/notice/noticeDetail">고객지원 / 공지사항 상세</router-link></li>
        <li><router-link to="/inquiry">고객지원 / 문의하기</router-link></li>
        <li><router-link to="/inquiry/inquiryDetail">고객지원 / 문의하기 상세</router-link></li>
        <li><router-link to="/inquiry/inquiryWrite">고객지원 / 문의하기 등록</router-link></li>
        <li><router-link to="/qna">앱 이용 Q&A</router-link></li>
        <li><router-link to="/alarm">알림함</router-link></li>
      </ul>
    </nav>
  </div>
</template>
<script>
// import BloodChart from '@/components/chart/blood.vue';
// export default {
//   components: { BloodChart },
// };
export default {
  layout: 'none',
};
</script>

<style scoped>
.guide-warpper {
  margin: 100px 40px;
}
ul > li {
  padding: 5px 15px;
}
ul > li > a {
  font-size: 20px;
}
</style>

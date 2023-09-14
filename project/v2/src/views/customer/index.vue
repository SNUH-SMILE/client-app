<template>
  <div class="content-wrap">
    <validation-observer tag="fragment">
      <div class="content">
        <div class="cont-inner pt0 tb-w100p">
          <ul class="md-set-list">
            <li>
              <router-link custom v-slot="{ navigate }" :to="{ name: 'customer-modify' }">
                <button type="button" class="btn-full-detail" @click="navigate">개인정보 수정</button>
              </router-link>
            </li>
            <li>
              <router-link custom v-slot="{ navigate }" :to="{ name: 'customer-password-change' }">
                <button type="button" class="btn-full-detail" @click="navigate">비밀번호 변경</button>
              </router-link>
            </li>
            <li>
              <router-link custom v-slot="{ navigate }" :to="{ name: 'customer-notice' }">
                <button type="button" class="btn-full-detail" @click="navigate">공지사항</button>
              </router-link>
            </li>
            <li>
              <router-link custom v-slot="{ navigate }" :to="{ name: 'customer-inquiry' }">
                <button type="button" class="btn-full-detail" @click="navigate">문의하기</button>
              </router-link>
            </li>
            <li>
              <router-link custom v-slot="{ navigate }" :to="{ name: 'customer-qna' }">
                <button type="button" class="btn-full-detail" @click="navigate">앱 이용 Q&amp;A</button>
              </router-link>
            </li>
            <li>
              <button type="button" class="btn-full-detail" @click="goSetting">준비중입니다.</button>
            </li>
            <!-- 2022.12.14 앱 내 설정 없도록 수정..(기능 관련되어서 문제가 발생될 요지가 있음.) -->
            <!-- <li>
              <div class="hbox jc">
                <p class="ttl">전체 PUSH 알림</p>
                <div class="right-area">
                  <p class="ipt-switch">
                    <input type="checkbox" title="전체 PUSH 알림" />
                  </p>
                </div>
              </div>
              <ul class="sub-info-box pl10">
                <li>
                  <p class="sub-ttl">복약 알림</p>
                  <div class="right-area">
                    <p class="ipt-switch">
                      <input type="checkbox" title="복약 알림" />
                    </p>
                  </div>
                </li>
                <li>
                  <p class="sub-ttl">운동 알림</p>
                  <div class="right-area">
                    <p class="ipt-switch">
                      <input type="checkbox" title="운동 알림" />
                    </p>
                  </div>
                </li>
              </ul>
            </li> -->
          </ul>
        </div>
      </div>
      <div class="btn-wrap">
        <button type="button" class="btn-txt navy" @click="logout">로그아웃</button>
      </div>
    </validation-observer>
    <AppPasswordConfirm v-if="popup === 'show'" @onClose="popup = ''" @onSubmit="onSubmit"></AppPasswordConfirm>
  </div>
</template>
<route>
{
  "meta": {
    "title": "고객지원"
  }
}
</route>
<script>
import AppPasswordConfirm from '@/modules/etc/AppPasswordConfirm.vue';
import { LOGOUT } from '@/modules/patient';
import { mapMutations } from 'vuex';
const INIT_STATE = () => ({});

export default {
  components: { AppPasswordConfirm },
  data() {
    return {
      state: INIT_STATE(),
      popup: '',
    };
  },
  methods: {
    ...mapMutations({ logoutAction: LOGOUT }),
    logout() {
      this.logoutAction();
      this.$router.push({ name: 'login' });
    },
    async goSetting() {
      this.popup = 'show';
    },
    onSubmit(password) {
      this.popup = '';
      if (password === '1234') {
        M.page.html('/www/html/index.html');
      }
    },
  },
};
</script>

<style></style>

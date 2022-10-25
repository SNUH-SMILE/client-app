<template>
  <div class="content-wrap">
    <div class="content">
      <div class="blue-top-box">
        <strong>나를 위한 맞춤 운동</strong>
      </div>
      <div class="cont-inner mb-space20 tb-space20">
        <section class="section-box02">
          <h2 class="ttl-b">명상/요가/스트레칭</h2>
          <ul class="video-list">
            <li>
              <router-link custom v-slot="{ navigate }" :to="{ name: 'exercise-detail' }">
                <button type="button" @click="navigate">
                  <span class="thumbnail-box">
                    <img src="https://src.hidoc.co.kr/image/lib/2021/1/26/1611634006093_0.jpg" alt="" />
                    <span class="time">67분</span>
                  </span>
                  <span class="ttl"> <em class="ellipsis2">거북목 탈출 일자목 운동</em></span>
                </button>
              </router-link>
            </li>
            <li>
              <router-link custom v-slot="{ navigate }" :to="{ name: 'exercise-detail' }">
                <button type="button" @click="navigate">
                  <span class="thumbnail-box">
                    <img
                      src="https://t1.daumcdn.net/thumb/R720x0.fjpg/?fname=http://t1.daumcdn.net/brunch/service/user/2xMI/image/6WGdTtsL1y5cecBu80oo85O5D8c.jpg"
                      alt=""
                    />
                    <span class="time">42분</span>
                  </span>
                  <span class="ttl">
                    <em class="ellipsis2">스트레칭 운동 한줄 두줄 그 이상은 생략합니다. 스트레칭 운동 한줄 두줄 그 시상은 생략</em></span
                  >
                </button>
              </router-link>
            </li>
            <li>
              <router-link custom v-slot="{ navigate }" :to="{ name: 'exercise-detail' }">
                <button type="button" @click="navigate">
                  <span class="thumbnail-box">
                    <img src="https://src.hidoc.co.kr/image/lib/2021/1/26/1611634006093_0.jpg" alt="" />
                    <span class="time">67분</span>
                  </span>
                  <span class="ttl"> <em class="ellipsis2">거북목 탈출 일자목 운동</em></span>
                </button>
              </router-link>
            </li>
          </ul>
        </section>

        <section class="section-box02">
          <h2 class="ttl-b">유산소/근력 운동</h2>
          <ul class="video-list">
            <li>
              <router-link custom v-slot="{ navigate }" :to="{ name: 'exercise-detail' }">
                <button type="button" @click="navigate">
                  <span class="thumbnail-box">
                    <img src="https://src.hidoc.co.kr/image/lib/2021/1/26/1611634006093_0.jpg" alt="" />
                    <span class="time">67분</span>
                  </span>
                  <span class="ttl"> <em class="ellipsis2">거북목 탈출 일자목 운동</em></span>
                </button>
              </router-link>
            </li>
            <li>
              <router-link custom v-slot="{ navigate }" :to="{ name: 'exercise-detail' }">
                <button type="button" @click="navigate">
                  <span class="thumbnail-box">
                    <img
                      src="https://t1.daumcdn.net/thumb/R720x0.fjpg/?fname=http://t1.daumcdn.net/brunch/service/user/2xMI/image/6WGdTtsL1y5cecBu80oo85O5D8c.jpg"
                      alt=""
                    />
                    <span class="time">42분</span>
                  </span>
                  <span class="ttl">
                    <em class="ellipsis2">스트레칭 운동 한줄 두줄 그 이상은 생략합니다. 스트레칭 운동 한줄 두줄 그 시상은 생략</em></span
                  >
                </button>
              </router-link>
            </li>
          </ul>
        </section>
      </div>
    </div>
  </div>
</template>
<route>
{
    "meta" : {
        "title" : "운동하기"
    }
}
</route>
<script>
const INIT_STATE = () => ({});

export default {
  data() {
    return {
      state: INIT_STATE(),
    };
  },
};
</script>

<style></style>

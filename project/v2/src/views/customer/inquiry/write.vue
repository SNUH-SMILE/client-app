<template>
  <div class="content-wrap">
    <validation-observer tag="fragment">
      <div class="content">
        <div class="cont-inner mb-space30">
          <div class="form-box">
            <validation-provider name="제목" rules="required" immediate tag="fragment">
              <text-field id="title" label="제목" placeholder="제목을 입력해 주세요." />
            </validation-provider>
            <validation-provider name="내용" rules="required" immediate tag="fragment">
              <text-field type="textarea" id="address" label="내용" placeholder="내용을 입력해 주세요." />
            </validation-provider>
          </div>
        </div>
      </div>
      <div class="btn-wrap">
        <button type="button" class="btn-txt navy" disabled @click="$router.back">등록</button>
      </div>
    </validation-observer>
  </div>
</template>
<route>
{
  "meta": {
    "title": "문의 등록"
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

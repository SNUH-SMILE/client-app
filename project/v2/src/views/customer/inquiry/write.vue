<template>
  <div class="content-wrap">
    <validation-observer tag="fragment" v-slot="{ invalid }">
      <div class="content">
        <div class="cont-inner mb-space30">
          <div class="form-box">
            <validation-provider name="제목" rules="required" slim v-slot="{ errors }">
              <text-field id="title" label="제목" placeholder="제목을 입력해 주세요." v-model="state.questionTitle" :errorMsgs="[errors[0]]" />
            </validation-provider>
            <validation-provider name="내용" rules="required" slim v-slot="{ errors }">
              <text-field
                type="textarea"
                id="address"
                label="내용"
                placeholder="내용을 입력해 주세요."
                v-model="state.questionBody"
                :errorMsgs="[errors[0]]"
              />
            </validation-provider>
          </div>
        </div>
      </div>
      <div class="btn-wrap">
        <button type="button" class="btn-txt navy" :disabled="invalid" @click="onSubmit">등록</button>
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
import { mapActions } from 'vuex';
import { QUESTION_REGIST } from '@/modules/etc';
const INIT_STATE = () => ({
  questionTitle: '',
  questionBody: '',
});

export default {
  data() {
    return {
      state: INIT_STATE(),
    };
  },
  methods: {
    ...mapActions({ registQuestion: QUESTION_REGIST }),
    async onSubmit() {
      const { questionTitle, questionBody } = this.state;
      const { code, message, data } = await this.registQuestion({ questionTitle, questionBody });
      this.$router.back();
    },
  },
};
</script>

<style></style>

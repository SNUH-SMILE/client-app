<template>
  <div class="content-wrap">
    <div class="content">
      <div class="cont-inner pd0">
        <vue-daum-postcode @complete="onComplete" />
      </div>
    </div>
  </div>
</template>

<script>
import Logger from '@/utils/logger';
import { getCoordinate } from '@/common/helpers';

const logger = new Logger('Search-Address');

export default {
  methods: {
    async onComplete({ roadAddress, bname, buildingName, apartment, zonecode: zipCode }) {
      let extra = '';
      if (bname && /[동|로|가]$/g.test(bname)) {
        extra += bname;
      }

      if (buildingName && apartment) {
        extra += extra ? `, ${buildingName}` : buildingName;
      }

      if (extra) {
        extra = ` (${extra})`;
      }
      const address = `${roadAddress}${extra}`;
      const { lat, lng } = await getCoordinate(address);
      logger.info(`주소 검색 결과 :: `, address, zipCode, lat, lng);
      this.$emit('onSearch', { address, zipCode, lat, lng });
    },
  },
};
</script>

<style></style>

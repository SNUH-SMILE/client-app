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
      const { lat, lng } = await this.getCoordinate(address);
      logger.info(`주소 검색 결과 :: `, address, zipCode, lat, lng);
      this.$emit('onSearch', { address, zipCode, lat, lng });
    },
    getCoordinate(address) {
      const google = window.google;
      return new Promise((resolve, reject) => {
        let lat = null,
          lng = null;

        const geocoder = new google.maps.Geocoder();
        geocoder.geocode({ address }, (result, status) => {
          if (status === google.maps.GeocoderStatus.OK) {
            lat = result[0]['geometry']['location']['lat']();
            lng = result[0]['geometry']['location']['lng']();
          } else {
            this.$alert('Geocode was not successful for the followingreason: ' + status);
          }
          resolve({ lat, lng });
        });
      });
      // return {lat, lng}
    },
  },
};
</script>

<style></style>

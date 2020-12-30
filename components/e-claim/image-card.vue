<template>
  <div id="ImageCard">
    <div v-if="claimImage.type === 'image/jpeg'">
      <b-card
        :img-src="`data:image/jpeg;base64,${claimImage.file}`"
        img-alt="Image"
        img-top
        class="card-claim-image"
      >
        <b-card-text class="card-claim-detail">
          <div class="card-col">
            <div class="file-icon">JPEG</div>
          </div>
          <div class="card-col-detail">
            <span class="lbImageName">{{ claimImage.name }}</span>
            <span class="lbSizeImage">{{ claimImage.size / 1000 + 'KB' }}</span>
          </div>
        </b-card-text>
      </b-card>
    </div>
    <div v-if="claimImage.type === 'image/png'">
      <b-card
        :img-src="`data:image/png;base64,${claimImage.file}`"
        img-alt="Image"
        img-top
        class="card-claim-image"
      >
        <b-card-text class="card-claim-detail">
          <div class="card-col">
            <div class="file-icon">PNG</div>
            <div class="card-col-detail">
              <span class="lbImageName">{{ claimImage.name }}</span>
              <span class="lbSizeImage">{{
                claimImage.size / 1000 + 'KB'
              }}</span>
            </div>
          </div>
        </b-card-text>
      </b-card>
    </div>
    <div v-if="claimImage.type === 'application/pdf'">
      <b-card
        img-src="../../assets/images/image-pdf.png"
        img-alt="Image"
        img-top
        class="card-claim-pdf"
      >
        <b-card-text class="card-claim-detail">
          <div class="card-col">
            <div class="file-icon">PDF</div>
            <div class="card-col-detail">
              <span class="lbImageName">{{ claimImage.name }}</span>
              <span class="lbSizeImage">{{
                claimImage.size / 1000 + 'KB'
              }}</span>
            </div>
          </div>
        </b-card-text>
      </b-card>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ImageCard',
  props: {
    claimImage: Object,
  },
}
</script>

<style lang="scss" scoped>
label {
  margin-bottom: 0 !important;
}
#ImageCard {
  width: 100%;
  height: auto;
  position: relative;
  min-height: 180px;
  .show-pictures {
    width: 100%;
    height: 100%;
    background-color: #fff;
    .show-hospital {
      width: fit-content;
      height: 100%;
      margin: 0 auto;
      padding: 50% 0;
      .imgHospital {
        max-width: 375px;
        max-height: 195px;
      }
    }
  }
  .card-claim-image {
    height: 180px;
    border: none;
    border-radius: 5px;
    box-shadow: #00000029 0 3px 6px;
    .card-claim-detail {
      width: 100%;
      background-color: #fff;
      .card-col {
        width: 100%;
        display: inline-flex;
        .file-icon {
          width: 37px;
          height: 18px;
          padding: 5px;
          margin: 8px 0 5px;
          font-family: 'Anuphan-Bold';
          font-size: 6px;
          color: #fff;
          line-height: 8px;
          background-color: #617d8c;
          border-radius: 2px;
        }
        .card-col-detail {
          padding: 0 0 0 12px;
          display: block;
          line-height: 1;
          .lbImageName {
            padding-bottom: 6px;
            font-family: 'Anuphan-Medium';
            font-size: 14px;
            color: #617d8c;
            line-height: 18px;
            vertical-align: top;
            word-break: break-word;
          }
          .lbSizeImage {
            display: block;
            font-family: 'Anuphan-Regular';
            font-size: 12px;
            color: #617d8c;
            line-height: 16px;
          }
        }
      }
    }
    .img-pdf {
      max-height: 110px;
      padding: 13px 33px;
      background-color: #3ba9fe;
      border-radius: 5px 5px 0 0;
      .icon-pdf {
        width: 67px;
        height: 82px;
      }
    }
  }
  .card-claim-pdf {
    width: 100%;
    height: 100%;
    padding: 13px 0;
    background-color: #3ba9fe;
    border-radius: 5px;
    .icon-pdf {
      width: 67px;
      height: 82px;
    }
    .card-claim-detail {
      width: 100%;
      height: 100%;
      padding: 7px 15px 11px;
      border-radius: 0 0 5px 5px;
      background-color: #fff;
      .card-col {
        width: 100%;
        display: inline-flex;
        .file-icon {
          width: 37px;
          height: 18px;
          padding: 5px;
          margin: 8px 0 5px;
          font-family: 'Anuphan-Bold';
          font-size: 6px;
          color: #fff;
          line-height: 8px;
          background-color: #617d8c;
          border-radius: 2px;
        }
        .card-col-detail {
          padding: 0 0 0 12px;
          display: block;
          line-height: 1;
          .lbImageName {
            padding-bottom: 6px;
            font-family: 'Anuphan-Medium';
            font-size: 14px;
            color: #617d8c;
            line-height: 18px;
            vertical-align: top;
            word-break: break-word;
          }
          .lbSizeImage {
            display: block;
            font-family: 'Anuphan-Regular';
            font-size: 12px;
            color: #617d8c;
            line-height: 16px;
          }
        }
      }
    }
  }
}
</style>
<style>
@import url('../../assets/css/image-card.css');
</style>

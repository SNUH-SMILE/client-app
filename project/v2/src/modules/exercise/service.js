import { ENUM_ALARM_TYPE, ENUM_DATE_FORMAT } from '@/common/constants';
import { executor } from '@/native';
import { SELECT_LOCAL_ALARM } from '@/native/alarm';
import dayjs from 'dayjs';
import _cloneDeep from 'lodash/cloneDeep';
import _sortBy from 'lodash/sortBy';
import exerciseDataJson from './data.json';

const { exercises, videos } = exerciseDataJson;

const GET_EXERCISES_DATA = () => _cloneDeep(exercises);
const GET_VIDEOS_DATA = () => _cloneDeep(videos);

export default {
  /**
   * 비디오목록 가져오기
   * @param {string} role stage1, stage2
   */
  getExerciseVideoList(role) {
    const exercises = GET_EXERCISES_DATA();
    const videos = GET_VIDEOS_DATA();

    return exercises
      .filter(({ roles }) => roles.includes(role))
      .map((exercise) => {
        exercise.contents = videos.filter(({ exerciseId }) => exerciseId === exercise.exerciseId);
        return exercise;
      });
  },
  /**
   * 비디오 상세 정보 가져오기
   * @param {number} videoId
   */
  getExerciseVideoDetail(videoId) {
    const exercises = GET_EXERCISES_DATA();
    const videos = GET_VIDEOS_DATA();
    const targetVideo = videos.find((item) => item.videoId == videoId);
    if (!targetVideo) throw new Error('can not found Video Content.');
    const targetExercise = exercises.find(({ exerciseId }) => exerciseId === targetVideo.exerciseId);
    return {
      ...targetVideo,
      ...targetExercise,
    };
  },
  async getExerciseAlarams() {
    const { rows } = await executor(SELECT_LOCAL_ALARM);
    const today = dayjs();

    return _sortBy(
      rows.filter((o) => {
        const date = dayjs(o.time, ENUM_DATE_FORMAT.alarm);
        o.unix = date.unix();
        o.timeLabel = date.format(ENUM_DATE_FORMAT.SemiHm);
        if (o.type !== ENUM_ALARM_TYPE.EXERCISE) return false;
        else if (date.format(ENUM_DATE_FORMAT.YMD) !== today.format(ENUM_DATE_FORMAT.YMD)) return false;
        else if (date.unix() < today.unix()) return false;
        return true;
      }),
      'unix'
    );
  },
};

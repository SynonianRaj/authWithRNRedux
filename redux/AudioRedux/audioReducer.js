// Redux: audioReducer.js
const initialState = {
  currentAudio: null,
  isPlaying: false,
  playTime: '00:00',
  duration: '00:00',
};

export const audioReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'START_AUDIO':
      return {
        ...state,
        currentAudio: action.payload.audio,
        isPlaying: true,
        playTime: '00:00',
        duration: action.payload.duration,
      };
    case 'STOP_AUDIO':
      return initialState;
    case 'SET_PLAY_TIME':
      return { ...state, playTime: action.payload };
    default:
      return state;
  }
};


// Actions
export const startAudio = (audio, duration) => ({
  type: 'START_AUDIO',
  payload: { audio, duration },
});
export const stopAudio = () => ({ type: 'STOP_AUDIO' });
export const setPlayTime = (playTime) => ({
  type: 'SET_PLAY_TIME',
  payload: playTime,
});
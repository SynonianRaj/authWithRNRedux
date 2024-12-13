import { useDispatch, useSelector } from 'react-redux';
import {
  startRecording,
  stopRecording,
  startPlaying,
  pausePlaying,
  stopPlaying,
  updateProgress,
} from '../redux/AudioRedux/audioReducer';
import AudioRecorderPlayer from 'react-native-audio-recorder-player';

const useAudioRecorderPlayer = () => {
  console.log('hhiiii fromm hooooksss')
  const dispatch = useDispatch();
  const { currentAudio, audioStatus, isRecording } = useSelector((state) => state.audio);

  const audioRecorderPlayer = new AudioRecorderPlayer();

  // Start recording
  const onStartRecord = async () => {
    try {
      dispatch(startRecording());
      await audioRecorderPlayer.startRecorder();
      console.log('Recording started');
    } catch (error) {
      console.error('Error starting recorder:', error);
    }
  };

  // Stop recording
  const onStopRecord = async () => {
    try {
      const audioFile = await audioRecorderPlayer.stopRecorder();
      dispatch(stopRecording());
      console.log('Recording stopped. File:', audioFile);
      return audioFile;
    } catch (error) {
      console.error('Error stopping recorder:', error);
    }
  };

  // Start playing audio
  const onStartPlay = async (audioFile) => {
    try {
      if (currentAudio && currentAudio !== audioFile) {
        onStopPlay();
      }
      dispatch(startPlaying(audioFile));
      await audioRecorderPlayer.startPlayer(audioFile);

      audioRecorderPlayer.addPlayBackListener((event) => {
        const { currentPosition, duration } = event;
        dispatch(
          updateProgress({
            currentPositionSec: currentPosition,
            currentDurationSec: duration,
            playTime: audioRecorderPlayer.mmssss(Math.floor(currentPosition)),
            duration: audioRecorderPlayer.mmssss(Math.floor(duration)),
          })
        );
      });

      console.log('Playback started:', audioFile);
    } catch (error) {
      console.error('Error starting playback:', error);
    }
  };

  // Pause playing audio
  const onPausePlay = async () => {
    try {
      await audioRecorderPlayer.pausePlayer();
      dispatch(pausePlaying());
      console.log('Playback paused');
    } catch (error) {
      console.error('Error pausing playback:', error);
    }
  };

  // Stop playing audio
  const onStopPlay = async () => {
    try {
      await audioRecorderPlayer.stopPlayer();
      audioRecorderPlayer.removePlayBackListener();
      dispatch(stopPlaying());
      console.log('Playback stopped');
    } catch (error) {
      console.error('Error stopping playback:', error);
    }
  };

  return { onStartRecord, onStopRecord, onStartPlay, onPausePlay, onStopPlay, audioStatus, isRecording };
};

export default useAudioRecorderPlayer;

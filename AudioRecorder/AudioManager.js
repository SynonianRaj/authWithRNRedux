//AudioManager.js
// import AudioRecorderPlayer from 'react-native-audio-recorder-player';

// class AudioManager {
//   constructor() {
//     this.audioRecorderPlayer = new AudioRecorderPlayer();
//     this.currentAudio = null;
//     this.playBackListener = null;
//     this.currentPlayingCallback = null;
//     this.currentTimeCallback = null; // Callback for updating playtime
//   }

//   setCurrentPlayingCallback(callback) {
//     this.currentPlayingCallback = callback;
//   }

//   setCurrentTimeCallback(callback) {
//     this.currentTimeCallback = callback; // Ensure this method exists and assigns the callback
//   }

//   async play(audioUrl, onPlaybackComplete, updateState) {
//     try {
//       if (this.currentAudio && this.currentAudio !== audioUrl && this.currentPlayingCallback) {
//         this.currentPlayingCallback(null);
//         await this.stop();
//       }

//       if (this.currentAudio !== audioUrl) {
//         this.currentAudio = audioUrl;

//         if (this.currentPlayingCallback) {
//           this.currentPlayingCallback(audioUrl);
//         }

//         await this.audioRecorderPlayer.startPlayer(audioUrl);

//         this.playBackListener = this.audioRecorderPlayer.addPlayBackListener((e) => {
//           if (e.currentPosition && this.currentTimeCallback) {
//             this.currentTimeCallback(e.currentPosition); // Update playtime
//           }

//           if (e.isFinished) {
//             this.stop();
//             if (onPlaybackComplete) onPlaybackComplete();
//           }
//         });

//         if (updateState) updateState(true, false);
//       }
//     } catch (error) {
//       console.error('Error starting playback:', error);
//     }
//   }

//   async pause(updateState) {
//     try {
//       await this.audioRecorderPlayer.pausePlayer();
//       if (updateState) updateState(false, true);
//     } catch (error) {
//       console.error('Error pausing playback:', error);
//     }
//   }

//   async resume(updateState) {
//     try {
//       await this.audioRecorderPlayer.resumePlayer();
//       if (updateState) updateState(true, false);
//     } catch (error) {
//       console.error('Error resuming playback:', error);
//     }
//   }

//   async stop() {
//     try {
//       await this.audioRecorderPlayer.stopPlayer();
//       this.audioRecorderPlayer.removePlayBackListener();
//       this.currentAudio = null;
//       this.playBackListener = null;
//     } catch (error) {
//       console.error('Error stopping playback:', error);
//     }
//   }

//   getCurrentAudio() {
//     return this.currentAudio;
//   }
// }

// const audioManager = new AudioManager();
// export default audioManager;


import AudioRecorderPlayer from 'react-native-audio-recorder-player';
import RNFS from 'react-native-fs';
import { Platform, PermissionsAndroid } from 'react-native';

class AudioManager {
  constructor() {
    this.audioRecorderPlayer = new AudioRecorderPlayer();
    this.currentAudio = null;
    this.playBackListener = null;
    this.recordBackListener = null;
    this.currentPlayingCallback = null;
    this.currentTimeCallback = null;
    this.recordDurationCallback = null;
    this.isRecording = false;
    this.isPlaying = false;
    this.isPaused = false;
    this.recordingPath = null;
  }

  setCurrentPlayingCallback(callback) {
    this.currentPlayingCallback = callback;
  }

  setCurrentTimeCallback(callback) {
    this.currentTimeCallback = callback;
  }

  setRecordDurationCallback(callback) {
    this.recordDurationCallback = callback;
  }

  async play(audioUrl, onPlaybackComplete, updateState) {
    try {
      if (this.isRecording) {
        await this.stopRecording();
      }

      if (this.currentAudio && this.currentAudio !== audioUrl) {
        await this.stop();
      }

      if (!this.isPlaying || this.currentAudio !== audioUrl) {
        this.currentAudio = audioUrl;
        this.isPlaying = true;
        this.isPaused = false;

        if (this.currentPlayingCallback) {
          this.currentPlayingCallback(audioUrl);
        }

        await this.audioRecorderPlayer.startPlayer(audioUrl);

        this.playBackListener = this.audioRecorderPlayer.addPlayBackListener((e) => {
          if (this.currentTimeCallback) {
            this.currentTimeCallback(e.currentPosition);
          }

          if (e.isFinished) {
            this.stop();
            if (onPlaybackComplete) onPlaybackComplete();
          }
        });

        if (updateState) updateState(true, false);
      } else if (this.isPaused) {
        await this.resume(updateState);
      } else {
        await this.pause(updateState);
      }
    } catch (error) {
      console.error('Error during play:', error);
    }
  }

  async pause(updateState) {
    try {
      if (this.isPlaying) {
        await this.audioRecorderPlayer.pausePlayer();
        this.isPaused = true;
        this.isPlaying = false;

        if (updateState) updateState(false, true);
      }
    } catch (error) {
      console.error('Error pausing playback:', error);
    }
  }

  async resume(updateState) {
    try {
      if (this.isPaused) {
        await this.audioRecorderPlayer.resumePlayer();
        this.isPaused = false;
        this.isPlaying = true;

        if (updateState) updateState(true, false);
      }
    } catch (error) {
      console.error('Error resuming playback:', error);
    }
  }

  async startRecording() {
    try {
      if (this.currentAudio) {
        await this.stop();
      }

      if (Platform.OS === 'android') {
        const granted = await PermissionsAndroid.requestMultiple([
          PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
          PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
        ]);

        if (
          granted[PermissionsAndroid.PERMISSIONS.RECORD_AUDIO] !== PermissionsAndroid.RESULTS.GRANTED ||
          granted[PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE] !== PermissionsAndroid.RESULTS.GRANTED
        ) {
          console.error('Permission denied');
          return;
        }
      }

      const path = Platform.select({
        ios: `${RNFS.DocumentDirectoryPath}/sound_${new Date().getTime()}.m4a`,
        android: `${RNFS.ExternalDirectoryPath}/sound_${new Date().getTime()}.aac`,
      });

      this.recordingPath = await this.audioRecorderPlayer.startRecorder(path, {
        AudioEncoderAndroid: 3,
        AudioSourceAndroid: 1,
        OutputFormatAndroid: 6,
      });

      this.isRecording = true;
      console.log('Recording started at:', this.recordingPath);

      this.recordBackListener = this.audioRecorderPlayer.addRecordBackListener((e) => {
        if (e.currentPosition && this.recordDurationCallback) {
          this.recordDurationCallback(e.currentPosition);
        }
      });
    } catch (error) {
      console.error('Error starting recording:', error);
    }
  }

  async stopRecording() {
    try {
      if (this.isRecording) {
        await this.audioRecorderPlayer.stopRecorder();
        this.isRecording = false;

        console.log('Recording stopped. File path:', this.recordingPath);

        if (this.recordBackListener) {
          this.audioRecorderPlayer.removeRecordBackListener();
          this.recordBackListener = null;
        }

        return this.recordingPath;
      }
    } catch (error) {
      console.error('Error stopping recording:', error);
    }
  }

  async stop() {
    try {
      await this.audioRecorderPlayer.stopPlayer();
      this.audioRecorderPlayer.removePlayBackListener();
      this.currentAudio = null;
      this.isPlaying = false;
      this.isPaused = false;
      this.playBackListener = null;
    } catch (error) {
      console.error('Error stopping playback:', error);
    }
  }
}

const audioManager = new AudioManager();
export default audioManager;


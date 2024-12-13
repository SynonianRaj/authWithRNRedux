import React, { useEffect, useState } from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import audioManager from '../../AudioRecorder/AudioManager';  // Importing the audioManager instance

const RenderMessageAudio = ({ currentMessage }) => {
  const { audio, duration } = currentMessage;
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);

  const handlePlayPause = async () => {
    if (isPlaying) {
      await audioManager.pause((playing, paused) => {
        setIsPlaying(playing);
        setIsPaused(paused);
      });
    } else if (isPaused) {
      await audioManager.resume((playing, paused) => {
        setIsPlaying(playing);
        setIsPaused(paused);
      });
    } else {
      await audioManager.play(
        audio,
        () => {
          setIsPlaying(false);
          setIsPaused(false);
        },
        (playing, paused) => {
          setIsPlaying(playing);
          setIsPaused(paused);
        }
      );
    }
  };

  useEffect(() => {
    // Register callback to reset UI when another audio starts
    const resetUI = (currentAudio) => {
      if (currentAudio !== audio) {
        setIsPlaying(false);
        setIsPaused(false);
        setCurrentTime(0);
      }
    };

    audioManager.setCurrentPlayingCallback(resetUI);

    // Register callback to update playtime
    const updatePlaytime = (currentPosition) => {
      setCurrentTime(currentPosition);
    };

    audioManager.setCurrentTimeCallback(updatePlaytime);

    // Cleanup on unmount
    return () => {
      audioManager.setCurrentPlayingCallback(null);
      audioManager.setCurrentTimeCallback(null);
    };
  }, [audio, audioManager.isRecording, currentTime, audioManager.isPlaying]);

  function formatMilliseconds(ms) {
    const totalSeconds = Math.floor(ms / 1000) // Math.floor(ms / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;

    // Return formatted time with leading zeros
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
}

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={handlePlayPause} style={styles.playButton}>
        <Icon
          name={isPlaying ? 'pause-circle' : 'play-circle'}
          size={36}
          color={isPlaying ? '#FF0000' : '#00FF00'}
        />
      </TouchableOpacity>
      <Text style={styles.timer}> {currentTime ? formatMilliseconds(currentTime) : formatMilliseconds(duration)  }
        {/* {formatMilliseconds(currentTime)} / {formatMilliseconds(duration)} */}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    backgroundColor: '#f0f0f0',
    borderRadius: 10,
  },
  playButton: {
    marginRight: 10,
  },
  timer: {
    fontSize: 14,
    color: '#333',
  },
});

export default RenderMessageAudio;

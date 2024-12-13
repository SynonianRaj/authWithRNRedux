import React, { useState, useEffect } from 'react';
import { View, TouchableOpacity, StyleSheet, Text } from 'react-native';
import { InputToolbar, Composer, Send } from 'react-native-gifted-chat';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useDispatch, useSelector } from 'react-redux';
import { sendMessage } from '../../redux/chatRedux/action';
import audioManager from '../../AudioRecorder/AudioManager';  // Import the AudioManager
import RNFS from 'react-native-fs';
const CustomInputToolbar = ({
  onImageUpload,
  onAttachment,
  receiverId,
  ...props
}) => {
  const [isRecording, setIsRecording] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [duration, setDuration] = useState(0);
  const [audioFilePath, setAudioFilePath] = useState("");  // Store the audio file path
  const { id, username } = useSelector(state => state.profile.userProfileData);
  
  const dispatch = useDispatch();
  const currentUserId = id;
  
  const updateDuration = (duration) => {
    console.log(`Recording duration: ${duration} ms`);
    setDuration(duration)
  };

  audioManager.setRecordDurationCallback(updateDuration);

  // Start recording



  const startRecording = async () => {
    setIsRecording(true);  
    await audioManager.startRecording();
  };
  
  const stopRecording = async () => {

    console.log('Recording saved at:', path);
    setAudioFilePath(path)
    console.log("audiopath ->", audioFilePath)
  };




  // Send recorded audio
  const sendRecording = async () => {
    // if (!audioFilePath) return;
    console.log("sending recording........")
    setIsRecording(false)
    const path = await audioManager.stopRecording();
    // Convert the recorded audio to base64
    const audioBase64 = await RNFS.readFile(path, 'base64');
    console.log("Audio duration: ", duration);
    dispatch(
      sendMessage({
        message_type: "audio",
        content: audioBase64,
        timestamp: new Date().toISOString(),
        sender_id: currentUserId,
        duration,
        receiver_id: receiverId,
      }),
    );
  };


  const handleDeleteRecord = async() => {
    console.log("")
    await audioManager.stopRecording();
    setIsRecording(false)
    
  }

  // Play the recorded audio
  const handlePlayPause = async () => {
    if (isPlaying) {
      await audioManager.pausePlayback(() => {
        setIsPlaying(false);
      });
    } else {
      await audioManager.play(audioFilePath, () => {
        setIsPlaying(false);  // Reset the state when the playback finishes
      }, (playing, paused) => {
        setIsPlaying(playing);
      });
    }
  };

  // Format the time for display (mm:ss)
  const formatTime = (time) => {
    const minutes = Math.floor(time / 60).toString().padStart(2, '0');
    const seconds = (time % 60).toString().padStart(2, '0');
    return `${minutes}:${seconds}`;
  };

  const renderActions = () => (
    isRecording ? (
      <View style={styles.blinkingAnimationContainer}>
        {/* Custom blinking animation can go here */}
      </View>
    ) : (
      <View style={styles.actionButtons}>
        <TouchableOpacity onPress={onImageUpload} style={styles.actionButton}>
          <Icon name="image" size={28} color="#4a90e2" />
        </TouchableOpacity>
        <TouchableOpacity onPress={onAttachment} style={styles.actionButton}>
          <Icon name="attach-file" size={28} color="#4a90e2" />
        </TouchableOpacity>
      </View>
    )
  );

  const renderSend = (sendProps) => (
    <View style={styles.sendContainer}>
      {isRecording ? (
        <>
          <TouchableOpacity
            onPress={handleDeleteRecord}
            style={styles.actionButton}>
            <Icon name="delete" size={28} color="red" />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={sendRecording}
            style={styles.actionButton}>
            <Icon name="send" size={28} color="red" />
          </TouchableOpacity>
        </>
      ) : (
        <>
          {!sendProps.text.trim() && (
            <TouchableOpacity onPress={startRecording} style={styles.voiceButton}>
              <Icon name="mic" size={28} color="#4a90e2" />
            </TouchableOpacity>
          )}
          {sendProps.text.trim() && (
            <Send {...sendProps} containerStyle={styles.sendButton}>
              <Icon name="send" size={28} color="#4a90e2" />
            </Send>
          )}
        </>
      )}
    </View>
  );

  return (
    <InputToolbar
      {...props}
      containerStyle={styles.inputToolbar}
      primaryStyle={styles.inputToolbarPrimary}
      renderActions={renderActions}
      renderComposer={(composerProps) => (
        <Composer
          {...composerProps}
          text={isRecording ? formatTime(duration) : composerProps.text}
          placeholder={isRecording ? 'Recording...' : 'Type a message...'}
          textInputStyle={[styles.composer, isRecording && styles.recordingText]}
          editable={!isRecording}
          disableComposer={isRecording}
        />
      )}
      renderSend={renderSend}
    />
  );
};

const styles = StyleSheet.create({
  inputToolbar: {
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
    paddingTop: 6,
    paddingHorizontal: 8,
  },
  inputToolbarPrimary: {
    alignItems: 'center',
    marginHorizontal: 10,
  },
  actionButtons: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 5,
  },
  actionButton: {
    marginHorizontal: 5,
  },
  composer: {
    flex: 1,
    backgroundColor: '#f9f9f9',
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 5,
    fontSize: 16,
    color: '#333',
    marginBottom: 8,
  },
  recordingText: {
    color: 'red',
    fontWeight: 'bold',
    marginLeft: 10,
  },
  sendContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  sendButton: {
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 6,
  },
  voiceButton: {
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 6,
  },
  blinkingAnimationContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 10,
  },
});

export default CustomInputToolbar;

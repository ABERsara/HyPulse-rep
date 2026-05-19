import { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Button,
  PermissionsAndroid,
  Platform,
} from 'react-native';
import { RTCView, mediaDevices } from 'react-native-webrtc';
import {
  getAppSocket,
  emitPromise,
  emitMediaPromise,
} from '../services/socket.service';
import { MediasoupManager } from '../services/MediasoupManager';
import { SOCKET_EVENTS } from '@worldplay/shared';

export default function HostTestScreen() {
  const [localStream, setLocalStream] = useState(null);
  const [localStatus, setLocalStatus] = useState('Ready...');
  const [currentGameId, setCurrentGameId] = useState(null);

  const startHosting = async () => {
    try {
      // Request permissions on Android
      if (Platform.OS === 'android') {
        const granted = await PermissionsAndroid.requestMultiple([
          PermissionsAndroid.PERMISSIONS.CAMERA,
          PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
        ]);
        if (
          granted[PermissionsAndroid.PERMISSIONS.CAMERA] !==
            PermissionsAndroid.RESULTS.GRANTED ||
          granted[PermissionsAndroid.PERMISSIONS.RECORD_AUDIO] !==
            PermissionsAndroid.RESULTS.GRANTED
        ) {
          throw new Error('Camera and microphone permissions are required');
        }
      }

      setLocalStatus('Opening camera...');
      const stream = await mediaDevices.getUserMedia({
        audio: true,
        video: { width: 640, height: 480, frameRate: 30 },
      });
      setLocalStream(stream);

      setLocalStatus('Creating game...');
      const response = await emitPromise(SOCKET_EVENTS.GAME.CREATE, {
        title: 'Live Stream',
      });
      if (response.error) throw new Error(response.error);

      const { streamId, gameId } = response;
      setCurrentGameId(gameId);

      setLocalStatus('Connecting to media server...');
      const roomData = await emitMediaPromise(
        SOCKET_EVENTS.STREAM.CREATE_ROOM,
        { streamId }
      );

      setLocalStatus('Loading WebRTC device...');
      await MediasoupManager.initDevice(roomData.rtpCapabilities);

      setLocalStatus('Creating transport...');
      const transport = await MediasoupManager.createTransport(
        getAppSocket(),
        'send',
        streamId
      );

      setLocalStatus('Sending video...');
      if (stream.getVideoTracks()[0])
        await transport.produce({ track: stream.getVideoTracks()[0] });
      if (stream.getAudioTracks()[0])
        await transport.produce({ track: stream.getAudioTracks()[0] });

      setLocalStatus('Updating status...');
      await emitPromise(SOCKET_EVENTS.GAME.STATUS_UPDATE, {
        gameId,
        status: 'ACTIVE',
      });
      setLocalStatus('Live stream running!');
    } catch (err) {
      setLocalStatus('Error: ' + err.message);
    }
  };

  const endStream = async () => {
    setLocalStatus('Ending stream and cleaning up...');

    if (localStream) {
      localStream.getTracks().forEach((track) => track.stop());
      setLocalStream(null);
    }

    // Sending to server triggers the full DB + media cleanup chain
    await emitPromise(SOCKET_EVENTS.GAME.STATUS_UPDATE, {
      gameId: currentGameId,
      status: 'FINISHED',
    });
    setCurrentGameId(null);
    setLocalStatus('Stream ended');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.status}>{localStatus}</Text>
      <View style={styles.videoBox}>
        {localStream ? (
          <RTCView
            streamURL={localStream.toURL()}
            style={styles.video}
            objectFit="cover"
          />
        ) : (
          <View style={styles.centered}>
            <Text style={{ color: '#fff' }}>Camera off</Text>
          </View>
        )}
      </View>
      {!localStream ? (
        <Button title="Start broadcast" onPress={startHosting} color="#ff4757" />
      ) : (
        <Button title="Stop broadcast" onPress={endStream} color="#2f3542" />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000', padding: 20 },
  status: { color: '#fff', textAlign: 'center', marginBottom: 10 },
  videoBox: {
    width: '100%',
    aspectRatio: 16 / 9,
    backgroundColor: '#333',
    justifyContent: 'center',
  },
  video: { width: '100%', height: '100%' },
  centered: { alignItems: 'center' },
});

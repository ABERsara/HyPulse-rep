import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  Button,
  TextInput,
} from 'react-native';
import { connectAppSocket, emitPromise } from '../services/socket.service';
import { MediasoupManager } from '../services/MediasoupManager';

export default function ViewerScreen() {
  const [remoteStream, setRemoteStream] = useState(null);
  const [hasInteracted, setHasInteracted] = useState(false);
  const [status, setStatus] = useState('Waiting for stream ID...');
  const [streamIdInput, setStreamIdInput] = useState('');
  const videoRef = useRef(null);

  useEffect(() => {
    let activeSocket;
    connectAppSocket().then((s) => {
      if (!s) return;
      activeSocket = s;
      activeSocket.on('stream:new_producer', ({ producerId }) => {
        consume(producerId, streamIdInput);
      });
      activeSocket.on('stream:closed', () => {
        setRemoteStream(null);
        setStatus('Stream ended by host');
      });
    });
    return () => {
      if (activeSocket) {
        activeSocket.off('stream:new_producer');
        activeSocket.off('stream:closed');
      }
    };
  }, [streamIdInput]);

  const handleJoinPress = async () => {
    if (!streamIdInput) return alert('Please enter a stream ID');

    try {
      setStatus('Joining stream...');
      setHasInteracted(true);

      const data = await emitPromise('stream:join', {
        streamId: streamIdInput,
      });
      await MediasoupManager.initDevice(data.rtpCapabilities);

      if (data.currentProducerId) {
        await consume(data.currentProducerId, streamIdInput);
      } else {
        setStatus('Connected. Waiting for host to start streaming...');
      }
    } catch (err) {
      console.error('Join error:', err);
      setStatus('Error: ' + err.message);
    }
  };

  const consume = async (producerId, targetId) => {
    try {
      const caps = MediasoupManager.getRtpCapabilities();
      const activeSocket = await connectAppSocket();
      const transport = await MediasoupManager.createTransport(
        activeSocket,
        'recv',
        targetId
      );

      const consumeData = await emitPromise('stream:consume', {
        transportId: transport.id,
        producerId,
        rtpCapabilities: caps,
        streamId: targetId,
      });

      const consumer = await transport.consume(consumeData);
      const newStream = new MediaStream([consumer.track]);

      setRemoteStream(newStream);
      setStatus('Live');

      if (videoRef.current) {
        videoRef.current.srcObject = newStream;
      }

      await emitPromise('stream:resume', {
        consumerId: consumer.id,
        streamId: targetId,
      });
    } catch (err) {
      console.error('Consume error:', err);
      setStatus('Error receiving video');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Watch Stream</Text>

      {!hasInteracted ? (
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Enter Stream ID"
            placeholderTextColor="#888"
            value={streamIdInput}
            onChangeText={setStreamIdInput}
          />
          <Button
            title="Join Stream"
            onPress={handleJoinPress}
            color="#ff4757"
          />
        </View>
      ) : (
        <View style={styles.videoBox}>
          {remoteStream ? (
            <video ref={videoRef} autoPlay playsInline style={styles.video} />
          ) : (
            <Text style={styles.statusText}>{status}</Text>
          )}
        </View>
      )}

      <Text style={styles.statusBadge}>{status}</Text>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1a1a',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  title: { color: '#fff', fontSize: 22, marginBottom: 30, fontWeight: 'bold' },
  inputContainer: { width: '100%', alignItems: 'center' },
  input: {
    backgroundColor: '#fff',
    width: '90%',
    padding: 15,
    borderRadius: 8,
    marginBottom: 20,
    textAlign: 'center',
  },
  videoBox: {
    width: '100%',
    aspectRatio: 16 / 9,
    backgroundColor: '#000',
    borderRadius: 12,
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
  },
  video: { width: '100%', height: '100%', objectFit: 'contain' },
  statusText: { color: '#aaa' },
  statusBadge: { color: '#ffa502', marginTop: 20 },
});

import React, { useEffect, useRef } from 'react';
import { useSocket } from '../../context/useSocket';
import { useLocation } from 'react-router-dom';

export default function Video() {
  const { socket } = useSocket();
  const myVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);
  const pcRef = useRef<RTCPeerConnection>(); // peerConnection

  const location = useLocation();
  const roomId = location.pathname.split('/')[2];

  const getMedia = async () => {
    try {
      // 자신이 원하는 스트림 정보
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });

      if (myVideoRef.current) {
        myVideoRef.current.srcObject = stream;
      }
      // 스트림을 peerConnection에 등록
      stream.getTracks().forEach((track) => {
        if (!pcRef.current) return;
        pcRef.current.addTrack(track, stream);
      });

      // iceCandidate
      if (pcRef.current) {
        pcRef.current.onicecandidate = (e) => {
          if (e.candidate) {
            if (!socket) return;
            socket.emit('candidate', e.candidate, roomId);
          }
        };

        pcRef.current.ontrack = (e) => {
          if (remoteVideoRef.current) {
            remoteVideoRef.current.srcObject = e.streams[0];
          }
        };
      }
    } catch (error) {
      console.error(error);
    }
  };

  // a -> b: sdp가 담긴 offer를 생성
  const createOffer = async () => {
    if (!(pcRef.current && socket)) return;
    // offer 생성
    const sdp = await pcRef.current.createOffer();
    pcRef.current.setLocalDescription(sdp);
    socket.emit('offer', { sdp, roomId });
    try {
    } catch (error) {
      console.error(error);
    }
  };

  // b -> a answer를 생성하는 함수
  const createAnswer = async (sdp: RTCSessionDescription) => {
    // sdp: A에게 전달 받은 offer
    if (!(pcRef.current && socket)) return;

    try {
      // A가 전달한 offer를 RemoteDescription에 등록
      pcRef.current.setRemoteDescription(sdp);

      // answer 생성
      const answerSdp = await pcRef.current.createAnswer();
      // b기준: answer를 localDescription에 등록
      pcRef.current.setLocalDescription(answerSdp);
      socket.emit('answer', {
        sdp: answerSdp,
        roomId,
      });
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    pcRef.current = new RTCPeerConnection({
      iceServers: [
        {
          urls: 'stun:stun.l.google.com:19302',
        },
      ],
    });

    socket.emit('video_start', { roomId });

    socket.on('get_others', (data: any) => {
      if (data.others.length > 0) {
        createOffer();
      }
    });

    socket.on('getOffer', (sdp: RTCSessionDescription) => {
      createAnswer(sdp);
    });

    socket.on('getAnswer', (sdp: RTCSessionDescription) => {
      if (!pcRef.current) return;
      pcRef.current.setRemoteDescription(sdp);
    });

    socket.on('getCandidate', async (candidate: RTCIceCandidate) => {
      if (!pcRef.current) return;

      await pcRef.current.addIceCandidate(candidate);
    });

    getMedia();

    return () => {
      if (pcRef.current) {
        pcRef.current.close();
      }
    };
  }, []);

  return (
    <div>
      <video
        ref={myVideoRef}
        autoPlay
        id='myVideo'
        style={{
          width: 240,
          height: 240,
          backgroundColor: 'black',
        }}
      />
      <video
        ref={remoteVideoRef}
        autoPlay
        id='remoteVideo'
        style={{
          width: 240,
          height: 240,
          backgroundColor: 'black',
        }}
      />
    </div>
  );
}

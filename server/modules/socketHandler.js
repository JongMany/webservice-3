const { Server } = require('socket.io');
const User = require('../model/user');
const Room = require('../model/room');
// const {rooms} = require('../model/rooms');

const maxLength = 2;
let i = Math.floor(Math.random() * maxLength);
let userData = {};
let socketData = {};

const socketHandler = (server) => {
  const io = new Server(server, {
    cors: {
      origin: 'http://localhost:3000',
      methods: ['GET', 'POST'],
      credentials: true,
    },
  });

  io.on('connection', async (socket) => {
    // 접속 시 서버에서 실행되는 코드
    // let userData = {}; //
    const req = socket.request;
    const socket_id = socket.id;

    const client_ip =
      req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    console.log('connection');
    console.log('socket ID : ', socket_id);
    console.log('client IP : ', client_ip);

    const roomId = socket_id;

    // 방 생성
    socket.on('createRoom', async (data) => {
      try {
        const userId = data.id;
        // userData[socket.id] = {userId};
        userData[roomId] = { [userId]: [] };
        socketData[roomId] = [{ id: socket.id }];
        const user = await User.findOne({ id: userId });

        if (user.roomId) {
          // 방이 이미 있는 경우,
          const prevRoomId = user.roomId;
          // const room = await Room.findById(prevRoomId);

          // 이전 방을 찾아서 삭제하고
          const prevRoom = await Room.findByIdAndUpdate(prevRoomId, {
            $pull: {
              users: user._id,
            },
          });
          socket.leave(prevRoom?.id);

          const updatePrevRoom = await Room.findById(prevRoomId);
          // 방에 사람 없는 경우 해당 방 제거
          console.log('updatePrevRoom', updatePrevRoom);
          if (updatePrevRoom && updatePrevRoom?.users.length === 0) {
            const deletedRoom = await Room.findByIdAndDelete(prevRoom._id);
          }
        }
        // 다 제거 후 방을 생성 후, 유저도 방에 연결
        const newRoom = await Room.create({ id: roomId, users: [user._id] });
        await User.updateOne({ id: userId }, { roomId: newRoom._id });
        socket.emit('createRoom', {
          roomId: roomId,
        });
        socket.join(roomId);
        io.sockets.emit('roomCreated');
      } catch (error) {
        console.error(error);
      }
    });
    // 방 접속
    socket.on('enterRoom', async (data) => {
      const { roomId, id: userId } = data;
      if (!roomId) return;
      userData[roomId] = { ...userData[roomId], [userId]: [] };
      socketData[roomId] = [...socketData[roomId], { id: socket.id }];

      const room = await Room.findOne({ id: roomId });
      const user = await User.findOne({ id: userId });
      // console.log('room', room, 'user', user);
      if (!room || !user) return;

      const prevRoomId = room.id;
      const updatedUser = await User.updateOne(
        { id: user.id },
        {
          roomId: room._id,
        }
      );

      const updateRoom = await Room.updateOne(
        {
          id: roomId,
        },
        {
          $addToSet: {
            users: user._id,
          },
        }
      );

      if (prevRoomId && roomId !== prevRoomId) {
        // 이전 방에서 자신 제거
        const prevRoom = await Room.findByIdAndUpdate(prevRoomId, {
          $pull: {
            users: user._id,
          },
        });
        socket.leave(prevRoom.id);

        const updatePrevRoom = await Room.findById(prevRoomId);
        // 방에 사람 없는 경우 해당 방 제거
        if (updatePrevRoom.users.length === 0) {
          const deletedRoom = await Room.findByIdAndDelete(prevRoom._id);
        }
      }
      socket.join(roomId);
      const users = await User.find({
        roomId: room._id,
      });
      const opposites = users
        .map((user) => user.id)
        .filter((id) => id !== userId);
      socket.emit('successEnter', {
        opposites: opposites,
      });
      // 브로드 캐스트
      socket.to(roomId).emit('enterRoom', {
        socketId: socket.id,
        userId: userId,
      });
    });
    // 방 탈출
    socket.on('disconnected', async (data) => {
      // 사전 정의 된 callback (disconnect, error)

      // const userId = userData[socket.id]?.userId;

      const { id: userId, roomId, isOwner } = data;
      delete userData[roomId]?.userId;
      socketData[roomId].filter((user) => user.id !== socket.id);

      if (!userId) return;
      const user = await User.findOne({ id: userId });

      const currentRoomId = user?.roomId;
      await User.updateOne(
        { id: userId },
        {
          roomId: null,
        }
      );

      // Room에서 User 제거
      const a = await Room.findOne({ _id: currentRoomId });

      const deleted = await Room.updateOne(
        { _id: currentRoomId },
        {
          $pull: {
            users: user._id,
          },
        }
      );
      console.log('disconnecting', roomId);
      socket.leave(roomId);
      socket.to(roomId).emit('leave', {
        id: userId,
        roomId: deleted.id,
      });

      if (isOwner) {
        setTimeout(() => {
          io.sockets.in(roomId).emit('destroyRoom');
        }, 100);
      }

      // Room의 유저가 모두 없어지면 Room도 제거
      const updatePrevRoom = await Room.findOne({ _id: currentRoomId });

      // 방에 사람 없는 경우 해당 방 제거
      if (updatePrevRoom?.users.length === 0) {
        const deletedRoom = await Room.findByIdAndDelete(updatePrevRoom._id);
        io.sockets.emit('roomDeleted');
      }

      delete userData[roomId];
      if (socketData[roomId].length === 0) {
        delete socketData[roomId];
      }
    });
    // 준비
    socket.on('ready', (data) => {
      const { roomId, ready, id } = data;
      console.log(roomId, ready, id);

      io.sockets.in(roomId).emit('ready', { id, ready });
      // socket.to(roomId).emit("ready", {
      //   id,
      //   ready
      // });
    });

    // 게임시작
    socket.on('gameStart', async (data) => {
      const { roomId, userId } = data;
      const room = await Room.findOne({ id: roomId });
      const users = room.users;
      // i = (i + 1) % maxLength;
      const user = await User.findOne({ _id: users[i]._id });
      console.log(user.id);
      io.sockets.in(roomId).emit('gameStart', { id: user.id });
      // io.sockets.in(roomId).emit('turn', {
      //   id: user.id,
      // });
    });

    // 턴 돌리기
    socket.on('turn', async (data) => {
      const { roomId } = data;
      const room = await Room.findOne({ id: roomId });
      const users = room.users;
      console.log('before', i);
      i = (i + 1) % maxLength;
      console.log('after', i);
      const user = await User.findOne({ _id: users[i]._id });

      io.sockets.in(roomId).emit('turn', {
        id: user.id,
      });
    });

    // 공격
    socket.on('attack', async (data) => {
      const { value: attack, id: userId, roomId } = data;
      // if (!userData[roomId][userId].length) {
      //   userData[roomId][userId] = [attack]
      // } else {
      //   userData[roomId].attacks.push(attack);
      // }
      userData[roomId][userId].push(attack);
      console.log('roomId', userData[roomId]);
      const room = await Room.findOne({ id: roomId });
      const users = room.users;
      if (users?.length <= 0) return;
      console.log('attack!');
      console.log('attack before', i);
      const curUser = await User.findOne({ _id: users[i]?._id });
      i = (i + 1) % maxLength;
      console.log('attack after', i);

      const user = await User.findOne({ _id: users[i]?._id });
      io.sockets.in(roomId).emit('attack', {
        id: user.id,
        attacker: curUser.id,
        attack: attack,
      });
    });

    // 게임 종료
    socket.on('finish', async (data) => {
      const { winner, roomId, attack } = data;
      userData[roomId][winner].push(attack);
      const room = await Room.findOne({ id: roomId });
      const users = room.users;
      const userDomain = await User.find()
        .where('_id')
        .in(users)
        .where('id')
        .ne(winner);
      const loser = await User.updateMany(
        { id: { $ne: winner }, _id: { $in: users } },
        {
          $inc: {
            loses: 1,
          },
        }
      );
      const updatedWinner = await User.updateMany(
        { id: { $eq: winner } },
        {
          $inc: {
            wins: 1,
          },
        }
      );
      console.log('loser', loser);
      console.log('winner', updatedWinner);

      io.sockets.in(roomId).emit('finish', {
        winner,
        results: userData[roomId],
      });

      delete userData[roomId];
      // socket.emit('finish', {
      //   winner,
      // })
      //
      // socket.broadcast.to(roomId).emit('finish', {
      //   winner,
      // })
    });

    socket.on('offer', async (data) => {
      const { sdp, roomId } = data;
      socket.to(roomId).emit('getOffer', sdp);
    });

    socket.on('answer', (data) => {
      const { sdp, roomId } = data;
      // answer를 전달받고 방의 다른 유저들에게 전달해 줍니다.
      socket.to(roomId).emit('getAnswer', sdp);
    });

    socket.on('candidate', (data) => {
      const { candidate, roomId } = data;
      // candidate를 전달받고 방의 다른 유저들에게 전달해 줍니다.
      socket.to(roomId).emit('getCandidate', candidate);
    });

    socket.on('video_start', (data) => {
      const { roomId } = data;
      const others = socketData[roomId].filter((user) => user.id !== socket.id);
      if (others.length) {
        io.sockets.to(socket.id).emit('get_others', { others });
      }
    });
  });
};
module.exports = socketHandler;

// App.js
import { useState, useEffect } from 'react';
import io from 'socket.io-client';
import { Box, Button, Input, VStack, Heading, HStack } from '@chakra-ui/react';
import GameLobby from './components/GameLobby';
import Game from './components/Game';
import Leaderboard from './components/LeaderBoard';
import WaitingList from './components/WaitingList';

const socket = io('https://stone-paper-scissor-mryj.onrender.com');

const App = () => {
  const [username, setUsername] = useState('');
  const [loggedIn, setLoggedIn] = useState(false);
  const [players, setPlayers] = useState([]);
  const [opponentId, setOpponentId] = useState(null);
  const [waiting, setWaiting] = useState(false);

  useEffect(() => {
    socket.on('updatePlayers', (players) => {
      setPlayers(players);
    });

    socket.on('gameStarted', (opponentId) => {
      setOpponentId(opponentId);
      setWaiting(false);
    });

    socket.on('opponentDisconnected', () => {
      setOpponentId(null);
    });

    return () => {
      socket.off('updatePlayers');
      socket.off('gameStarted');
      socket.off('opponentDisconnected');
    };
  }, []);

  const handleLogin = () => {
    socket.emit('join', username);
    setLoggedIn(true);
  };

  
  return (
    <Box textAlign="center" fontSize="xl" p={4} bg="gray.100" minH="100vh" display={'flex'} justifyContent={'center'} alignItems={'center'} bgGradient="linear(to-r, gray.300, gray.500, gray.700)" >
      <VStack>

      <Heading color={'white'} fontSize={56} mb={15}>Rock-Paper-Scissors</Heading>
      {!loggedIn ? (
        <VStack spacing={4} align="center">
          <Heading color={'wheat'}>Login to Game</Heading>
          <Input
          color={'white'}
            placeholder="Enter your username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            w="300px"
            />
          <Button onClick={handleLogin} colorScheme="blue">
            Login
          </Button>
        </VStack>
      ) : (
        <HStack spacing={8}>
          <GameLobby players={players} socket={socket} setWaiting={setWaiting} />
          <Game opponentId={opponentId} socket={socket} />
          <Leaderboard players={players} />
          {waiting && <WaitingList />}
        </HStack>
      )}
      </VStack>
    </Box>
  );
};

export default App;

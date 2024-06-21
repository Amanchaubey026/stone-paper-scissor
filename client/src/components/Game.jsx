// components/Game.js
/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import { useState, useEffect } from 'react';
import { Box, Button, Text, VStack, Heading } from '@chakra-ui/react';

const Game = ({ opponentId, socket }) => {
  // eslint-disable-next-line no-unused-vars
  const [move, setMove] = useState(null);
  const [opponentMove, setOpponentMove] = useState(null);
  const [result, setResult] = useState('');
  const [gameOver, setGameOver] = useState(false);

  useEffect(() => {
    socket.on('opponentMove', (move) => {
      console.log('Opponent Move:', move);
      setOpponentMove(move);
    });

    socket.on('gameResult', (result) => {
      console.log('Game Result:', result);
      setResult(result);
      setGameOver(true);
    });

    return () => {
      socket.off('opponentMove');
      socket.off('gameResult');
    };
  }, [socket]);

  const handleMove = (selectedMove) => {
    setMove(selectedMove);
    socket.emit('play', { move: selectedMove, opponentId });
  };

  const handlePlayAgain = () => {
    setMove(null);
    setOpponentMove(null);
    setResult('');
    setGameOver(false);
    socket.emit('playAgain', opponentId);
  };

  return (
    <Box mt={4} bg="white" p={6} borderRadius="md" boxShadow="md">
      <Heading fontSize="2xl">Game</Heading>
      {result && <Text>{result}</Text>}
      {!gameOver && !result && (
        <VStack spacing={4} mt={4}>
          <Button onClick={() => handleMove('rock')} colorScheme="blue">Rock</Button>
          <Button onClick={() => handleMove('paper')} colorScheme="green">Paper</Button>
          <Button onClick={() => handleMove('scissors')} colorScheme="red">Scissors</Button>
        </VStack>
      )}
      {gameOver && (
        <Box mt={4}>
          <Button onClick={handlePlayAgain} colorScheme="teal">Play Again</Button>
        </Box>
      )}
    </Box>
  );
};

export default Game;

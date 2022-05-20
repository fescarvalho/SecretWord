//CSS
import './App.css';
//DADOS
import { wordsList } from './data/words';
//REACT
import { useCallback, useState, useEffect } from 'react';
//COMPONENTS
import StarScreen from './components/StarScreen';
import Game from './components/Game';
import GameOver from './components/GameOver';

const stages = [
  { id: 0, name: 'start' },
  { id: 1, name: 'game' },
  { id: 2, name: 'end' },
];

function App() {
  const [gameStage, setGameStage] = useState(stages[0].name);
  const [words] = useState(wordsList);

  const [pickedWord, setPickedWord] = useState('');
  const [pickedCategory, setPickedCategory] = useState('');
  const [letters, setLetters] = useState([]);

  const [guessedLetters, setGuessedLetters] = useState([]);
  const [wrongLetters, setWrongLetters] = useState([]);
  const [guesses, setGuesses] = useState(3);
  const [score, setScore] = useState(0);
  const guessesQty = 3;
  //categories e words
  const pickWordAndCategory = useCallback(() => {
    //pick category aleatory
    const categories = Object.keys(words);
    const category =
      categories[Math.floor(Math.random() * Object.keys(categories).length)];

    //pick word aleatory
    const word =
      words[category][Math.floor(Math.random() * words[category].length)];

    return { word, category };
  }, [words]);

  //start
  const startGame = useCallback(() => {
    //clear all letters
    clearLetterState();

    const { word, category } = pickWordAndCategory();
    //create arre of letters
    let wordLetters = word.split('');
    wordLetters = wordLetters.map((l) => l.toLowerCase());

    setPickedWord(word);
    setPickedCategory(category);
    setLetters(wordLetters);

    setScore(0);
    setGameStage(stages[1].name);
  }, [pickWordAndCategory]);

  //verificar
  function verifyLetter(letter) {
    const normalizedLetter = letter.toLowerCase();

    //check if letter has already been utilized
    if (
      guessedLetters.includes(normalizedLetter) ||
      wrongLetters.includes(normalizedLetter)
    ) {
      return;
    }

    //include letter guessed or remove a guess
    if (letters.includes(normalizedLetter)) {
      setGuessedLetters((actualGuessedLetters) => [
        ...actualGuessedLetters,
        normalizedLetter,
      ]);
    } else {
      setWrongLetters((actualWrongLetters) => [
        ...actualWrongLetters,
        normalizedLetter,
      ]);
      setGuesses((actualGuesses) => actualGuesses - 1);
    }
  }

  const clearLetterState = () => {
    setGuessedLetters([]);
    setWrongLetters([]);
  };

  useEffect(() => {
    if (guesses <= 0) {
      //reset all state
      clearLetterState();
      setGameStage(stages[2].name);
    }
  }, [guesses]);

  useEffect(() => {
    const uniqueLetters = [...new Set(letters)];
    //win condition
    if (guessedLetters.length === uniqueLetters.length) {
      //add score
      setScore((actualScore) => (actualScore += 100));

      //restart game
      startGame();
    }
  }, [guessedLetters, letters, startGame]);

  //retry
  function retry() {
    setScore(0);
    setGuesses(guessesQty);
    setGameStage(stages[0].name);
  }

  return (
    <div className="App">
      {gameStage === 'start' && <StarScreen startGame={startGame} />}
      {gameStage === 'game' && (
        <Game
          verifyLetter={verifyLetter}
          pickedWord={pickedWord}
          pickedCategory={pickedCategory}
          letters={letters}
          guessedLetters={guessedLetters}
          wrongLetters={wrongLetters}
          guesses={guesses}
          score={score}
        />
      )}
      {gameStage === 'end' && <GameOver retry={retry} score={score} />}
    </div>
  );
}

export default App;

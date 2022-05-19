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

  //categories e words
  const pickWordAndCategory = () => {
    //pick category aleatory
    const categories = Object.keys(words);
    const category =
      categories[Math.floor(Math.random() * Object.keys(categories).length)];

    //pick word aleatory
    const word =
      words[category][Math.floor(Math.random() * words[category].length)];

    return { word, category };
  };

  //start
  function startGame() {
    const { word, category } = pickWordAndCategory();
    //create arre of letters
    let wordLetters = word.split('');
    wordLetters = wordLetters.map((l) => l.toLowerCase());

    setPickedWord(word);
    setPickedCategory(category);
    setLetters(wordLetters);

    setGameStage(stages[1].name);
  }

  //verificar
  function verifyLetter() {
    setGameStage(stages[2].name);
  }

  //retry
  function retry() {
    setGameStage(stages[0].name);
  }

  return (
    <div className="App">
      {gameStage === 'start' && <StarScreen startGame={startGame} />}
      {gameStage === 'game' && <Game verifyLetter={verifyLetter} />}
      {gameStage === 'end' && <GameOver retry={retry} />}
    </div>
  );
}

export default App;

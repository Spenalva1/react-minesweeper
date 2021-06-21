import { ContainerStyles } from './globalStyles';
import Board from './components/Board';
import { levelsConfig } from './lib/Minesweeper';
import useLocal from './lib/LocalStorage';

function App() {
  const [config, setConfig] = useLocal(
    'minesweeper-config',
    levelsConfig.beginner
  );
  return (
    <ContainerStyles>
      <h1>Minesweeper</h1>
      <button
        onClick={() => setConfig({ ...levelsConfig.beginner })}
        type="button"
      >
        Beginner
      </button>
      <button
        onClick={() => setConfig({ ...levelsConfig.intermediate })}
        type="button"
      >
        Intermediate
      </button>
      <button
        onClick={() => setConfig({ ...levelsConfig.expert })}
        type="button"
      >
        Expert
      </button>
      <Board config={config} />
    </ContainerStyles>
  );
}

export default App;

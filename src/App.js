import './App.css';
import { Show } from './component/Show/Show';

function App() {

  localStorage.setItem('imageInfo','nature-image.png');

  return (
    <div className="App">
     <Show/>
    </div>
  );
}

export default App;

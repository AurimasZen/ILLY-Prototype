import { ChatBox } from './Components/ChatBox/ChatBox';
import './index.css'

export const App = () => {
  return(
    <div className='mainContainer'>
      <ChatBox/>
      <img className="ILLY" src="ILLY.png" alt="Visualization of the plushy toy - ILLY"/>
    </div>
  );
}

export default App

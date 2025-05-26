import logo from './logo.svg';
import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './Home'; // Import the Home component
import AddEvent from './AddEvent'
import EditEvent from './EditEvent';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/AddEvent" element={<AddEvent/>} />
        <Route path="/editEvent/:id" element={<EditEvent />} />
      </Routes>
    </Router>
  );
}

export default App;

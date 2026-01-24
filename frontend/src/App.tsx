import './App.css'
import api from './api/axios'

import {login as loginAPI} from './api/auth'
import { useAuth } from './context/AuthContext'

function App() {
  const {login, logout, isAuthenticated} = useAuth();
  const testSubjects = async () => {
    const response = await api.get('api/v1/subjects/');
    console.log(response.data);
  }
  
  const testLogin = async () => {
    const tokens = await loginAPI({username:'Surya', password: 'Surya@8043'});
    console.log(tokens);
    // localStorage.setItem("tokens", JSON.stringify(tokens));
    // axios.defaults.headers.common['Authorization'] = `Bearer ${tokens.access}`;
    login(tokens);
    console.log("logged in:");

  };

  return (
    <div>
      <h1>Attendance Tracker</h1>
      <div className='test'>
        {!isAuthenticated ? (
        <button onClick={testLogin}>Login</button>
      ) : (
        <>
          <button onClick={testSubjects}>Subjects</button>
          <button onClick={logout}>Logout</button>
        </>
      )}
      </div>
    </div>
  )
}

export default App

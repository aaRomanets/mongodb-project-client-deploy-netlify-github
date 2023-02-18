import './App.css';
import {BrowserRouter as Router, Route, Routes, Link} from "react-router-dom";
//вытаскиваем центральную страницу проекта 
import Home from "./pages/Home";
//вытаскиваем страницу создания поста авторизованным пользователем
import CreatePost from "./pages/CreatePost";
//вытаскиваем страницу показа отдельного поста с созданием комментариев к нему
import Post from "./pages/Post";
//вытаскиваем страницу регистрации пользователя
import Registration from "./pages/Registration";
//вытаскиваем страницу авторизации пользователя
import Login from "./pages/Login";
//вытаскиваем страницу показа профиля отдельного поста 
import Profile from "./pages/Profile";
//вытаскиваем страницу изменения пароля пользователя
import ChangePassword from "./pages/ChangePassword";
//вытаскиваем контекст, в который оборачиваем состояние авторизованного пользователя 
import {AuthContext} from "./helpers/AuthContext";

//вытаскиваем хуки useState и useEffect
import {useState, useEffect} from 'react';
import axios from 'axios';

function App() {
  //задаем начальное состояние авторизованного пользователя
  const [authState, setAuthState] = useState({
    username: "", 
    id: 0, 
    status: false
  });

  useEffect(() => {
    //проводим запрос на существование авторизованного пользователя
    axios.get("https://mongodb-project-server-deploy.herokuapp.com/auth/auth", { 
      //вытаскиваем токен из localStorage и отправляем его на сервер под headers
      headers : {
        accessToken: localStorage.getItem('accessToken')
      }
    }).then((response) => {
      if (response.data.error) 
      {
        //указанный запрос получился неудачным
        setAuthState({username: "", id: 0, status: false});
      }
      else 
      {
        //указанный запрос оказался успешным, в состояние авторизованного пользователя 
        //помещаем информацию об авторизованном пользователе
        setAuthState({   
          //имя авторизованного пользователя
          username: response.data.username, 
          //идентификатор авторизованного пользователя
          id: response.data.id, 
          //статус авторизованного пользователя
          status: true
        });
      }
    })
  }, []);

  //функция удаления информации об авторизованном пользователе из localStorage
  const logout = () => {
    //удаляем информацию об авторизованном пользователе из localStorage
    localStorage.removeItem("accessToken");
    //очищаем состояние авторизации пользователя
    setAuthState({username: "", id: 0, status: false});
  }

  return (
    <div className="App">
      {/*Оборачиваем состояние авторизации пользователя в контекст */}
      <AuthContext.Provider value={{authState, setAuthState}}>
        <Router>
          <div className="navbar">
            <div className="links">
            
              {!authState.status ? (
                //авторизованого пользователя нет
                <>
                  {/*Ссылка на страницу авторизации пользователя */}
                  <Link to="/login">Login</Link>
                  {/*Ссылка на страницу регистрации пользователя */}
                  <Link to="/registration">Registration</Link>
                </>
              ) : (
                <>
                  {/*Ссылка на основную страницу проекта*/}
                  <Link to="/">Home Page</Link>
                  {/*Ссылка на страницу создания поста */}
                  <Link to="/createpost">Create A Post</Link>
                </>
              )}
            </div>
            <div className="loggedInContainer">
              {/*Показываем имя авторизованного пользователя, если он существует */}
              {authState.status && <h1>{authState.username}</h1>}
              {/*Кнопка очищения информации об авторизованном пользователе, если он существует */}              
              {authState.status && <button onClick={logout}>Logout</button>}
            </div>
          </div>
          <Routes>
            {/*Маршрутизатор перехода на основную страницу проекта */}
            <Route path="/"           element = {<Home/>} />
            {/*Маршрутизатор перехода на страницу создания поста */}
            <Route path="/createpost" element = {<CreatePost/>} />
            {/*Маршрутизатор перехода на страницу показа полной информации о посте с идентификатором id
               включая его комментарии и время их создание */}
            <Route path="/post/:id"   element={<Post/>} />
            {/*Маршрутизатор перехода на страницу регистрации пользователя */}
            <Route path="/registration" element={<Registration/>} />
            {/*Маршрутизатор перехода на страницу авторизации пользователя */}
            <Route path="/login" element={<Login/>} />
            {/*Маршрутизатор перехода на страницу показа профиля информации о пользователе с идентификатором id */}
            <Route path="/profile/:id" element={<Profile/>} />
            {/*Маршрутизатор перехода на страницу изменения пароля пользователя */}
            <Route path="/changepassword" element={<ChangePassword/>} />
          </Routes>
        </Router>
      </AuthContext.Provider>
    </div>
  );
}

export default App;
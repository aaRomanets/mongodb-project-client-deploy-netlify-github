import React, {useState, useContext} from 'react';
import axios from "axios";
//вытаскиваем хук useHistory 
import {useNavigate} from "react-router-dom";
//вытаскиваем контекст авторизации
import {AuthContext} from "../helpers/AuthContext";

//страница авторизации пользователя
function Login() {
    //начальное состояние имени авторизируемого пользователя
    const [username, setUsername] = useState("");
    //начальное состояние пароля авторизируемого пользователя
    const [password, setPassword] = useState("");
    //вытаскиваем функцию задания состояния авторизации пользователя по контексту
    const {setAuthState} = useContext(AuthContext);

    //определяем компонент перехода по сайтам из хука useHistory
    let navigate = useNavigate();

    //функция авторизации пользователя
    const login = () => {
        //данные по авторизируемому пользователю
        const data = {username : username, password: password};
        //делаем запрос на осуществление авторизации пользователя по приготовленным данным
        axios.post("https://mongodb-project-server-deploy.herokuapp.com/auth/login", data).then((response) => {
            if (response.data.error) 
            {
                //авторизация пользователя не прошла выдаем ошибку через alert
                alert(response.data.error);
            }
            else
            {
                //осуществилась авторизация пользователя
                localStorage.setItem("accessToken", response.data.token);
                //определяем состояние авторизованного пользователя
                setAuthState({
                    //имя авторизованного пользователя
                    username: response.data.username, 
                    //идентификатор авторизованного пользователя
                    id: response.data.id, 
                    //статус процесса авторизации оборачиваем в true
                    status: true
                });
                //переходим на основную страницу проекта
                navigate("/");
            }
        })
    };
    
    return (
        <div className="loginContainer">
            <label>Username:</label>
            {/*Поле задания имени авторизируемого пользователя*/}
            <input 
                type="text" 
                onChange={(event) => {
                    setUsername(event.target.value)
                }}
            />
            <label>Password:</label>
            {/*Поле задания пароля авторизируемого пользователя*/}
            <input 
                type="password" 
                onChange={(event) => {
                    setPassword(event.target.value)
                }}
            />
            {/*Кнопка запуска процесса авторизации пользователя*/}
            <button  onClick={login}>Login</button>
        </div>
    )
}

export default Login;
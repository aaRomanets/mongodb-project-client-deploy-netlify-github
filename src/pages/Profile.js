//вытаскиваем хуки useContext, useEffect и useState
import React, {useContext, useEffect, useState} from "react";
//вытаскиваем хуки useParams и useHistory
import {useParams, useNavigate} from "react-router-dom";
import axios from "axios";
//вытаскиваем контекст в который обернуто состояние авторизованного пользователя
import {AuthContext} from "../helpers/AuthContext";

//станица создания профиля информации о пользователе с его постами 
function Profile() {
    //вытаскиваем идентификатор пользователя
    let {id} = useParams();
    //определяем компонент перехода по сайтам из хука useHistory
    let navigate = useNavigate();
    //состояние имени пользователя
    const [username, setUsername] = useState("");
    //состояние списка постов пользователя
    const [listOfPosts, setListOfPosts] = useState([]);
    //состояние авторизованного пользователя, полученное из контекста
    const {authState} = useContext(AuthContext);

    useEffect(() => {
        //делаем запрос на получение основной информации о пользователе с идентификатором id
        axios.get(`https://mongodb-project-server-deploy.herokuapp.com/auth/basicInfo/${id}`)
        .then((response) => {
            //фиксируем имя пользователя с идентификатором id
            setUsername(response.data.username);
        })

        //делаем запрос на получение постов пользователя с идентификатором id
        axios.get(`https://mongodb-project-server-deploy.herokuapp.com/posts/byuserId/${id}`)
        .then((response) => {
            //фиксируем все посты пользователя с идентификатором id
            setListOfPosts(response.data);
        })
    }, [id]);

    return (
        <div className="profilePageContainer">
            <div className="basicInfo">
                {/*Показываем имя пользователя*/}
                <h1>Username: {username}</h1>
                {authState.username === username && (
                    //Включаем возможность перехода на страницу смены пароля пользователя 
                    //если мы выводим профиль информации об авторизованном пользователе
                    <button 
                        onClick={() => {
                            navigate('/changepassword');
                        }}
                    >
                        Change My Password
                    </button>
                )}
            </div>
            <div className="listOfPosts">
                {/*Выводим список отдельных постов пользователя*/}
                {listOfPosts.map((value, key) => {
                    return (
                        <div key={key} className="post">
                            {/*название отдельного поста*/}
                            <div className="title"> {value.title} </div>
                                <div className="body"
                                    //возможность перехода на страницу отдельного поста с идентификатором value.id
                                    onClick={() => {
                                        navigate(`/post/${value._id}`);
                                    }}
                                >
                                {/*содежание отдельного поста*/}
                                {value.postText}
                            </div>
                            <div className="footer">
                                {/*имя пользователя который создал этот пост*/}
                                <div className="username"> {value.username} </div>
                                <div className="buttons">
                                    {/*количество лайков в этом посте*/}
                                    <label> {value.countOfLikes}</label>
                                </div>
                            </div>
                        </div>
                    );
                })}    
            </div>
        </div>
    )
}

export default Profile;
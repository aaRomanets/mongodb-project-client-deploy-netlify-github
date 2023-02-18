import React, {useEffect, useState, useContext} from "react";
//вытаскиваем хуки useParams и useHistory
import {useParams, useNavigate} from 'react-router-dom';
import axios from 'axios';
//вытаскиваем контекст в который обернуто состояние авторизованного пользователя
import {AuthContext} from "../helpers/AuthContext";

//страница показа конкретного поста
function Post() 
{
    //вытаскиваем идентификатор отображаемого поста
    let {id} = useParams();
    //состояние данных поста
    const [postObject, setPostObject] = useState({});
    //состояние списка комментариев к посту
    const [comments, setComments] = useState([]);
    //состояние нового комментария к посту
    const [newComment, setNewComment] = useState("");
    //состояние авторизованного пользователя, полученное из контекста
    const {authState} = useContext(AuthContext);

    //определяем компонент перехода по сайтам из хука useHistory
    let navigate = useNavigate();

    useEffect(() => 
    {
        //делаем запрос на скачивание с сервера информации о посте с идентификатором id
        axios.get(`https://mongodb-project-server-deploy.herokuapp.com/posts/byId/${id}`).then((response) => 
        {
            //фиксируем скаченную с сервера информацию о посте с идентификатором id
            setPostObject(response.data);
        })   
        //делаем запрос на скачивание с сервера  комментариев к посту с идентификатором id 
        axios.get(`https://mongodb-project-server-deploy.herokuapp.com/comments/${id}`).then((response) => 
        {
            //фиксируем скаченные комментарии
            setComments(response.data);
        })   
    }, [id, setPostObject, setComments])

    //функция добавления нового комментария представленного поста в базу данных комментариев этого поста
    const addComment = () => 
    {
        //делаем запрос на сервер на добавление нового комментария представленного поста в базу данных комментариев этого поста
        axios.post("https://mongodb-project-server-deploy.herokuapp.com/comments", {
            //содержание комментария
            commentBody: newComment, 
            //идентификатор поста
            post: id
        },
        {
            //отправляем на сервер токен в котором содержится информация об авторизованном пользователе из localStorage
            headers: {
                accessToken: localStorage.getItem("accessToken")
            }    
        })
        .then((response) => {
            if (response.data.error) {
                //запрос не прошел выводим информацию об ошибке
                alert(response.data.error);
            }
            else
            {
                //фиксируем добавленный комментарий
                const commentToAdd = {
                    //текст комментария
                    commentBody: newComment, 
                    //имя пользователя который добавил комментарий
                    username: response.data.username,
                    //идентификатор комментария
                    _id: response.data._id
                };
                //фиксируем список всех комментариев к изложенному посту
                setComments([...comments, commentToAdd]);
                //Очищаем состояние нового комментария
                setNewComment("");
            }
        })
    }

    //функция удаления комментария
    const deleteComment = (id) => 
    {
        //делаем запрос на сервер на удаление из рассматриваемого поста комментария с идентификатором id 
        axios.delete(`https://mongodb-project-server-deploy.herokuapp.com/comments/${id}`, 
        {
            //отправляем на сервер токен в котором содержится информация об авторизованном пользователе из localStorage
            headers: {
                accessToken: localStorage.getItem("accessToken")
            }
        })
        .then(() => 
        {
            //фиксируем новый список комментариев без удаленного комментария
            setComments(
                comments.filter((val) => {
                    return val._id !== id;
                })
            )
        })
    }

    //функция удаления поста
    const deletePost = (id) => {
        //делаем запрос на сервер на удаление поста с идентификатором id
        axios.delete(`https://mongodb-project-server-deploy.herokuapp.com/posts/${id}`, {
            //отправляем на сервер токен в котором содержится информация об авторизованном пользователе из localStorage
            headers: {
                accessToken: localStorage.getItem("accessToken")
            }
        }).then(() => {
            //переходим на главную страницу проекта
            navigate("/");
        })
    }

    //функция редактирования поста
    const editPost = (option) => {
        if (option === "title") {
            //редактируем название поста
            let newTitle = prompt("Enter New Title:");
            if (newTitle !== "" && newTitle !== undefined && newTitle !== null)
            {
                //делаем запрос на сервер на изменение названия поста с идентификатором id
                axios.put("https://mongodb-project-server-deploy.herokuapp.com/posts/title", 
                    {
                        //новое название поста
                        newTitle: newTitle, 
                        //идентификатор поста
                        id: id
                    },
                    //отправляем на сервер токен в котором содержится информация об авторизованном пользователе из localStorage
                    {
                        headers: {accessToken: localStorage.getItem("accessToken")}
                    }
                );
                //фиксируем новый пост после изменения его названия
                setPostObject({...postObject, title: newTitle});
	    }
        } else {
            //редактируем сам пост
            let newPostText = prompt("Enter New Text:");
            if (newPostText !== "" && newPostText !== undefined && newPostText !== null)
            {
                //делаем запрос на сервер на изменение содержания поста с идентификатором id
                axios.put("https://mongodb-project-server-deploy.herokuapp.com/posts/postText", 
                    {
                        //новое содержание поста
                        newText: newPostText, 
                        //идентификатор поста
                        id: id
                    },
                    //отправляем на сервер токен в котором содержится информация об авторизованном пользователе из localStorage
                    {
                        headers: {accessToken: localStorage.getItem("accessToken")}
                    }
                );
                //фиксируем новый пост после изменения его содержания
                setPostObject({...postObject, postText: newPostText});
	        }
        }
    }

    return (
        <div className="postPage">
            <div className="leftSide">
                <div className="post" id="individual">
                    <div 
                        className="title" 
                        onClick={() => {
                            if (
                                localStorage.accessToken !== undefined &&  
                                authState.username       !== "" &&
                                postObject.username      !== "" &&
                                authState.username       === postObject.username
		                    ) {
                            //можно изменить название поста, если пост создан авторизованным пользователеи
                                editPost("title");
                            }
                        }}
                    >
                        {/*Название поста*/}
                        {postObject.title}
                    </div>
                    <div                         
                        className="body"
                        onClick={() => {
                            if (
                                localStorage.accessToken !== undefined &&  
                                authState.username       !== "" &&
                                postObject.username      !== "" &&
                                authState.username       === postObject.username
			                ) { 
                            //можно изменить содержание поста, если пост создан авторизованным пользователеи
                                editPost("body")
                            }
                        }}
                    >
                        {/*содержание поста*/}
                        {postObject.postText}
                    </div>
                    <div className="footer">
                        {/*Имя пользователя, который создал этот пост */}
                        {postObject.username}
                        {    localStorage.accessToken !== undefined &&  
                             authState.username       !== "" &&
                             postObject.username      !== "" &&
                             authState.username       === postObject.username && (
                            //Кнопка удаления поста, если пост создан авторизованным пользователем
                            <button 
                                onClick={() => {
                                    deletePost(postObject._id)
                                }}
                            >
                                Delete Post
                            </button>
                        )}
                    </div>
                </div>
            </div>

            {(localStorage.accessToken !== undefined &&  
              authState.username       !== "" &&
              postObject.username      !== "" &&
              authState.username       === postObject.username) &&
                <div className="rightSide">
                    <div className="addCommentContainer">
                        {/*Поле задания нового комментария к посту*/}
                        <input 
                            type="text"
                            placeholder="Comment..."
                            autoComplete="off"
                            value={newComment}
                            onChange={(event) => {  
                                setNewComment(event.target.value);
                            }}
                        />
                        {/*Кнопка добавления нового комментария к посту*/}
                        <button onClick={addComment}>Add Comment</button>
                    </div>
                    {/*Показываем список всех комментариев к представленному посту*/}
                    <div className="listOfComments">
                        {comments.map((comment, key) => {
                            return (
                                <div key={key} className="comment">
                                    {/*Один из всех комментариев*/}
                                    {comment.commentBody}
                                    {/*Имя пользователя, который создал этот комментарий*/}
                                    <label>Username: {comment.username}</label>
                                    {/*Комментарий можно удалить, если он создан авторизованным пользователем*/}
                                    <button onClick={() => {deleteComment(comment._id)}}>X</button>
                                </div>
                            )
                        })}
                    </div>
                </div>
            }
        </div>
    )
}

export default Post;
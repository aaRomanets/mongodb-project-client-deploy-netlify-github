//вытаскиваем хук useEffect
import React, {useEffect} from "react";
import {Formik, Form, Field, ErrorMessage} from "formik";
import * as Yup from 'yup';
import axios from 'axios';
//вытаскиваем хук useNavigate
import {useNavigate} from "react-router-dom";

//функция создания поста авторизованным пользователем
function CreatePost() {
    //определяем компонент перехода по сайтам из хука useHistory
    let navigate = useNavigate();

    //начальное состояние данных по посту, который создается авторизованным пользователем
    const initialValues = {
        //пустое название создаваемого поста
        title : "",
        //пустое содержание создаваемого поста
        postText: ""
    }

    useEffect(() => {
        //авторизованного пользователя нет, переходим на страницу авторизации пользователя
        if (!localStorage.getItem("accessToken")) {
            navigate("/login");
        }
    }, [navigate])

    //схема проверки данных поста, который создается автоизованным пользователем
    const validationSchema = Yup.object().shape({
        //способ проверки названия указанного поста
        title: Yup.string().required("You must input a Title!"),
        //способ проверки содержания указанного поста
        postText: Yup.string().required()
    })

    const onSubmit = (data) => {
        //делаем запрос на сервер на создание нового поста авторизованным пользователем
        axios.post("https://mongodb-project-server-deploy.herokuapp.com/posts", 
        //отправляем данные для создания указанного поста
        data, 
        {
            //отправляем токен в котором содержится информация об авторизованном пользователе из localStorage
            headers: {accessToken: localStorage.getItem("accessToken")}
        }).then(() => {
            //переходим на основную страницу проекта
            navigate("/");
        })
    }

    return (
        <div className="createPostPage">
            <Formik 
                initialValues={initialValues} 
                onSubmit={onSubmit} 
                validationSchema={validationSchema}
            >
                <Form className="formContainer">
                    <label>Title: </label>
                    <ErrorMessage name="title" component="span"/>
                    {/*Поле задания названия поста */}
                    <Field 
                        autocomplete="off"
                        id="inputCreatePost" 
                        name="title" 
                        placeholder="(Ex, John...)"
                    />
                    <label>Post: </label>
                    <ErrorMessage name="postText" component="span"/>
                    {/*Поле задания содержания самого поста */}
                    <Field 
                        autocomplete="off"
                        id="inputCreatePost" 
                        name="postText" 
                        placeholder="(Ex, Post...)"
                    />
                    {/*Кнопка создания указанного поста */}
                    <button type="submit">Create Post</button>
                </Form>
            </Formik>
        </div>
    )
}

export default CreatePost;
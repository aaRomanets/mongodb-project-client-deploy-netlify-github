import React from 'react';
//вытаскиваем хук useHistory 
import {useNavigate} from "react-router-dom";
import {Formik, Form, Field, ErrorMessage} from "formik";
import * as Yup from "yup";
import axios from "axios";

//функция регистрации пользователя 
function Registration() {
    //начальное состояние данных для регистрации пользователя
    const initialValues = {
        //пустое имя пользователя
        username: "",
        //пустой пароль пользователя
        password: ""
    }

    //определяем компонент перехода по сайтам из хука useHistory
    let navigate = useNavigate();

    //схема проверки данных для регистрации пользователя
    const validationSchema = Yup.object().shape({
        //так будем проверять имя регистрируемого пользователя
        username: Yup.string().min(3).max(15).required(),
        //так будем проверять пароль регистрируемого пользователя
        password: Yup.string().min(4).max(20).required()
    })

    const onSubmit = (data) => {
        //осуществляем запрос на регистрацию пользователя
        axios.post("https://mongodb-project-server-deploy.herokuapp.com/auth", data).then(() => {
            //в случае успешной регистрации пользователя переходим на страницу авторизации пользователя
            navigate('/login');
        })
    };

    return (
        <div className="createPostPage">
            <Formik 
                initialValues={initialValues} 
                onSubmit={onSubmit} 
                validationSchema={validationSchema}
            >
                <Form className="formContainer">
                    <label>Username: </label>
                    <ErrorMessage name="username" component="span"/>
                    {/*Поле задания имени регистрируемого пользователя*/}
                    <Field 
                        autocomplete="off"
                        id="inputCreatePost" 
                        name="username" 
                        placeholder="(Ex, John...)"
                    />
                    <label>Password: </label>
                    <ErrorMessage name="password" component="span"/>
                    {/*Поле задания пароля регистрируемого пользователя*/}
                    <Field 
                        autocomplete="off"
                        type="password"
                        id="inputCreatePost" 
                        name="password" 
                        placeholder="Your Password..."
                    />
                    {/*Кнопка запуска процесса регистрации пользователя*/}
                    <button type="submit">Register</button>
                </Form>
            </Formik>
        </div>
    )
}

export default Registration;
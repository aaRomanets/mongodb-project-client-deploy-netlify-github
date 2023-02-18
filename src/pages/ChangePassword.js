//вытаскиваем хук useState
import React, {useState} from 'react'
import axios from "axios"

//страница изменения пароля пользователя
function ChangePassword () {
    //старый пароль 
    const [oldPassword, setOldPassword] = useState("");
    //новый пароль
    const [newPassword, setNewPassword] = useState("");

    //функция изменения пароля авторизованного пользователя
    const changePassword = () => {
        //осуществляем запрос на изменение пароля по авторизованному пользователю 
        axios.put("https://mongodb-project-server-deploy.herokuapp.com/auth/changepassword", {
            //старый пароль
            oldPassword: oldPassword,
            //новый пароль
            newPassword: newPassword
        }, 
        {
            //отправляем на сервер токен авторизованного пользователя из хранилища localStorage
            headers: {
                accessToken: localStorage.getItem("accessToken")
            }
        }).then((response) => {
            //смена пароля не удалась
            if (response.data.error) {
                alert(response.data.error);
            }
        })
    }

    return (
        <div>
            <h1>Change your password</h1>
            {/*Поле введения старого пароля авторизованного пользователя */}
            <input 
                type="text" 
                placeholder="Old Password..."
                onChange={(event) => {
                    setOldPassword(event.target.value);
                }}
            />
            {/*Поле введения нового пароля авторизованного пользователя */}
            <input 
                type="text" 
                placeholder="Old Password..."
                onChange={(event) => {
                    setNewPassword(event.target.value);
                }}
            />
            {/*Кнопка запуска изменения пароля авторизованного пользователя */}
            <button onClick={changePassword}>Save Changes</button>
        </div>    
    )
}

export default ChangePassword;
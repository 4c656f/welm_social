import React, {FC} from 'react';
import AuthService from "./services/AuthService";
import PostsService from "./services/PostsService";

function tr(): string{

    let val
    val = 1
    return "r"

}



const App: FC  = () => {






    const x = async () => {
        let resp = await AuthService.login("vlevo.yovlyo@yandex.ru", "1")
        localStorage.setItem("token", resp.data.tokens.access_token)
    }

    const y = async () => {
        let resp = await PostsService.login(0, 10, "sort")
        console.log(resp.data)
    }


    return (
        <div>
            <button onClick={x}> login</button>
            <button onClick={y}> get_post</button>
        </div>
    );
};

export default App;
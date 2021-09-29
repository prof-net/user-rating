import axios from "axios";

export  const getData = async () => {
    return await axios.get('https://random-data-api.com/api/users/random_user?size=3')
}



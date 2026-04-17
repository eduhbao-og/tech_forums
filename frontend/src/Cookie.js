import axios from "axios";


export function getCookie(name) {
    let cookieValue = null;
    if (document.cookie && document.cookie !== '') {
      const cookies = document.cookie.split(';');
      for (let cookie of cookies) {
        cookie = cookie.trim();
        if (cookie.substring(0, name.length + 1) === (name + '=')) {
          cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
          break;
        }
      }
    }
    return cookieValue;
}

export async function call(){
    try{
        const response = await axios.get("http://localhost:8000/api/get_csrf", {withCredentials: true});
    } catch(error){
        console.log(error)
    }
  }
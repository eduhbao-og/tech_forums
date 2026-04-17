import { useState, createContext, useContext } from "react";

const userInit = {
  username:'',
  email:'',
  phone:0,
  developer:false
}

const UserContext = createContext(null)

export const UserState = props => {

  const [user, setUser] = useState(userInit)

  // function that updates de user
  const updateUser = (key, value) => {
    setUser({...user, [key]:value})
  }

  // provide current user and a way to update it
  return (
    <UserContext.Provider value={[user, updateUser]}>{props.children}</UserContext.Provider>
  )
}

export const useUserState = () => useContext(UserContext)
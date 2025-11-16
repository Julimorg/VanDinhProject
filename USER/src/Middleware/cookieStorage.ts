import type { StateStorage } from "zustand/middleware";
import Cookies from 'js-cookie';
import { COOKIE_EXPIRE } from "../Utils/env_dev_handler";

const cookieStorage: StateStorage = {
  getItem: (name: string) => {
    const value = Cookies.get(name);
    return value ? JSON.parse(value) : null; 
  },
  setItem: (name: string, value: unknown) => {
    Cookies.set(name, JSON.stringify(value), {
      expires:  COOKIE_EXPIRE, 
      //! Nên đặt secure: true khi lên HTTPS thì browser không tự động lưu cookies trong local như trên https được
      secure: false,   
      //! Nên đặt sameSite: 'none' cho phép FE và BE khác domain với nhau khi lên HTTPS
      sameSite: 'lax',     
      path: "/",   
    });
  },
  removeItem: (name: string) => {
    Cookies.remove(name);
  }
};

export default cookieStorage;
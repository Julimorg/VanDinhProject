
  import { toast } from 'react-toastify';

  export type errorsMessage = {
    key: string;
    messages: string[];
  };



  export const showToastErrors = (errors: any) => {
    for (let key in errors) {
      if (errors.hasOwnProperty(key)) {

        console.log(key, errors[key]);

        key === 'errors' &&
          errors[key].map((err: errorsMessage) =>
            err.messages.map((msg: string) => toast.error(`${err.key} - ${msg}`))
          ),
          key === 'message' && toast.error(errors[key]);
      }
    }
  };
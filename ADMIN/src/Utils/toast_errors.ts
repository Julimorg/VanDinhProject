import { toast } from 'react-toastify';

export type errorsMessage = {
  key: string;
  messages: string[];
};

const shownMessages = new Set<string>(); 

export const showToastErrors = (error: any) => {
 
  if (typeof error?.message === 'string' && error.message.includes('status code')) {
    return;
  }

  const data = error?.response?.data ?? error;
  if (!data) return;

  const showUniqueToast = (msg: string) => {
    if (!shownMessages.has(msg)) {
      toast.error(msg);
      shownMessages.add(msg);
      setTimeout(() => shownMessages.delete(msg), 5000); 
    }
  };

  // Case 1: [{ code, description }]
  if (Array.isArray(data)) {
    data.forEach((err: any) => {
      if (err.description) showUniqueToast(err.description);
      else if (err.code) showUniqueToast(err.code);
    });
    return;
  }

  // Case 2: { message: "..." }
  if (typeof data.message === 'string') {
    showUniqueToast(data.message);
    return;
  }

  // Case 3: { errors: [{ key, messages: [...] }] }
  if (Array.isArray(data.errors)) {
    data.errors.forEach((err: errorsMessage) => {
      err.messages.forEach((msg: string) => {
        showUniqueToast(`${err.key}: ${msg}`);
      });
    });
    return;
  }
};

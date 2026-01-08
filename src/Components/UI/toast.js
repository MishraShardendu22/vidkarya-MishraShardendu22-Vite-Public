import { toast } from 'react-toastify';

export const useToasts = () => {
  const functionThatReturnPromise = () => new Promise((resolve) => setTimeout(resolve, 2000));

  const properties = {
    position: 'top-right',
    autoClose: 3000,
    hideProgressBar: true,
    newestOnTop: false,
    closeOnClick: true,
    rtl: false,
    pauseOnFocusLoss: true,
    draggable: true,
    pauseOnHover: true,
    theme: 'light',
  };
  const notify = (event) => {
    // Success toast
    if (event.type === 'SUCCESS') {
      toast.success(event.message, properties);
    }

    // Error toast
    else if (event.type === 'ERROR') {
      toast.error(event.message, properties);
    }

    // Warning toast
    else if (event.type === 'WARNING') {
      toast.warn(event.message, properties);
    }

    // Promise toast
    else if (event.type === 'PROMISE') {
      toast.promise(
        functionThatReturnPromise,
        {
          pending: 'Your request is processing',
          success: event.message,
          error: 'Request Failed',
        },
        properties
      );
    }

    // Info toast
    else if (event.type === 'INFO') {
      toast.info(event.message, properties);
    }

    // Default toast
    else {
      toast(event.message, properties);
    }
  };
  return [notify];
};

import toast from 'react-hot-toast';

export function showSuccess(message) {
  toast.success(message);
}

export function showError(message) {
  toast.error(message || 'Something went wrong');
}

export function showLoading(message = 'Loading...') {
  return toast.loading(message);
}

export function dismissToast(toastId) {
  toast.dismiss(toastId);
}

export default toast;

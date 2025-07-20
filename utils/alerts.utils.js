import Swal from "sweetalert2";

export default class Alert {
  constructor() {}

  static info(message) {
    if (message != undefined) {
      return Swal.fire({
        icon: "info",
        text: message,
      });
    }
  }

  static success(message, options = {}) {
    const { onClose = () => null, onConfirm = () => null } = options;

    if (message != undefined) {
      return Swal.fire({
        icon: "success",
        text: message,
        onClose,
      }).then(onConfirm);
    }
  }

  static warning(message) {
    if (message != undefined) {
      return Swal.fire({
        icon: "warning",
        text: message,
      });
    }
  }

  static error(message) {
    if (message != undefined) {
      return Swal.fire({
        icon: "error",
        text: message,
      });
    }
  }

  static confirm(message) {
    if (message != undefined) {
      return Swal.fire({
        text: message,
        icon: "question",
        showCancelButton: true,
      });
    }
  }
}

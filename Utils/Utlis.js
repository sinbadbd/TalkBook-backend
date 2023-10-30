const isEmailValid = "/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i";

const validateEmail = (email) => {
    return email.match(
      /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    );
};
  
module.export = {
    isEmailValid,
    validateEmail
}
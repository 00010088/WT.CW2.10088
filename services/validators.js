class Validator {
  isValid(data) {
    if (data.name.trim() === "" || data.surname.trim() === "" ) {
      return false;
    } else {
      return true;
    }
    
  }
}

module.exports = Validator;
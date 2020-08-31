export const validateEmail = (email) => {
    var re = /^(([^<>()\[\]\\.,;:\s@”]+(\.[^<>()\[\]\\.,;:\s@”]+)*)|(“.+”))@((\[[0–9]{1,3}\.[0–9]{1,3}\.[0–9]{1,3}\.[0–9]{1,3}])|(([a-zA-Z\-0–9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
};

export const calculateTotal = (value) => {
    let result = 0;
    if (value >= 1 &&value <= 4) result = 2000;
    if (value >= 5 && value <= 8) result = 4000;
    if (value >= 9 && value <= 10) result = 5000;
    if (value >= 11 && value <= 12) result = 5500;
    if (value >= 13 && value <= 20) result = 8000;
    if (value >= 21 && value <= 50) result = 18000;
    if (value >= 51 && value <= 100) result = 34000;
    return result;
}

export const calculateDescriptionTotal = (value, title) => {
    let result = 0;
    if (value >= 1 && value <= 4) result = 2000;
    if (value >= 5 && value <= 8) result = 4000;
    if (value >= 9 && value <= 10) result = 5000;
    if (value >= 11 && value <= 12) result = 5500;
    if (value >= 13 && value <= 20) result = 8000;
    if (value >= 21 && value <= 50) result = 18000;
    if (value >= 51 && value <= 100) result = 34000;
    return `${title} $${result}`;
}
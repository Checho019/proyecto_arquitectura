const emailContraseña = async (email, password) => {
    // Crear Headers
    var myHeaders = new Headers();
    myHeaders.append("accept", "application/json");
    myHeaders.append("api-key", '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');
    myHeaders.append("content-type", "application/json");

    // Json
    var raw = JSON.stringify({
        "sender": {
            "name": "Sergio Duarte",
            "email": "sergioduarte20013@gmail.com"
        },
        "to": [
            {
                "email": email,
                "name": 'xd'
            }
        ],
        "subject": "Completa tu registro en PARK-UD",
        "htmlContent": `<html><head></head><body><p>Su contraseña para ingresar al aplicativo es ${password}</p></body></html>`
    });

    var requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body: raw,
        redirect: 'follow'
    };

    await fetch("https://api.brevo.com/v3/smtp/email", requestOptions)
        .then(response => response.text())
        .then(result => console.log("Correos enviados"))
        .catch(error => console.log('error', error));
}

module.exports = {
    emailContraseña
}
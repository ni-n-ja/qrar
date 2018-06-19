var XHR = (URL, callback) => {
    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = () => {
        if (xhr.readyState == 4 && (xhr.status == 200 || xhr.status == 304)) {
            callback(xhr);
        } else if (xhr.readyState == 4) {
            console.log(xhr.status, xhr.statusText);
            xhr.abort();
        }
    };

    xhr.open('GET', URL, true);
    xhr.setRequestHeader('Content-Type', 'application/json', "charset", "utf-8");
    xhr.send();
};

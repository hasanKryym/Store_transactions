const search = async (type, input) => {
    if (input){
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`http://localhost:5000/api/v1/search/${type}/${input}`, {
                headers: {Authorization: `${token}`}
            });
    
            const parseRes = await response.json();
            return parseRes;
        } catch (err) {
            console.log(err.message);
        }
    }
}

module.exports = search;
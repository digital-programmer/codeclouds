{
    // method to submmitform data from form using AJAX
    let checkPlace = function () {
        // form component
        let newPlaceForm = $('#check-place');
        // get cityname heading
        let setPlaceName = $('#city-name');
        // get resultsTable
        let resultTable = $('#results');
        // when form is submitted, make an ajax call to server
        newPlaceForm.submit(function (e) {
            e.preventDefault();
            const placeInput = $('#checkForPlace').val();

            resultTable.empty();
            $.ajax({
                type: 'post',
                url: '/user/add-place',
                data: newPlaceForm.serialize(),
                success: function (response) {
                    // if data is successfully received, add it to table
                    if (response.data) {
                        // prepare DOM for table
                        const DOM = prepareDOM(response.data);
                        // set summmary heading 
                        setPlaceName.text(`Showing results for ${placeInput}`);
                        // append result to table
                        resultTable.append(DOM);
                        showSuccessMessage("Place Added successfully");
                    } else {
                        showErrorMessage("Error! Place not found");
                    }
                },
                error: function (err) {
                    resultTable.empty();
                    setPlaceName.text(`Showing results for ${placeInput}`);
                    showErrorMessage("Error! Enter correct place name");
                    console.log(err);
                }
            });
            // clear input fields
            $('#checkForPlace').val('');
        });
    }

    // prepare data coming from server to display in DOM
    function prepareDOM(arr) {
        const DOMarr = arr.map((element, index) => {
            return `<tr>
            <th scope="row">${index + 1}</th>
            <td>${element.city}</td>
            <td>${element.lat}</td>
            <td>${element.lng}</td>
            <td>${element.distance}</td>
            <td>${element.distance <= 100 ? "True" : "False"}</td>
        </tr>`
        });
        const DOMstring = DOMarr.join(' ');
        return DOMstring;
    }


    // for success notification
    function showSuccessMessage(message) {
        new Noty({
            theme: 'relax',
            text: message,
            type: 'success',
            layout: 'topRight',
            timeout: 1500,
            progressBar: false
        }).show();
    }

    // for error notification
    function showErrorMessage(message) {
        new Noty({
            theme: 'relax',
            text: message,
            type: 'error',
            layout: 'topRight',
            timeout: 1500,
            progressBar: false
        }).show();
    }

    checkPlace();
}
{
    // method to submmitform data from form using AJAX
    let checkPlace = function () {
        let newPlaceForm = $('#check-place');
        let setPlaceName = $('#city-name');
        let resultTable = $('#results');
        newPlaceForm.submit(function (e) {
            e.preventDefault();
            const placeInput = $('#checkForPlace').val();

            resultTable.empty();
            $.ajax({
                type: 'post',
                url: '/user/add-place',
                data: newPlaceForm.serialize(),
                success: function (response) {
                    if (response.data) {
                        const DOM = prepareDOM(response.data);
                        setPlaceName.text(`Showing results for ${placeInput}`);
                        setPlaceName.val(`Showing results for ${setPlaceName.val()}`);

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
            $('#checkForPlace').val('');
        });
    }

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
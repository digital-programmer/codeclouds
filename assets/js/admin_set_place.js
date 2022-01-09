{
    // method to submmitform data from form using AJAX
    let createPlace = function () {
        let newPlaceForm = $('#set-place');
        newPlaceForm.submit(function (e) {
            e.preventDefault();
            $.ajax({
                type: 'post',
                url: '/admin/add-place',
                data: newPlaceForm.serialize(),
                success: function (response) {
                    if (response.data) {
                        setPlaceName(response.data['name']);
                        showSuccessMessage("Place Updated successfully");
                    } else {
                        showErrorMessage("Error! Place not found");
                    }
                },
                error: function (err) {
                    showErrorMessage("Error! Enter correct place name");
                    console.log(err.responseText);
                }
            });
            $('#set-place input').val('');
        });
    }


    function setPlaceName(name) {
        let placeHolder = $('#place');
        placeHolder.text(name);
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

    createPlace();
}
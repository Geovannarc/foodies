function showError(errorMessage) {
    const errorMessageDiv = document.getElementById('error-message');
    errorMessageDiv.style.display = 'none';
    errorMessageDiv.textContent = '';
    errorMessageDiv.textContent = errorMessage;
    errorMessageDiv.style.display = 'block';
}
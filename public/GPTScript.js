document.addEventListener('DOMContentLoaded', function() {
    const generateButton = document.getElementById('generateScheduleButton');
    const originalButtonText = generateButton.textContent;

    generateButton.addEventListener('click', function() {
        generateButton.textContent = 'Generating...'; // Change the button text
        generateButton.disabled = true; // Disable the button to prevent multiple clicks

        const courseNames = document.getElementById('courseNames').value.split(',').map(name => name.trim());
        const preferredDays = document.getElementById('preferredDays').value.split(',').map(day => day.trim());
        const classTimePreference = document.querySelector('input[name="classTimePreference"]:checked').value;

        const courses = courseNames.map((name, index) => ({
            name: name,
            days: preferredDays[index].split(/[ ,]+/),
            classTime: classTimePreference
        }));

        fetch('/generate-schedule', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ courses })
        })
        .then(response => response.json())
        .then(data => {
            document.getElementById('scheduleResults').innerHTML = `<pre>${data.schedule}</pre>`;
            generateButton.textContent = originalButtonText; // Restore the original button text
            generateButton.disabled = false; // Enable the button
        })
        .catch(error => {
            console.error('Error generating schedule:', error);
            document.getElementById('scheduleResults').innerHTML = `<p>Error: ${error.message}</p>`;
            generateButton.textContent = originalButtonText; // Restore the original button text
            generateButton.disabled = false; // Enable the button
        });
    });
});
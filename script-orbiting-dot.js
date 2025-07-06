// script-orbiting-dot.js
document.addEventListener('DOMContentLoaded', () => {
    // Define rotation speeds in seconds for one full rotation.
    const rotationDurations = {
        'circle-1hr': 90,
        'circle-3hr': 10800,
        'circle-12hr': 43200,
        'circle-24hr': 86400,
        'circle-3day': 259200
    };

    // Get references to DOM elements
    const circles = document.querySelectorAll('.circle');
    const reminderModal = document.getElementById('reminder-modal');
    const modalTitle = document.getElementById('modal-title');
    const reminderTextarea = document.getElementById('reminder-text');
    const setReminderBtn = document.getElementById('set-reminder-btn');
    const clearReminderBtn = document.getElementById('clear-reminder-btn');
    const cancelReminderBtn = document.getElementById('cancel-reminder-btn');

    // Variable to store the ID of the currently selected circle
    let currentCircleId = null;

    // Load reminders from localStorage or initialize an empty object
    let reminders = JSON.parse(localStorage.getItem('circleReminders')) || {};

    /**
     * Updates the animation state and visibility of an orbiting dot.
     * @param {string} circleId - The class name of the circle (e.g., 'circle-1hr').
     * @param {number} duration - The animation duration in seconds.
     * @param {boolean} hasReminder - True if a reminder exists for this circle, false otherwise.
     */
    function updateOrbitingDotAnimation(circleId, duration, hasReminder) {
        const circleElement = document.querySelector(`.${circleId}`);
        if (!circleElement) return; // Exit if circle element not found

        const dotContainer = circleElement.closest('.circle-wrapper').querySelector('.orbiting-dot-container');
        if (!dotContainer) return; // Exit if dot container not found

        if (hasReminder) {
            dotContainer.style.animationDuration = `${duration}s`;
            dotContainer.style.animationPlayState = 'running';
            dotContainer.style.opacity = '1'; // Make visible
        } else {
            dotContainer.style.animationPlayState = 'paused';
            dotContainer.style.opacity = '0'; // Hide it
            // Reset the rotation to 0deg when paused/hidden
            dotContainer.style.transform = 'rotate(0deg)';
        }
    }

    // Initialize animations and event listeners for each circle
    circles.forEach(circle => {
        const className = Array.from(circle.classList).find(cls => cls.startsWith('circle-'));
        const duration = rotationDurations[className];

        // Apply the main circle's spin animation
        if (duration) {
            circle.style.animation = `spin ${duration}s linear infinite`;
        }

        // Initialize the orbiting dot's state based on existing reminders
        updateOrbitingDotAnimation(className, duration, !!reminders[className]);

        // Add a click event listener to each circle wrapper
        circle.closest('.circle-wrapper').addEventListener('click', () => {
            currentCircleId = className;
            const savedReminder = reminders[currentCircleId] || '';

            reminderTextarea.value = savedReminder;

            if (savedReminder) {
                modalTitle.textContent = 'Edit Reminder';
                setReminderBtn.textContent = 'Update Reminder';
                clearReminderBtn.style.display = 'inline-block';
            } else {
                modalTitle.textContent = 'Set Reminder';
                setReminderBtn.textContent = 'Set Reminder';
                clearReminderBtn.style.display = 'none';
            }

            reminderModal.style.display = 'flex';
        });
    });

    // Event listener for the "Set Reminder" / "Update Reminder" button
    setReminderBtn.addEventListener('click', () => {
        const reminderText = reminderTextarea.value.trim();

        if (currentCircleId) {
            if (reminderText) {
                reminders[currentCircleId] = reminderText;
                // Start/continue orbiting animation
                updateOrbitingDotAnimation(currentCircleId, rotationDurations[currentCircleId], true);
            } else {
                delete reminders[currentCircleId];
                // Pause and hide orbiting animation
                updateOrbitingDotAnimation(currentCircleId, rotationDurations[currentCircleId], false);
            }
            localStorage.setItem('circleReminders', JSON.stringify(reminders));
        }
        reminderModal.style.display = 'none';
    });

    // Event listener for the "Clear Reminder" button
    clearReminderBtn.addEventListener('click', () => {
        if (currentCircleId && reminders[currentCircleId]) {
            delete reminders[currentCircleId];
            localStorage.setItem('circleReminders', JSON.stringify(reminders));
            // Pause and hide orbiting animation
            updateOrbitingDotAnimation(currentCircleId, rotationDurations[currentCircleId], false);
        }
        reminderModal.style.display = 'none';
    });

    // Event listener for the "Cancel" button
    cancelReminderBtn.addEventListener('click', () => {
        reminderModal.style.display = 'none';
    });

    // Optional: Close modal if clicking outside the modal content
    reminderModal.addEventListener('click', (event) => {
        if (event.target === reminderModal) {
            reminderModal.style.display = 'none';
        }
    });
});

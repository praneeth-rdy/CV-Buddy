// Feedback submissions go to the existing external form endpoint.
const feedbackForm = document.getElementById('ajax-form');
feedbackForm.addEventListener('submit', async event => {
  event.preventDefault();
  if (!feedbackForm.reportValidity()) return;
  const status = document.getElementById('page-status');
  const submit = feedbackForm.querySelector('[type="submit"]');
  const fields = [...feedbackForm.querySelectorAll('input, textarea, button')];
  const body = new URLSearchParams(new FormData(feedbackForm));
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 20000);
  fields.forEach(field => { field.disabled = true; });
  submit.textContent = 'Sending…';
  status.hidden = true;
  try {
    const response = await fetch(`https://script.google.com/macros/s/${feedbackForm.dataset.id}/exec`, {
      method: 'POST', body, signal: controller.signal
    });
    if (!response.ok) throw new Error('Submission failed');
    status.textContent = 'Thank you for sharing. Your feedback has been sent.';
    status.dataset.error = 'false';
    feedbackForm.reset();
  } catch (error) {
    status.textContent = 'We couldn’t confirm delivery. Your message is still here. Try again, or share your feedback through the GitHub link below.';
    status.dataset.error = 'true';
  } finally {
    clearTimeout(timeout);
    fields.forEach(field => { field.disabled = false; });
    submit.textContent = 'Send feedback ↗';
    status.hidden = false;
  }
});

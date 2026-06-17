The order form in index.html works without a backend by opening a prefilled
WhatsApp message or email addressed to the business contact.

forms/contact.php remains as a fallback for PHP-capable hosting. Successful
PHP submissions return OK, send an email to the configured address when PHP
mail is available, and save a CSV copy in forms/submissions/contact-submissions.csv.

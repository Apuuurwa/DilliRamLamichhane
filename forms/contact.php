<?php
date_default_timezone_set('Asia/Kathmandu');
header('Content-Type: text/plain; charset=UTF-8');

$receiving_email_address = 'sales@manakamanagargasuppliers.com.np';
$site_name = 'Manakamana Garga Suppliers';
$sender_email = 'sales@manakamanagargasuppliers.com.np';

function respond($status_code, $message) {
  http_response_code($status_code);
  echo $message;
  exit;
}

function post_text($key) {
  if (!isset($_POST[$key]) || is_array($_POST[$key])) {
    return '';
  }

  return (string) $_POST[$key];
}

function clean_text($value, $single_line = true) {
  $value = strip_tags($value);
  $value = str_replace("\0", '', $value);

  if ($single_line) {
    $value = preg_replace('/\s+/', ' ', $value);
  } else {
    $value = preg_replace("/\r\n|\r|\n/", "\n", $value);
    $value = preg_replace("/[ \t]+/", ' ', $value);
    $value = preg_replace("/\n{3,}/", "\n\n", $value);
  }

  return trim($value);
}

function csv_safe($value) {
  $value = (string) $value;

  if (preg_match('/^[=\-+@\t\r]/', $value)) {
    return "'" . $value;
  }

  return $value;
}

function save_submission($submission) {
  $storage_dir = __DIR__ . DIRECTORY_SEPARATOR . 'submissions';

  if (!is_dir($storage_dir) && !mkdir($storage_dir, 0755, true) && !is_dir($storage_dir)) {
    return false;
  }

  $csv_file = $storage_dir . DIRECTORY_SEPARATOR . 'contact-submissions.csv';
  $is_new_file = !file_exists($csv_file) || filesize($csv_file) === 0;
  $handle = fopen($csv_file, 'ab');

  if (!$handle) {
    return false;
  }

  if (!flock($handle, LOCK_EX)) {
    fclose($handle);
    return false;
  }

  if ($is_new_file && fputcsv($handle, array_keys($submission)) === false) {
    flock($handle, LOCK_UN);
    fclose($handle);
    return false;
  }

  $row = array_map('csv_safe', array_values($submission));
  $written = fputcsv($handle, $row) !== false;

  fflush($handle);
  flock($handle, LOCK_UN);
  fclose($handle);

  return $written;
}

function send_email($to, $from, $site_name, $submission) {
  $subject = 'Website request: ' . $submission['subject'];

  $body = "New contact form submission\n\n";
  $body .= "Submitted at: " . $submission['submitted_at'] . "\n";
  $body .= "Name: " . $submission['name'] . "\n";
  $body .= "Email: " . $submission['email'] . "\n";
  $body .= "Phone: " . ($submission['phone'] !== '' ? $submission['phone'] : 'Not provided') . "\n";
  $body .= "Service type: " . ($submission['product'] !== '' ? $submission['product'] : 'Not selected') . "\n";
  $body .= "Subject: " . $submission['subject'] . "\n\n";
  $body .= "Message:\n" . $submission['message'] . "\n\n";
  $body .= "IP address: " . $submission['ip_address'] . "\n";

  $headers = [
    'MIME-Version: 1.0',
    'Content-Type: text/plain; charset=UTF-8',
    'From: ' . $site_name . ' <' . $from . '>',
    'Reply-To: ' . $submission['name'] . ' <' . $submission['email'] . '>',
    'X-Mailer: PHP/' . phpversion()
  ];

  return @mail($to, $subject, $body, implode("\r\n", $headers));
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
  header('Allow: POST');
  respond(405, 'Only POST requests are allowed.');
}

$name = clean_text(post_text('name'));
$email = clean_text(post_text('email'));
$phone = clean_text(post_text('phone'));
$product = clean_text(post_text('product'));
$subject = clean_text(post_text('subject'));
$message = clean_text(post_text('message'), false);

if ($name === '' || $email === '' || $subject === '' || $message === '') {
  respond(200, 'Please fill in your name, email, subject, and message.');
}

if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
  respond(200, 'Please enter a valid email address.');
}

if (strlen($name) > 100 || strlen($email) > 200 || strlen($phone) > 60 || strlen($product) > 120 || strlen($subject) > 160 || strlen($message) > 3000) {
  respond(200, 'One or more fields are too long.');
}

$submission = [
  'submitted_at' => date('Y-m-d H:i:s T'),
  'name' => $name,
  'email' => $email,
  'phone' => $phone,
  'product' => $product,
  'subject' => $subject,
  'message' => $message,
  'ip_address' => $_SERVER['REMOTE_ADDR'] ?? '',
  'user_agent' => clean_text($_SERVER['HTTP_USER_AGENT'] ?? '')
];

$saved = save_submission($submission);
$sent = send_email($receiving_email_address, $sender_email, $site_name, $submission);

if (!$saved && !$sent) {
  respond(200, 'Unable to save or send your request. Please call +977 9855061374.');
}

echo 'OK';

<?php
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Headers: Content-Type");

$conn = new mysqli("localhost", "root", "", "portfolio");

if ($conn->connect_error) {
    http_response_code(500);
    echo json_encode(["message" => "DB Connection Failed: " . $conn->connect_error]);
    exit;
}

$raw = file_get_contents("php://input");
$data = json_decode($raw, true);

if (!$data || !isset($data['name'], $data['email'], $data['message'])) {
    http_response_code(400);
    echo json_encode(["message" => "Invalid or missing input data"]);
    exit;
}

$name    = trim(htmlspecialchars($data['name'],    ENT_QUOTES, 'UTF-8'));
$email   = trim(htmlspecialchars($data['email'],   ENT_QUOTES, 'UTF-8'));
$message = trim(htmlspecialchars($data['message'], ENT_QUOTES, 'UTF-8'));

if (empty($name) || empty($email) || empty($message)) {
    http_response_code(400);
    echo json_encode(["message" => "All fields are required"]);
    exit;
}

if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    http_response_code(400);
    echo json_encode(["message" => "Invalid email address"]);
    exit;
}

$sql  = "INSERT INTO contacts (name, email, message) VALUES (?, ?, ?)";
$stmt = $conn->prepare($sql);

if (!$stmt) {
    http_response_code(500);
    echo json_encode(["message" => "Query preparation failed: " . $conn->error]);
    exit;
}

$stmt->bind_param("sss", $name, $email, $message);

if ($stmt->execute()) {
    echo json_encode(["message" => "Message Saved Successfully"]);
} else {
    http_response_code(500);
    echo json_encode(["message" => "Error Saving Data: " . $stmt->error]);
}

$stmt->close();
$conn->close();
?>

<?php
// Prevent direct access to file content
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    exit('Method Not Allowed');
}

// Configuration
// You can set this in your environment or hardcode it here (carefully)
// On Hostinger, you can often set "Environment Variables" in the PHP settings or .htaccess
// Try to load secrets from the ignored file
$secretFile = __DIR__ . '/secure_secrets.php';
if (file_exists($secretFile)) {
    include $secretFile;
    $apiKey = $OPENAI_API_KEY ?? '';
} else {
    // Fallback or Environment Variable
    $apiKey = getenv('OPENAI_API_KEY');
}

if (!$apiKey || !str_starts_with($apiKey, 'sk-')) {
    http_response_code(500);
    echo json_encode(['error' => 'Server configuration error: API key missing or invalid']);
    exit;
}

// Get JSON input
$inputConfig = json_decode(file_get_contents('php://input'), true);
$userMessage = $inputConfig['message'] ?? '';

if (!$userMessage) {
    http_response_code(400);
    echo json_encode(['error' => 'Message is required']);
    exit;
}

// Prepare OpenAI Request
$data = [
    'model' => 'gpt-3.5-turbo',
    'messages' => [
        [
            'role' => 'system',
            'content' => 'You are a helpful website assistant for Hydra Fox Designs. You help users navigate the website, answer questions about services, pricing, contact information, and general inquiries. Keep responses concise and helpful. If users ask about specific technical details or services not clearly defined, guide them to contact the team directly.'
        ],
        [
            'role' => 'user',
            'content' => $userMessage
        ]
    ],
    'max_tokens' => 150,
    'temperature' => 0.7
];

// Send Request
$ch = curl_init('https://api.openai.com/v1/chat/completions');
curl_setopt($ch, CURLOPT_HTTPHEADER, [
    'Content-Type: application/json',
    'Authorization: Bearer ' . $apiKey
]);
curl_setopt($ch, CURLOPT_POST, 1);
curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($data));
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);

$response = curl_exec($ch);
$httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
curl_close($ch);

// Return Response
http_response_code($httpCode);
header('Content-Type: application/json');
echo $response;

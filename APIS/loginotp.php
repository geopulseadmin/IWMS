<?php $curl = curl_init();
curl_setopt_array($curl, [CURLOPT_URL => "https://control.msg91.com/api/v5/otp?otp_expiry=1&template_id=670d1079d6fc053e2f6688d2&mobile=+919669132099&authkey=432414AoNngRMmO670be39eP1&realTimeResponse=1",   CURLOPT_RETURNTRANSFER => true,   CURLOPT_ENCODING => "",   CURLOPT_MAXREDIRS => 10,   CURLOPT_TIMEOUT => 30,   CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,   CURLOPT_CUSTOMREQUEST => "POST",   CURLOPT_POSTFIELDS => "{\n  \"Param1\": \"value1\",\n  \"Param2\": \"value2\",\n  \"Param3\": \"value3\"\n}",   CURLOPT_HTTPHEADER => ["Content-Type: application/JSON"],]);
$response = curl_exec($curl);
$err = curl_error($curl);
curl_close($curl);
if ($err) {
    echo "cURL Error #:" . $err;
} else {
    echo $response;
}

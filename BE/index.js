const mqtt = require('mqtt');
const readline = require('readline');
const mysql = require('mysql');

const db = mysql.createConnection({
  host: 'localhost', // Thay đổi hostname nếu MySQL của bạn chạy trên máy khác
  user: 'root', // Tên đăng nhập MySQL
  password: null, // Mật khẩu MySQL
  database: 'iot' // Tên database MySQL
});

db.connect(function (err) {
  if (err) {
    console.error('Lỗi kết nối MySQL:', err);
    return;
  }
  console.log('Đã kết nối MySQL');
});

const brokerUrl = 'mqtt://192.168.43.24:1999';
const clientId = 'mqtt_client';
const username = 'Luc';
const password = '123';

const client = mqtt.connect(brokerUrl, {
  clientId: clientId,
  username: username,
  password: password
});

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function sendToTopic() {
  rl.question('Nhập topic: ', (topic) => {
    if (topic === 'den' || topic === 'quat') {
      rl.question('Nhập trạng thái đèn (bật/tắt): ', (message) => {
        client.publish(topic, message, function (err) {
          if (err) {
            console.error('Lỗi khi publish:', err);
          } else {
            console.log(`Tin nhắn đã được gửi thành công tới topic "${topic}"`);
          }
          const timestamp = new Date().toISOString().slice(0, 19).replace('T', ' ');
          if (topic === 'den') {
            db.query('INSERT INTO quatvaden (status, created, deviceID) VALUES (?, ?, ?)', [message, timestamp, 'den'], function (err, result) {
              if (err) {
                console.error('Lỗi lưu dữ liệu MySQL:', err);
                return;
              }
              console.log('Đã lưu dữ liệu thành công');
              sendToTopic();
            });
          } else if (topic === 'quat') {
            db.query('INSERT INTO quatvaden (status, created, deviceID) VALUES (?, ?, ?)', [message, timestamp, 'quat'], function (err, result) {
              if (err) {
                console.error('Lỗi lưu dữ liệu MySQL:', err);
                return;
              }
              console.log('Đã lưu dữ liệu thành công');
              sendToTopic();
            });
          }
        });
      });
    } else if (topic === 'data') {
      client.subscribe('data', function (err) {
        if (err) {
        console.error('Lỗi khi subscribe:', err);
        } else {
        console.log('Đã subscribe tới topic "data"');
        }
        });
    } else {
      console.log('Topic không hợp lệ. Vui lòng nhập lại.');
      sendToTopic();
    }
  });
}

client.on('connect', function () {
  console.log('Đã kết nối tới máy chủ MQTT');
  sendToTopic();
});

client.on('message', function (topic, message) {
  // Xử lý thông điệp từ thiết bị IoT
  if (topic === 'data') {
    const jsonData = JSON.parse(message.toString());
    console.log('Thông tin từ topic "data":');
    console.log('Nhiệt độ:', Math.round(jsonData['Temp']), '°C');
    console.log('Độ ẩm:', jsonData['Hum'], '%');
    console.log('Ánh sáng:', jsonData['Light'], 'lux');
    const timestamp = new Date().toISOString().slice(0, 19).replace('T', ' ');
    db.query('INSERT INTO cambien (Nhiet_do, Do_am, Anh_sang, created) VALUES (?, ?, ?, ?)', [Math.round(jsonData['Temp']), jsonData['Hum'], jsonData['Light'], timestamp], function (err, result) {
      if (err) {
        console.error('Lỗi lưu dữ liệu MySQL:', err);
        return;
      }
      console.log('Đã lưu dữ liệu vào MySQL');
    });
  }
});

client.on('close', function () {
  console.log('Kết nối đã bị đóng');
});

client.on('error', function (err) {
  console.error('Lỗi kết nối:', err);
});

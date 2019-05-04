socket= new WebSocket('ws://127.0.0.1:5005');
socket.onopen= function() {
    socket.send('up');
};
socket.onmessage= function(s) {
    console.log(s.data);
};
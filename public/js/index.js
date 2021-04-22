$(document).ready(() => {
  $('#wateringMode').change(function () {
    let mode = $(this).is(':checked');
    console.log('Mode status: ', mode);

    if (mode) {
      $('#valveButton').bootstrapToggle('disable');
    } else {
      $('#valveButton').bootstrapToggle('enable');
    }

    $.post('/updateState', { mode: mode }, (data, status) => {
      console.log('Post request status: ', status);
    });
  });

  $('#valveButton').change(function () {
    let valveStatus = $(this).is(':checked');
    console.log('Valve button status: ', valveStatus);

    $.post('/updateState', { valveStatus: valveStatus }, (data, status) => {
      console.log('Post request status: ', status);
    });
  });

  $('#thresholdSlider').on('change', function (e) {
    let threshold = $(this).val();
    $('#thresholdValue').text(threshold);

    $.post('/updateState', { threshold: threshold }, (data, status) => {
      console.log('Post request status: ', status);
    });
  });

  const socket = io();
  socket.on('valveStatusUpdate', (data) => {
    console.log('IO socket status: ', data);
  });
});
